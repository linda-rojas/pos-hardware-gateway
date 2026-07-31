import { Injectable } from '@nestjs/common';
import { PrintReceiptDto, ReceiptLineDto } from '../dto/print-receipt.dto';
import { WindowsRawPrinterAdapter } from '../../cash-drawer/infrastructure/windows-raw-printer.adapter';
import { Jimp } from 'jimp';

/**
 * ESC/POS byte constants
 * Reference: https://download4.epson.biz/sec_pubs/pos/reference_05/en/escpos_ref.pdf
 */
const ESC = 0x1b;
const GS = 0x1d;
const LF = 0x0a;

// Initialize printer
const INIT = [ESC, 0x40];

// Alignment
const ALIGN_LEFT = [ESC, 0x61, 0x00];
const ALIGN_CENTER = [ESC, 0x61, 0x01];
const ALIGN_RIGHT = [ESC, 0x61, 0x02];

// Bold on / off
const BOLD_ON = [ESC, 0x45, 0x01];
const BOLD_OFF = [ESC, 0x45, 0x00];

// Double size on / off  (GS ! n  — bit 4 = double height, bit 0 = double width)
const DOUBLE_SIZE_ON = [GS, 0x21, 0x11];
const DOUBLE_SIZE_OFF = [GS, 0x21, 0x00];

// Cut paper (full cut after feed)
const CUT_PAPER = [GS, 0x56, 0x41, 0x05];

// Cash drawer pulse on pin 2  (ESC p m t1 t2)
const OPEN_DRAWER = [ESC, 0x70, 0x00, 0x19, 0xfa];

/** Thermal receipt width in characters (48 col for 80mm, 32 col for 58mm) */
const RECEIPT_WIDTH = 48;
const DIVIDER_CHAR = '-';

/** Default max image width in pixels for 80mm printer at 203dpi */
const DEFAULT_IMAGE_WIDTH = 384;

@Injectable()
export class PrintReceiptUseCase {
  constructor(
    private readonly rawPrinterAdapter: WindowsRawPrinterAdapter,
  ) { }

  async execute(dto: PrintReceiptDto): Promise<{ printerName: string; printedAt: string }> {
    const bytes: number[] = [];

    // 1. Init
    bytes.push(...INIT);

    // 2. Open drawer BEFORE printing if requested (customer gets change while receipt prints)
    if (dto.openDrawer) {
      bytes.push(...OPEN_DRAWER);
    }

    // 3. Render each line — image lines are async, rest are sync
    for (const line of dto.lines) {
      if (line.imageBase64) {
        const imgBytes = await this.renderImage(line.imageBase64, line.imageWidth ?? DEFAULT_IMAGE_WIDTH);
        bytes.push(...imgBytes);
      } else {
        bytes.push(...this.renderLine(line));
      }
    }

    // 4. Feed a few lines so the last line is visible above the cutter
    bytes.push(LF, LF, LF);

    // 5. Cut paper
    const shouldCut = dto.cutPaper !== false; // default true
    if (shouldCut) {
      bytes.push(...CUT_PAPER);
    }

    await this.rawPrinterAdapter.sendRawBytes(dto.printerName, bytes);

    return {
      printerName: dto.printerName,
      printedAt: new Date().toISOString(),
    };
  }

  // ── Private helpers ────────────────────────────────────────────────────────

  private renderLine(line: ReceiptLineDto): number[] {
    const bytes: number[] = [];

    // Blank line
    if (line.blank) {
      bytes.push(LF);
      return bytes;
    }

    // Divider line
    if (line.divider) {
      bytes.push(...ALIGN_LEFT);
      bytes.push(...this.encodeText(DIVIDER_CHAR.repeat(RECEIPT_WIDTH)));
      bytes.push(LF);
      return bytes;
    }

    // Alignment
    switch (line.align) {
      case 'center': bytes.push(...ALIGN_CENTER); break;
      case 'right': bytes.push(...ALIGN_RIGHT); break;
      default: bytes.push(...ALIGN_LEFT); break;
    }

    // Bold
    if (line.bold) bytes.push(...BOLD_ON);

    // Double size
    if (line.doubleSize) bytes.push(...DOUBLE_SIZE_ON);

    // Text content
    bytes.push(...this.encodeText(line.text ?? ''));
    bytes.push(LF);

    // Reset formatting
    if (line.doubleSize) bytes.push(...DOUBLE_SIZE_OFF);
    if (line.bold) bytes.push(...BOLD_OFF);

    return bytes;
  }

  /**
   * Converts a base64 image to ESC/POS GS v 0 raster bitmap bytes.
   *
   * Steps:
   *  1. Decode base64 → Buffer
   *  2. Load with Jimp, resize to maxWidth keeping aspect ratio
   *  3. Convert each pixel to 1-bit (threshold at 128)
   *  4. Pack 8 pixels per byte (MSB first) into raster rows
   *  5. Prepend GS v 0 header with width/height
   *
   * GS v 0 format:
   *   GS 0x76 0x30 m xL xH yL yH [data]
   *   m=0 (normal), xL/xH = bytes per row (width/8), yL/yH = rows (height)
   */
  private async renderImage(base64: string, maxWidth: number): Promise<number[]> {
    try {
      // Strip data URI prefix if present (e.g. "data:image/png;base64,...")
      const raw = base64.includes(',') ? base64.split(',')[1] : base64;
      const buffer = Buffer.from(raw, 'base64');

      // Load image with Jimp
      const img = await Jimp.fromBuffer(buffer);

      // Resize to maxWidth if wider, maintaining aspect ratio
      if (img.width > maxWidth) {
        const ratio = maxWidth / img.width;
        const newHeight = Math.round(img.height * ratio);
        img.resize({ w: maxWidth, h: newHeight });
      }

      const imgWidth = img.width;
      const imgHeight = img.height;

      // ESC/POS requires width to be a multiple of 8
      const bytesPerRow = Math.ceil(imgWidth / 8);

      // GS v 0 header: m=0 (normal density)
      const xL = bytesPerRow & 0xff;
      const xH = (bytesPerRow >> 8) & 0xff;
      const yL = imgHeight & 0xff;
      const yH = (imgHeight >> 8) & 0xff;

      const bytes: number[] = [];

      // Center the image
      bytes.push(...ALIGN_CENTER);

      // GS v 0 command
      bytes.push(GS, 0x76, 0x30, 0x00, xL, xH, yL, yH);

      // Rasterize: scan row by row, pack 8 pixels per byte (1=dark, 0=light)
      for (let y = 0; y < imgHeight; y++) {
        for (let byteX = 0; byteX < bytesPerRow; byteX++) {
          let byte = 0;
          for (let bit = 0; bit < 8; bit++) {
            const x = byteX * 8 + bit;
            if (x < imgWidth) {
              const rgba = img.getPixelColor(x, y);
              // Extract RGB from RGBA int (jimp stores as 0xRRGGBBAA)
              const r = (rgba >>> 24) & 0xff;
              const g = (rgba >>> 16) & 0xff;
              const b = (rgba >>> 8) & 0xff;
              const a = rgba & 0xff;
              // Luminance — treat transparent pixels as white
              const lum = a < 128 ? 255 : Math.round(0.299 * r + 0.587 * g + 0.114 * b);
              // Dark pixel (lum < 128) → bit = 1
              if (lum < 128) {
                byte |= (0x80 >> bit);
              }
            }
            // Pixels beyond imgWidth are padded as white (bit=0)
          }
          bytes.push(byte);
        }
      }

      // Reset alignment to left after image
      bytes.push(...ALIGN_LEFT);
      bytes.push(LF);

      return bytes;
    } catch {
      // If image processing fails, skip silently — don't crash the receipt
      return [LF];
    }
  }

  /**
   * Encodes a JS string to a byte array using Latin-1 (CP1252 / ISO-8859-1).
   * Most thermal printers default to this code page.
   * Characters outside Latin-1 are replaced with '?' to avoid garbage output.
   */
  private encodeText(text: string): number[] {
    const bytes: number[] = [];
    for (const char of text) {
      const code = char.charCodeAt(0);
      if (code <= 0xff) {
        bytes.push(code);
      } else {
        bytes.push(0x3f); // '?'
      }
    }
    return bytes;
  }
}

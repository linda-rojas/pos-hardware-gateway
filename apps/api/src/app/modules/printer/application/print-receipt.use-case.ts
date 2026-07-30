import { Injectable } from '@nestjs/common';
import { PrintReceiptDto, ReceiptLineDto } from '../dto/print-receipt.dto';
import { WindowsRawPrinterAdapter } from '../../cash-drawer/infrastructure/windows-raw-printer.adapter';

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

    // 3. Render each line
    for (const line of dto.lines) {
      bytes.push(...this.renderLine(line));
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

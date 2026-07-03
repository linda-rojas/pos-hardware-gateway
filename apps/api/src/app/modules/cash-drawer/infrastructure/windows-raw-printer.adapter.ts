import { Injectable } from '@nestjs/common';
import { execFile } from 'child_process';

@Injectable()
export class WindowsRawPrinterAdapter {
    sendRawBytes(printerName: string, bytes: number[]): Promise<void> {
        return new Promise((resolve, reject) => {
            const escapedPrinterName = this.escapePowerShellString(printerName);
            const byteList = bytes.join(',');

            const script = `
$printerName = "${escapedPrinterName}"
[byte[]]$bytes = @(${byteList})

$signature = @"
using System;
using System.Runtime.InteropServices;

public class RawPrinterHelper
{
    [StructLayout(LayoutKind.Sequential, CharSet = CharSet.Ansi)]
    public class DOCINFOA
    {
        [MarshalAs(UnmanagedType.LPStr)]
        public string pDocName;
        [MarshalAs(UnmanagedType.LPStr)]
        public string pOutputFile;
        [MarshalAs(UnmanagedType.LPStr)]
        public string pDataType;
    }

    [DllImport("winspool.Drv", EntryPoint="OpenPrinterA", SetLastError=true, CharSet=CharSet.Ansi, ExactSpelling=true, CallingConvention=CallingConvention.StdCall)]
    public static extern bool OpenPrinter(string szPrinter, out IntPtr hPrinter, IntPtr pd);

    [DllImport("winspool.Drv", EntryPoint="ClosePrinter", SetLastError=true, ExactSpelling=true, CallingConvention=CallingConvention.StdCall)]
    public static extern bool ClosePrinter(IntPtr hPrinter);

    [DllImport("winspool.Drv", EntryPoint="StartDocPrinterA", SetLastError=true, CharSet=CharSet.Ansi, ExactSpelling=true, CallingConvention=CallingConvention.StdCall)]
    public static extern bool StartDocPrinter(IntPtr hPrinter, Int32 level, [In, MarshalAs(UnmanagedType.LPStruct)] DOCINFOA di);

    [DllImport("winspool.Drv", EntryPoint="EndDocPrinter", SetLastError=true, ExactSpelling=true, CallingConvention=CallingConvention.StdCall)]
    public static extern bool EndDocPrinter(IntPtr hPrinter);

    [DllImport("winspool.Drv", EntryPoint="StartPagePrinter", SetLastError=true, ExactSpelling=true, CallingConvention=CallingConvention.StdCall)]
    public static extern bool StartPagePrinter(IntPtr hPrinter);

    [DllImport("winspool.Drv", EntryPoint="EndPagePrinter", SetLastError=true, ExactSpelling=true, CallingConvention=CallingConvention.StdCall)]
    public static extern bool EndPagePrinter(IntPtr hPrinter);

    [DllImport("winspool.Drv", EntryPoint="WritePrinter", SetLastError=true, ExactSpelling=true, CallingConvention=CallingConvention.StdCall)]
    public static extern bool WritePrinter(IntPtr hPrinter, IntPtr pBytes, Int32 dwCount, out Int32 dwWritten);

    public static bool SendBytesToPrinter(string printerName, byte[] bytes)
    {
        IntPtr hPrinter;
        DOCINFOA di = new DOCINFOA();
        di.pDocName = "POS Hardware Gateway Raw Command";
        di.pDataType = "RAW";

        if (!OpenPrinter(printerName.Normalize(), out hPrinter, IntPtr.Zero))
        {
            return false;
        }

        if (!StartDocPrinter(hPrinter, 1, di))
        {
            ClosePrinter(hPrinter);
            return false;
        }

        if (!StartPagePrinter(hPrinter))
        {
            EndDocPrinter(hPrinter);
            ClosePrinter(hPrinter);
            return false;
        }

        IntPtr unmanagedBytes = Marshal.AllocCoTaskMem(bytes.Length);
        Marshal.Copy(bytes, 0, unmanagedBytes, bytes.Length);

        int written;
        bool success = WritePrinter(hPrinter, unmanagedBytes, bytes.Length, out written);

        Marshal.FreeCoTaskMem(unmanagedBytes);
        EndPagePrinter(hPrinter);
        EndDocPrinter(hPrinter);
        ClosePrinter(hPrinter);

        return success && written == bytes.Length;
    }
}
"@

Add-Type -TypeDefinition $signature

$result = [RawPrinterHelper]::SendBytesToPrinter($printerName, $bytes)

if (-not $result) {
  throw "No se pudo enviar comando RAW a la impresora $printerName"
}
`;

            execFile(
                'powershell.exe',
                ['-NoProfile', '-ExecutionPolicy', 'Bypass', '-Command', script],
                { windowsHide: true },
                (error, stdout, stderr) => {
                    if (error) {
                        reject(
                            new Error(
                                `Error sending raw command to ${printerName}: ${stderr || error.message
                                }`
                            )
                        );
                        return;
                    }

                    resolve();
                }
            );
        });
    }

    private escapePowerShellString(value: string): string {
        return value.replace(/"/g, '`"');
    }
}
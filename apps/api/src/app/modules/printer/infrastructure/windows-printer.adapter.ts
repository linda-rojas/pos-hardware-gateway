import { Injectable } from '@nestjs/common';
import { execFile } from 'child_process';

@Injectable()
export class WindowsPrinterAdapter {
    printText(printerName: string, text: string): Promise<void> {
        return new Promise((resolve, reject) => {
            const script = `
$printerName = "${this.escapePowerShellString(printerName)}"
$text = @"
${text}
"@
$text | Out-Printer -Name $printerName
`;

            execFile(
                'powershell.exe',
                ['-NoProfile', '-ExecutionPolicy', 'Bypass', '-Command', script],
                {
                    windowsHide: true,
                },
                (error, stdout, stderr) => {
                    if (error) {
                        reject(
                            new Error(
                                `Error printing to ${printerName}: ${stderr || error.message}`
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
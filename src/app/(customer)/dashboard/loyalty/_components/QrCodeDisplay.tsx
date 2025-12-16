'use client';

import { QRCodeSVG } from 'qrcode.react';

export function QrCodeDisplay({ userId }: { userId: string }) {
    // Die Lade-Logik wird entfernt, da die userId vom Server immer vorhanden ist.
    // Der QR-Code wird jetzt direkt und ohne Verzögerung gerendert.
    const qrData = `senoner-user:${userId}`;
    
    return (
        <div className="bg-white p-4 rounded-lg shadow-inner">
             <QRCodeSVG value={qrData} size={256} className="w-full h-full" />
            <p className="text-center mt-2 font-mono text-xs text-muted-foreground break-all">{qrData}</p>
        </div>
    );
}

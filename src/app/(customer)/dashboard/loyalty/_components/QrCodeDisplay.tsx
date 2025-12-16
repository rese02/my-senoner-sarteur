
'use client';

import { QRCodeSVG } from 'qrcode.react';

export function QrCodeDisplay({ userId }: { userId: string }) {
    if (!userId) {
        return (
             <div className="bg-gray-200 animate-pulse p-4 rounded-lg shadow-inner w-full aspect-square">
                 <p className="text-center text-sm text-muted-foreground">Lade QR Code...</p>
            </div>
        )
    }
    const qrData = `senoner-user:${userId}`;
    return (
        <div className="bg-white p-4 rounded-lg shadow-inner">
             <QRCodeSVG value={qrData} size={256} className="w-full h-full" />
            <p className="text-center mt-2 font-mono text-xs text-muted-foreground break-all">{qrData}</p>
        </div>
    );
}

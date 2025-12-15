
'use client';
import dynamic from 'next/dynamic';
import { Loader2 } from 'lucide-react';

const SommelierCamera = dynamic(() => 
    import('./_components/SommelierCamera').then(mod => mod.SommelierCamera), 
    { 
        ssr: false,
        loading: () => (
            <div className="fixed inset-0 bg-black flex flex-col items-center justify-center text-white">
                <Loader2 className="w-12 h-12 animate-spin text-primary" />
                <p className="mt-4">Kamera wird geladen...</p>
            </div>
        ),
    }
);

export default function SommelierPage() {
    return <SommelierCamera />;
}

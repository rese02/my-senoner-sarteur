

'use client';
import Link from "next/link";
import { Separator } from "../ui/separator";
import { useLanguage } from "../providers/LanguageProvider";

export function AppFooter() {
    const currentYear = new Date().getFullYear();
    const { t } = useLanguage();

    return (
        <footer className="mt-12 pt-8">
            <Separator />
            <div className="container mx-auto py-6 text-center text-xs text-muted-foreground md:flex md:items-center md:justify-between">
                <p>&copy; {currentYear} Senoner Sarteur. All rights reserved.</p>
                <div className="flex justify-center gap-4 mt-2 md:mt-0">
                    <Link href="/impressum" className="hover:text-primary transition-colors">
                        {t.common.impressum}
                    </Link>
                    <Link href="/datenschutz" className="hover:text-primary transition-colors">
                        {t.common.privacy}
                    </Link>
                </div>
            </div>
        </footer>
    );
}

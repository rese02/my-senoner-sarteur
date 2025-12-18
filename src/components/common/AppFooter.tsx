
import Link from "next/link";
import { Separator } from "../ui/separator";

export function AppFooter() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="mt-12 pt-8">
            <Separator />
            <div className="container mx-auto py-6 text-center text-xs text-muted-foreground md:flex md:items-center md:justify-between">
                <p>&copy; {currentYear} Senoner Sarteur. Alle Rechte vorbehalten.</p>
                <div className="flex justify-center gap-4 mt-2 md:mt-0">
                    <Link href="/impressum" className="hover:text-primary transition-colors">
                        Impressum
                    </Link>
                    <Link href="/datenschutz" className="hover:text-primary transition-colors">
                        Datenschutz
                    </Link>
                </div>
            </div>
        </footer>
    );
}

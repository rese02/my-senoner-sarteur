
'use client';
import { useLanguage } from "@/components/providers/LanguageProvider";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function LanguageSwitcher() {
  const { lang, setLang } = useLanguage();

  const buttonStyle = (language: 'de' | 'it' | 'en') => {
    const isActive = lang === language;
    return cn(
        "w-full h-9 text-xs",
        isActive
            ? 'bg-primary-foreground text-primary'
            : 'bg-transparent border border-primary-foreground/50 text-primary-foreground/70 hover:bg-primary-foreground/10 hover:text-white'
    );
  };

  return (
    <div className="flex gap-2 justify-center w-full">
      <Button 
        variant={lang === 'de' ? 'default' : 'outline'} 
        size="sm" 
        onClick={() => setLang('de')}
        className={buttonStyle('de')}
      >
        DE
      </Button>
      <Button 
        variant={lang === 'it' ? 'default' : 'outline'} 
        size="sm" 
        onClick={() => setLang('it')}
        className={buttonStyle('it')}
      >
        IT
      </Button>
      <Button 
        variant={lang === 'en' ? 'default' : 'outline'} 
        size="sm" 
        onClick={() => setLang('en')}
        className={buttonStyle('en')}
      >
        EN
      </Button>
    </div>
  );
}

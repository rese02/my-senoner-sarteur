
'use client';
import { useLanguage } from "@/components/providers/LanguageProvider";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function LanguageSwitcher() {
  const { lang, setLang } = useLanguage();

  const buttonStyle = (language: 'de' | 'it' | 'en') => {
    const isActive = lang === language;
    return cn(
      "w-full h-9 text-xs rounded-lg",
      isActive
        ? 'bg-secondary text-secondary-foreground shadow-sm' // Active state
        : 'bg-transparent text-muted-foreground hover:bg-secondary/50' // Inactive state
    );
  };

  return (
    <div className="flex gap-1 justify-center w-full p-1 rounded-lg">
      <Button 
        variant="ghost" 
        size="sm" 
        onClick={() => setLang('de')}
        className={buttonStyle('de')}
      >
        DE
      </Button>
      <Button 
        variant="ghost" 
        size="sm" 
        onClick={() => setLang('it')}
        className={buttonStyle('it')}
      >
        IT
      </Button>
      <Button 
        variant="ghost" 
        size="sm" 
        onClick={() => setLang('en')}
        className={buttonStyle('en')}
      >
        EN
      </Button>
    </div>
  );
}

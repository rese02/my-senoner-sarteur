
'use client';
import { useLanguage } from "@/components/providers/LanguageProvider";
import { Button } from "@/components/ui/button";

export function LanguageSwitcher() {
  const { lang, setLang } = useLanguage();

  return (
    <div className="flex gap-2 justify-center py-2">
      <Button 
        variant={lang === 'de' ? 'default' : 'outline'} 
        size="sm" 
        onClick={() => setLang('de')}
      >
        DE
      </Button>
      <Button 
        variant={lang === 'it' ? 'default' : 'outline'} 
        size="sm" 
        onClick={() => setLang('it')}
      >
        IT
      </Button>
      <Button 
        variant={lang === 'en' ? 'default' : 'outline'} 
        size="sm" 
        onClick={() => setLang('en')}
      >
        EN
      </Button>
    </div>
  );
}

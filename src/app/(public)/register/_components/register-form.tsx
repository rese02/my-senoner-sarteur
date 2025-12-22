

'use client';

import { useForm } from 'react-hook-form';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { SubmitButton } from '@/components/custom/SubmitButton';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import Link from 'next/link';
import { registerUser, createSession } from '@/app/actions/auth.actions';
import { Mail, Lock, User as UserIcon, Phone, Home, Building, Eye, EyeOff } from 'lucide-react';
import { useState, useTransition } from 'react';
import { cn } from '@/lib/utils';
import { initializeFirebase } from '@/firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { useLanguage } from '@/components/providers/LanguageProvider';

export function RegisterForm() {
  const { toast } = useToast();
  const { t } = useLanguage();
  const [isPending, startTransition] = useTransition();
  const [showPassword, setShowPassword] = useState(false);
  const { auth } = initializeFirebase();

  // Zod schema is now defined inside the component to access translations
  const formSchema = z.object({
      name: z.string().min(2, { message: "Bitte geben Sie einen gültigen Namen ein." }), 
      email: z.string().email({ message: "Bitte geben Sie eine gültige E-Mail ein." }),
      password: z.string().min(8, { message: "Das Passwort muss mindestens 8 Zeichen lang sein." }),
      phone: z.string().min(5, { message: "Bitte geben Sie eine gültige Telefonnummer ein." }),
      street: z.string().min(3, { message: "Bitte geben Sie eine Straße ein." }),
      city: z.string().min(2, { message: "Bitte geben Sie einen Ort ein." }),
      zip: z.string().min(4, { message: "Bitte geben Sie eine PLZ ein." }),
      province: z.string().min(2, { message: "Bitte geben Sie eine Provinz ein." }),
      privacyPolicy: z.boolean().refine((val) => val === true, {
        message: "Die Annahme der Datenschutzerklärung ist erforderlich.",
      }),
      marketingConsent: z.boolean().optional(),
      profilingConsent: z.boolean().optional(),
    });


  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      phone: '',
      street: '',
      city: 'Wolkenstein',
      zip: '39048',
      province: 'BZ',
      privacyPolicy: false,
      marketingConsent: false,
      profilingConsent: false,
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    startTransition(async () => {
        const result = await registerUser(values);

        if (result.success) {
            toast({
                title: 'Registrierung erfolgreich!',
                description: 'Sie werden nun automatisch angemeldet...',
            });
            
            try {
                const userCredential = await signInWithEmailAndPassword(auth, values.email, values.password);
                const idToken = await userCredential.user.getIdToken();
                await createSession(idToken);
                
            } catch (authError: any) {
                if (authError.digest?.includes('NEXT_REDIRECT')) {
                  throw authError;
                }
                toast({
                    variant: 'destructive',
                    title: 'Automatischer Login fehlgeschlagen',
                    description: 'Bitte loggen Sie sich manuell ein.',
                });
                window.location.href = '/login';
            }
        } else {
           toast({
            variant: 'destructive',
            title: 'Registrierung fehlgeschlagen',
            description: result.error,
          });
        }
    });
  }

  const getIconColor = (hasValue: boolean) => hasValue ? 'text-primary' : 'text-muted-foreground';

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="sr-only">{t.profile.fullName}</FormLabel>
              <FormControl>
                <div className="relative">
                  <UserIcon className={cn("absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5", getIconColor(!!field.value))} />
                  <Input placeholder={t.profile.fullName} {...field} className="pl-10" />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="sr-only">{t.profile.email}</FormLabel>
              <FormControl>
                <div className="relative">
                  <Mail className={cn("absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5", getIconColor(!!field.value))} />
                  <Input placeholder={t.profile.email} {...field} className="pl-10" />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="sr-only">Passwort</FormLabel>
              <FormControl>
                <div className="relative">
                  <Lock className={cn("absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5", getIconColor(!!field.value))} />
                  <Input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Passwort (min. 8 Zeichen)"
                    {...field}
                    className="pl-10 pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="sr-only">{t.profile.phone}</FormLabel>
              <FormControl>
                <div className="relative">
                  <Phone className={cn("absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5", getIconColor(!!field.value))} />
                  <Input placeholder={t.profile.phone} {...field} className="pl-10" />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="grid grid-cols-1 gap-4 pt-4 border-t border-border">
          <FormField
            control={form.control}
            name="street"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="sr-only">{t.profile.street}</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Home className={cn("absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5", getIconColor(!!field.value))} />
                    <Input placeholder={t.profile.street} {...field} className="pl-10" />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="grid grid-cols-3 gap-2">
            <FormField
              control={form.control}
              name="zip"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="sr-only">{t.profile.zip}</FormLabel>
                  <FormControl>
                    <Input placeholder={t.profile.zip} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="city"
              render={({ field }) => (
                <FormItem className="col-span-2">
                  <FormLabel className="sr-only">{t.profile.city}</FormLabel>
                  <FormControl>
                    <Input placeholder={t.profile.city} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <FormField
            control={form.control}
            name="province"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="sr-only">{t.profile.province}</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Building className={cn("absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5", getIconColor(!!field.value))} />
                    <Input placeholder={t.profile.province} {...field} className="pl-10" />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <div className="space-y-4 pt-4 border-t border-border">
            <FormField
              control={form.control}
              name="privacyPolicy"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md">
                  <FormControl>
                    <Checkbox 
                      checked={field.value} 
                      onCheckedChange={field.onChange} 
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none text-muted-foreground">
                    <FormLabel>
                      {t.register.privacyLabel}{' '}
                      <Link href="/datenschutz" target="_blank" className="font-semibold text-primary underline hover:no-underline">
                        {t.register.privacyLink}
                      </Link>
                      {' '}{t.register.privacySuffix} <span className="text-destructive">*</span>
                    </FormLabel>
                    <FormMessage />
                  </div>
                </FormItem>
              )}
            />
             <div className="my-4 border-t"></div>
             <p className="text-sm font-medium text-muted-foreground">{t.register.consentTitle}</p>
             <FormField
              control={form.control}
              name="marketingConsent"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md">
                  <FormControl>
                    <Checkbox 
                      checked={field.value} 
                      onCheckedChange={field.onChange} 
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none text-muted-foreground">
                    <FormLabel>
                     {t.register.consentMarketing}
                    </FormLabel>
                     <p className="text-xs text-muted-foreground/80">{t.register.consentMarketingDesc}</p>
                    <FormMessage />
                  </div>
                </FormItem>
              )}
            />
             <FormField
              control={form.control}
              name="profilingConsent"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md">
                  <FormControl>
                    <Checkbox 
                      checked={field.value} 
                      onCheckedChange={field.onChange} 
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none text-muted-foreground">
                    <FormLabel>
                     {t.register.consentProfiling}
                    </FormLabel>
                    <FormMessage />
                  </div>
                </FormItem>
              )}
            />
        </div>


        <SubmitButton className="w-full" variant="default" isSubmitting={isPending}>
            {t.register.submitButton}
        </SubmitButton>
      </form>
    </Form>
  );
}

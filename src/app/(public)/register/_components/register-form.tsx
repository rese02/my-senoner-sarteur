
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
import { useState } from 'react';
import { cn } from '@/lib/utils';
import { Separator } from '@/components/ui/separator';
import { initializeFirebase } from '@/firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';

const formSchema = z.object({
  name: z.string().min(2, { message: 'Name muss mindestens 2 Zeichen lang sein.' }),
  email: z.string().email({ message: 'Bitte geben Sie eine gültige E-Mail ein.' }),
  password: z.string().min(8, { message: 'Das Passwort muss mindestens 8 Zeichen lang sein.' }),
  phone: z.string().min(5, { message: 'Bitte geben Sie eine gültige Telefonnummer ein.' }),
  street: z.string().min(3, { message: 'Bitte geben Sie eine Straße ein.' }),
  city: z.string().min(2, { message: 'Bitte geben Sie einen Ort ein.' }),
  zip: z.string().min(4, { message: 'Bitte geben Sie eine PLZ ein.' }),
  province: z.string().min(2, { message: 'Bitte geben Sie eine Provinz ein.' }),
  privacyPolicy: z.boolean().refine((val) => val === true, {
    message: 'Die Annahme der Datenschutzerklärung ist erforderlich.',
  }),
  marketingConsent: z.boolean().optional(),
  profilingConsent: z.boolean().optional(),
});

export function RegisterForm() {
  const { toast } = useToast();
  const [showPassword, setShowPassword] = useState(false);
  const { auth } = initializeFirebase();

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
    const result = await registerUser(values);

    if (result.success) {
        toast({
            title: 'Registrierung erfolgreich!',
            description: 'Sie werden nun automatisch angemeldet...',
        });
        
        try {
            // Nach erfolgreicher Registrierung den Benutzer automatisch anmelden
            const userCredential = await signInWithEmailAndPassword(auth, values.email, values.password);
            const idToken = await userCredential.user.getIdToken();
            
            // Session auf dem Server erstellen, was den Redirect auslöst
            await createSession(idToken);
            
        } catch (authError: any) {
             // WICHTIG: Wenn der Fehler ein `NEXT_REDIRECT` ist, muss er erneut ausgelöst werden
            if (authError.digest?.includes('NEXT_REDIRECT')) {
              throw authError;
            }
            // Fallback, falls der automatische Login fehlschlägt
            toast({
                variant: 'destructive',
                title: 'Automatischer Login fehlgeschlagen',
                description: 'Bitte loggen Sie sich manuell ein.',
            });
            // Leite zum Login weiter, wo sich der User manuell anmelden kann
            window.location.href = '/login';
        }
    } else {
       toast({
        variant: 'destructive',
        title: 'Registrierung fehlgeschlagen',
        description: result.error,
      });
    }
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
              <FormLabel className="sr-only">Vollständiger Name</FormLabel>
              <FormControl>
                <div className="relative">
                  <UserIcon className={cn("absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5", getIconColor(!!field.value))} />
                  <Input placeholder="Vollständiger Name" {...field} className="pl-10" />
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
              <FormLabel className="sr-only">Email</FormLabel>
              <FormControl>
                <div className="relative">
                  <Mail className={cn("absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5", getIconColor(!!field.value))} />
                  <Input placeholder="E-Mail" {...field} className="pl-10" />
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
              <FormLabel className="sr-only">Telefonnummer</FormLabel>
              <FormControl>
                <div className="relative">
                  <Phone className={cn("absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5", getIconColor(!!field.value))} />
                  <Input placeholder="Telefonnummer" {...field} className="pl-10" />
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
                <FormLabel className="sr-only">Straße &amp; Nr.</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Home className={cn("absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5", getIconColor(!!field.value))} />
                    <Input placeholder="Straße &amp; Nr." {...field} className="pl-10" />
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
                  <FormLabel className="sr-only">PLZ</FormLabel>
                  <FormControl>
                    <Input placeholder="PLZ" {...field} />
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
                  <FormLabel className="sr-only">Ort</FormLabel>
                  <FormControl>
                    <Input placeholder="Ort" {...field} />
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
                <FormLabel className="sr-only">Provinz</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Building className={cn("absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5", getIconColor(!!field.value))} />
                    <Input placeholder="Provinz (z.B. BZ)" {...field} className="pl-10" />
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
                      Ich habe die <Link href="/datenschutz" target="_blank" className="font-semibold text-primary underline hover:no-underline">Datenschutzerklärung</Link> gelesen und akzeptiere diese. <span className="text-destructive">*</span>
                    </FormLabel>
                    <FormMessage />
                  </div>
                </FormItem>
              )}
            />
             <Separator className="my-4"/>
             <p className="text-sm font-medium text-muted-foreground">Freiwillige Einwilligungen</p>
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
                     Ich möchte den Newsletter und Angebote per E-Mail erhalten.
                    </FormLabel>
                     <p className="text-xs text-muted-foreground/80">Diese Einwilligung kann jederzeit im Profil widerrufen werden.</p>
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
                     Ich stimme zu, dass meine Einkäufe analysiert werden, um mir persönliche Angebote und Weinempfehlungen anzuzeigen.
                    </FormLabel>
                    <FormMessage />
                  </div>
                </FormItem>
              )}
            />
        </div>


        <SubmitButton className="w-full" variant="default">
            Konto erstellen
        </SubmitButton>
      </form>
    </Form>
  );
}

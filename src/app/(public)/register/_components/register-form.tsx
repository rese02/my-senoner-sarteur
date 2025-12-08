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
import { registerUser } from '@/app/actions/auth.actions';
import { Mail, Lock, User as UserIcon, Phone, Home, Building, Eye, EyeOff } from 'lucide-react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

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
    message: 'Sie müssen die Datenschutzbestimmungen akzeptieren.',
  }),
});

export function RegisterForm() {
  const { toast } = useToast();
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      phone: '',
      street: '',
      city: 'St. Ulrich',
      zip: '39046',
      province: 'BZ',
      privacyPolicy: false,
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const result = await registerUser(values);

    if (result?.error) {
      toast({
        variant: 'destructive',
        title: 'Registrierung fehlgeschlagen',
        description: result.error,
      });
    } else if (result?.success) {
        toast({
            title: 'Registrierung erfolgreich!',
            description: 'Sie werden zum Login weitergeleitet.',
        });
        router.push('/login');
    }
  }

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
                  <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
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
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
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
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
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
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input placeholder="Telefonnummer" {...field} className="pl-10" />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="grid grid-cols-1 gap-4 pt-4 border-t">
          <FormField
            control={form.control}
            name="street"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="sr-only">Straße & Nr.</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Home className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    <Input placeholder="Straße & Nr." {...field} className="pl-10" />
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
                    <Building className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    <Input placeholder="Provinz (z.B. BZ)" {...field} className="pl-10" />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="privacyPolicy"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 shadow-sm bg-secondary/50">
              <FormControl>
                <Checkbox checked={field.value} onCheckedChange={field.onChange} />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>
                  Ich habe die <Link href="/datenschutz" target="_blank" className="text-primary underline hover:no-underline">Datenschutzerklärung</Link> gelesen und akzeptiere sie.
                </FormLabel>
                <FormMessage />
              </div>
            </FormItem>
          )}
        />

        <SubmitButton>Konto erstellen</SubmitButton>
      </form>
    </Form>
  );
}

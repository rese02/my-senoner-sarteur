'use client';

import { useRouter } from 'next/navigation';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { useAuth } from '@/firebase/provider'; // Client Auth Hook!
import { createSession } from '@/app/actions/auth.actions'; // Our Server Action
import { useForm } from 'react-hook-form';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { SubmitButton } from '@/components/custom/SubmitButton';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import Link from 'next/link';

const formSchema = z.object({
  name: z.string().min(2, { message: 'Name muss mindestens 2 Zeichen lang sein.' }),
  email: z.string().email({ message: 'Bitte geben Sie eine gültige E-Mail ein.' }),
  password: z.string().min(8, { message: 'Das Passwort muss mindestens 8 Zeichen lang sein.' }),
  phone: z.string().min(5, { message: 'Bitte geben Sie eine gültige Telefonnummer ein.'}),
  street: z.string().min(3, { message: 'Bitte geben Sie eine Straße ein.'}),
  city: z.string().min(2, { message: 'Bitte geben Sie einen Ort ein.'}),
  zip: z.string().min(4, { message: 'Bitte geben Sie eine PLZ ein.'}),
  province: z.string().min(2, { message: 'Bitte geben Sie eine Provinz ein.'}),
  privacyPolicy: z.boolean().refine(val => val === true, {
    message: 'Sie müssen die Datenschutzbestimmungen akzeptieren.',
  }),
});

export function RegisterForm() {
  const { toast } = useToast();
  const auth = useAuth();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      phone: '',
      street: '',
      city: '',
      zip: '',
      province: 'BZ',
      privacyPolicy: false,
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    
    try {
      // 1. Create user with Firebase client SDK
      const userCredential = await createUserWithEmailAndPassword(auth, values.email, values.password);
      
      // 2. Update the user's profile with their name
      await updateProfile(userCredential.user, {
        displayName: values.name,
      });

      // 3. Get the ID token from the newly created user
      const idToken = await userCredential.user.getIdToken();

      // 4. Prepare extra data for server action
      const extraData = {
        name: values.name,
        phone: values.phone,
        deliveryAddress: {
          street: values.street,
          city: values.city,
          zip: values.zip,
          province: values.province,
        },
        consent: {
          privacyPolicy: {
            accepted: values.privacyPolicy,
            timestamp: new Date().toISOString(),
          }
        }
      }

      // 5. Call our server action to create the session cookie and the Firestore user document
      await createSession(idToken, extraData);

      toast({
        title: 'Registrierung erfolgreich',
        description: 'Sie werden zum Dashboard weitergeleitet...',
      });

    } catch (error: any) {
      if (error.digest?.includes('NEXT_REDIRECT')) {
        throw error;
      }
      
      let msg = "Ein unerwarteter Fehler ist aufgetreten.";
      if (error.code === 'auth/email-already-in-use') {
        msg = "Diese E-Mail-Adresse wird bereits verwendet.";
      } else if (error.code === 'auth/weak-password') {
        msg = "Das Passwort muss mindestens 8 Zeichen lang sein.";
      }
      
      toast({
        variant: "destructive",
        title: "Registrierung fehlgeschlagen",
        description: msg
      });
      // Re-enable form on error
      form.reset(values);
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
              <FormLabel>Vollständiger Name</FormLabel>
              <FormControl>
                <Input placeholder="Max Mustermann" {...field} />
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
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="name@example.com" {...field} />
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
              <FormLabel>Passwort</FormLabel>
              <FormControl>
                <Input type="password" placeholder="••••••••" {...field} />
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
              <FormLabel>Telefonnummer</FormLabel>
              <FormControl>
                <Input placeholder="+39 123 4567890" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="street"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Straße & Nr.</FormLabel>
                  <FormControl>
                    <Input placeholder="Musterweg 1" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
             <FormField
              control={form.control}
              name="city"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Ort</FormLabel>
                  <FormControl>
                    <Input placeholder="St. Ulrich" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
        </div>
         <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="zip"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>PLZ</FormLabel>
                  <FormControl>
                    <Input placeholder="39046" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
             <FormField
              control={form.control}
              name="province"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Provinz</FormLabel>
                  <FormControl>
                    <Input placeholder="BZ" {...field} />
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
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
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

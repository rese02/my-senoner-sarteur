'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { useAuth } from '@/firebase/provider';
import { createSession } from '@/app/actions/auth.actions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

const formSchema = z.object({
  email: z.string().email({ message: 'Bitte geben Sie eine gültige E-Mail ein.' }),
  password: z.string().min(1, { message: 'Passwort ist erforderlich.' }),
});

export function LoginForm() {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const auth = useAuth();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);
    
    try {
      // 1. Firebase Login (Client)
      const userCredential = await signInWithEmailAndPassword(auth, values.email, values.password);
      
      // 2. Token holen
      const idToken = await userCredential.user.getIdToken();

      // 3. Server Action aufrufen (Cookie setzen & Redirect)
      await createSession(idToken);
      
    } catch (error: any) {
      // This is the fix: Re-throw the redirect error so Next.js can handle it.
      if (error.digest?.includes('NEXT_REDIRECT')) {
        throw error;
      }
      
      console.error("Login process failed:", error);
      
      toast({
        variant: 'destructive',
        title: 'Anmeldung fehlgeschlagen',
        description: "Ungültige E-Mail oder Passwort.",
      });
      setIsSubmitting(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="admin@senoner.it" {...field} disabled={isSubmitting} />
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
                <Input type="password" placeholder="••••••••" {...field} disabled={isSubmitting} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {isSubmitting ? 'Anmelden...' : 'Anmelden'}
        </Button>
      </form>
    </Form>
  );
}

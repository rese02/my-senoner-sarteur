
'use client';

import { signInWithEmailAndPassword } from 'firebase/auth';
import { useAuth } from '@/firebase/provider';
import { createSession } from '@/app/actions/auth.actions';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { useForm, useFormState } from 'react-hook-form';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { SubmitButton } from '@/components/custom/SubmitButton';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const formSchema = z.object({
  email: z.string().email({ message: 'Bitte geben Sie eine gültige E-Mail ein.' }),
  password: z.string().min(1, { message: 'Passwort ist erforderlich.' }),
});

export function LoginForm() {
  const { toast } = useToast();
  const auth = useAuth();
  const [showPassword, setShowPassword] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const { isSubmitting } = useFormState({ control: form.control });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      // 1. Firebase Login (Client)
      const userCredential = await signInWithEmailAndPassword(auth, values.email, values.password);
      
      // 2. Token holen
      const idToken = await userCredential.user.getIdToken();

      // 3. Sichere Server Action aufrufen (Cookie setzen & Redirect)
      await createSession(idToken);
      
    } catch (error: any) {
      // WICHTIG: Wenn der Fehler ein `NEXT_REDIRECT` ist, muss er erneut ausgelöst werden,
      // damit Next.js die Weiterleitung durchführen kann.
      if (error.digest?.includes('NEXT_REDIRECT')) {
        throw error;
      }
      
      console.error("Login failed:", error);
      toast({
        variant: 'destructive',
        title: 'Anmeldung fehlgeschlagen',
        description: "Ungültige E-Mail oder Passwort.",
      });
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
              <FormLabel className="sr-only">Email</FormLabel>
              <FormControl>
                <div className="relative">
                   <Mail className={cn("absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5", field.value ? 'text-primary' : 'text-muted-foreground')} />
                   <Input placeholder="Email" {...field} className="pl-10" />
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
                    <Lock className={cn("absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5", field.value ? 'text-primary' : 'text-muted-foreground')} />
                    <Input 
                      type={showPassword ? 'text' : 'password'} 
                      placeholder="Passwort" 
                      {...field} 
                      className="pl-10 pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                      aria-label={showPassword ? "Passwort verbergen" : "Passwort anzeigen"}
                    >
                      {showPassword ? <EyeOff className="h-5 w-5"/> : <Eye className="h-5 w-5" />}
                    </button>
                 </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <SubmitButton className="w-full" isSubmitting={isSubmitting}>
          {isSubmitting ? 'Anmelden...' : 'Anmelden'}
        </SubmitButton>
      </form>
    </Form>
  );
}

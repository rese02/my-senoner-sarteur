
'use client';
import { useFormStatus } from 'react-dom';
import { Button, type ButtonProps } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

interface SubmitButtonProps extends ButtonProps {
  children: React.ReactNode;
  isSubmitting?: boolean;
}

export function SubmitButton({ children, isSubmitting, ...props }: SubmitButtonProps) {
  const { pending } = useFormStatus();
  const submitting = isSubmitting || pending;

  return (
    <Button disabled={submitting} type="submit" className="w-full" {...props}>
      {submitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
      {children}
    </Button>
  );
}

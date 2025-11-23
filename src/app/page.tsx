import { getSession } from '@/lib/session';
import { redirect } from 'next/navigation';

export default async function RootPage() {
  const session = await getSession();

  if (session) {
      switch (session.role) {
        case 'admin':
          redirect('/admin/dashboard');
        case 'employee':
          redirect('/employee/scanner');
        case 'customer':
        default:
          redirect('/dashboard');
      }
  }

  redirect('/login');
}
import { getSession } from '@/lib/session';
import { redirect } from 'next/navigation';

export default async function RootPage() {
  const session = await getSession();

  if (session) {
      switch (session.role) {
        case 'admin':
          redirect('/admin/dashboard');
          break;
        case 'employee':
          redirect('/employee/scanner');
          break;
        case 'customer':
        default:
          redirect('/dashboard');
          break;
      }
  }

  // If no session, redirect to login
  redirect('/login');
}

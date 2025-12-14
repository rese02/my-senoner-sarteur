
'use server';

import 'server-only';
import nodemailer from 'nodemailer';
import { getSession } from '@/lib/session';
import { z } from 'zod';
import { adminDb } from '@/lib/firebase-admin';
import type { User } from '@/lib/types';

async function requireAdmin() {
  const session = await getSession();
  if (session?.role !== 'admin') {
    throw new Error('Unauthorized: Admin access required.');
  }
}

const newsletterSchema = z.object({
  customerIds: z.array(z.string().min(1)),
  subject: z.string().min(1, 'Betreff ist erforderlich.'),
  message: z.string().min(1, 'Nachricht ist erforderlich.'),
});

export async function sendNewsletter(
  customerIds: string[],
  subject: string,
  message: string
) {
  await requireAdmin();

  const validation = newsletterSchema.safeParse({
    customerIds,
    subject,
    message,
  });

  if (!validation.success) {
    return { success: false, error: 'Ungültige Eingabedaten.' };
  }
  
  if (validation.data.customerIds.length === 0) {
    return { success: false, error: 'Keine Empfänger ausgewählt.' };
  }

  // Fetch customer emails from Firestore
  const customersSnapshot = await adminDb.collection('users').where('__name__', 'in', validation.data.customerIds).get();
  const emails = customersSnapshot.docs.map(doc => (doc.data() as User).email);
  
  if (emails.length === 0) {
      return { success: false, error: 'Keine gültigen Empfänger gefunden.' };
  }

  // Configure Nodemailer for Gmail
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_SERVER_HOST,
    port: parseInt(process.env.EMAIL_SERVER_PORT || "465"),
    secure: true, // Use true for port 465 with SSL
    auth: {
      user: process.env.EMAIL_SERVER_USER,
      pass: process.env.EMAIL_SERVER_PASSWORD,
    },
  });

  try {
    const info = await transporter.sendMail({
      from: `"${process.env.EMAIL_FROM_NAME || 'Senoner Sarteur'}" <${process.env.EMAIL_FROM}>`,
      to: process.env.EMAIL_SERVER_USER, // Send to yourself for record
      bcc: emails.join(','), // Use BCC to hide recipients from each other
      subject: subject,
      html: `<p>${message.replace(/\n/g, '<br>')}</p>`, // Convert newlines to <br> for HTML
    });

    console.log('Message sent: %s', info.messageId);
    return { success: true, message: `Newsletter wurde an ${emails.length} Empfänger gesendet.` };
  } catch (error) {
    console.error('Error sending email:', error);
    return { success: false, error: 'E-Mail konnte nicht gesendet werden. Prüfen Sie die Server-Logs.' };
  }
}

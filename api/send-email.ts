import { Resend } from 'resend';

export const config = {
    runtime: 'edge',
};

export default async function handler(request: Request) {
    if (request.method !== 'POST') {
        return new Response(JSON.stringify({ error: 'Method not allowed' }), {
            status: 405,
            headers: { 'Content-Type': 'application/json' },
        });
    }

    try {
        const apiKey = process.env.VITE_RESEND_API_KEY || process.env.RESEND_API_KEY;
        if (!apiKey) {
            console.error('Missing Resend API Key. Ensure either VITE_RESEND_API_KEY or RESEND_API_KEY is set in your environment variables.');
            return new Response(JSON.stringify({
                error: 'Internal server configuration error',
                details: 'API key is missing in production environment variables.'
            }), {
                status: 500,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        const resend = new Resend(apiKey);
        const body = await request.json();
        const { name, email, subject, message } = body;

        if (!name || !email || !subject || !message) {
            return new Response(JSON.stringify({ error: 'Missing required fields' }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        const { data, error } = await resend.emails.send({
            from: 'REMsleep Contact <noreply@myremsleep.com>',
            to: ['hello@myremsleep.com'],
            replyTo: email,
            subject: `[Contact Form] ${subject}`,
            html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #2d2a26; border-bottom: 2px solid #e8e3dc; padding-bottom: 10px;">
            New Contact Form Submission
          </h2>
          <div style="background-color: #f9f8f6; padding: 20px; border-radius: 4px; margin: 20px 0;">
            <p style="margin: 0 0 10px 0;"><strong>From:</strong> ${name}</p>
            <p style="margin: 0 0 10px 0;"><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
            <p style="margin: 0;"><strong>Subject:</strong> ${subject}</p>
          </div>
          <div style="padding: 20px 0;">
            <h3 style="color: #2d2a26; margin-bottom: 10px;">Message:</h3>
            <p style="white-space: pre-wrap; line-height: 1.6; color: #333;">${message.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</p>
          </div>
          <div style="border-top: 1px solid #e8e3dc; padding-top: 15px; margin-top: 20px; color: #666; font-size: 12px;">
            <p>This message was sent from the REMsleep website contact form.</p>
          </div>
        </div>
      `,
        });

        if (error) {
            return new Response(JSON.stringify({ error: error.message }), {
                status: 500,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        return new Response(JSON.stringify({ success: true, data }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
        });
    } catch (err: any) {
        console.error('Server error:', err);
        return new Response(JSON.stringify({ error: `Internal server error: ${err.message}` }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }
}

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
        const { type = 'contact', name, email, subject: userSubject, message } = body;

        if (!email) {
            return new Response(JSON.stringify({ error: 'Missing email' }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        const fontImport = `
            <link rel="preconnect" href="https://fonts.googleapis.com">
            <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
            <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;500;600&family=Playfair+Display:ital,wght@0,400;0,600;1,400&display=swap" rel="stylesheet">
        `;
        const commonStyles = `
            font-family: 'Montserrat', Helvetica, Arial, sans-serif;
            margin: 0;
            padding: 0;
            background-color: #f5f1ed;
            color: #2d2a26;
            -webkit-font-smoothing: antialiased;
        `;

        if (type === 'unsubscribe') {
            const { data, error } = await resend.emails.send({
                from: 'REMsleep <hello@myremsleep.com>',
                to: [email],
                replyTo: 'hello@myremsleep.com',
                subject: 'Unsubscription Confirmed - REMsleep',
                text: `Rest is not a routine. It is a ritual.

We have processed your request. This email confirms your unsubscription from our mailing list. 
While we are sorry to see you go, we respect your quiet space.

Return to the ritual: https://www.myremsleep.com

@myremsleepclub
© 2026 REMSLEEP. ALL RIGHTS RESERVED.`,
                html: `
                <!DOCTYPE html>
                <html lang="en">
                <head>
                    <meta charset="utf-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1">
                    <meta http-equiv="X-UA-Compatible" content="IE=edge">
                    ${fontImport}
                    <style>
                        body { margin: 0 !important; padding: 0 !important; width: 100% !important; -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; background-color: #f5f1ed; font-family: 'Montserrat', Helvetica, Arial, sans-serif; -webkit-font-smoothing: antialiased; }
                        table { border-spacing: 0 !important; border-collapse: collapse !important; table-layout: fixed !important; margin: 0 auto !important; }
                        img { -ms-interpolation-mode: bicubic; display: block; border: 0; }
                    </style>
                </head>
                <body style="margin: 0; padding: 0; background-color: #f5f1ed;">
                    <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" bgcolor="#f5f1ed">
                        <tr>
                            <td align="center" style="padding: 45px 20px;">
                                <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 540px; text-align: center;">
                                    <!-- Logo -->
                                    <tr>
                                        <td align="center" style="padding-bottom: 35px;">
                                            <img src="https://www.myremsleep.com/logo5.png" alt="REMsleep" width="160" style="margin: 0 auto; height: auto; opacity: 0.9;" />
                                        </td>
                                    </tr>
                                    <!-- Header -->
                                    <tr>
                                        <td align="center" style="font-family: 'Playfair Display', serif; font-size: 38px; color: #1a1a1a; padding-bottom: 35px; font-weight: 400; font-style: italic; line-height: 1.2; letter-spacing: -0.5px;">
                                            Rest is not a routine.<br/>It is a ritual.
                                        </td>
                                    </tr>
                                    <!-- Content -->
                                    <tr>
                                        <td align="center" style="font-family: 'Montserrat', sans-serif; font-size: 15px; line-height: 1.8; color: #4a4a4a; font-weight: 300; letter-spacing: 0.2px; padding-bottom: 30px;">
                                            We have processed your request. This email confirms your unsubscription from our mailing list. 
                                            While we are sorry to see you go, we respect your quiet space.
                                        </td>
                                    </tr>
                                    <!-- Divider -->
                                    <tr>
                                        <td align="center" style="padding-bottom: 35px;">
                                            <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="60" align="center">
                                                <tr><td style="height: 1px; background-color: #e8e3dc;"></td></tr>
                                            </table>
                                        </td>
                                    </tr>
                                    <!-- CTA -->
                                    <tr>
                                        <td align="center" style="padding-bottom: 20px;">
                                            <a href="https://www.myremsleep.com" style="font-family: 'Montserrat', sans-serif; color: #2d2a26; text-decoration: none; font-weight: 500; border-bottom: 1px solid #2d2a26; padding-bottom: 2px; font-size: 13px; letter-spacing: 1px; text-transform: uppercase;">Return to the ritual</a>
                                        </td>
                                    </tr>
                                    <!-- Footer -->
                                    <tr>
                                        <td align="center" style="padding-top: 30px; border-top: 1px solid #e8e3dc;">
                                            <a href="https://www.instagram.com/myremsleepclub/" style="text-decoration: none; display: inline-block; margin-top: 25px;">
                                                <table role="presentation" border="0" cellpadding="0" cellspacing="0" align="center">
                                                    <tr>
                                                        <td>
                                                            <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/a/a5/Instagram_icon.png/120px-Instagram_icon.png" width="18" height="18" style="opacity: 0.7;" alt="Instagram" />
                                                        </td>
                                                        <td style="font-family: 'Montserrat', sans-serif; font-size: 12px; color: #888; letter-spacing: 1px; text-transform: uppercase; padding-left: 8px;">
                                                            @myremsleepclub
                                                        </td>
                                                    </tr>
                                                </table>
                                            </a>
                                            <div style="font-family: 'Montserrat', sans-serif; font-size: 11px; color: #aaa; margin-top: 30px; letter-spacing: 0.5px;">&copy; 2026 REMSLEEP. ALL RIGHTS RESERVED.</div>
                                        </td>
                                    </tr>
                                </table>
                            </td>
                        </tr>
                    </table>
                </body>
                </html>
            `,
            });

            if (error) return new Response(JSON.stringify({ error: error.message }), { status: 500 });
            return new Response(JSON.stringify({ success: true, data }), { status: 200 });

        } else if (type === 'welcome') {
            const welcomeEmail = await resend.emails.send({
                from: 'Kiki from REMsleep <hello@myremsleep.com>',
                to: [email],
                replyTo: 'hello@myremsleep.com',
                subject: 'Welcome to REMsleep',
                text: `Hello ${name || 'there'},

In a world that rarely slows down, sleep becomes Recovery, Renewal.
A quiet reset where new dreams take shape.

We create calm, considered bedding in grounding tones designed to support your wind-down ritual and elevate every moment you spend in bed.

Rest. Renew. Awaken new dreams.

---
A quick question:
What do you want your bedroom to feel like this season? (Calm, Cosy, Restored, or Inspired).
I read every reply.

With love,
Kiki
Founder, REMsleep

P.S. Add hello@myremsleep.com to your contacts so REMsleep always reaches you.

REMsleep Headquarters, London, UK
To unsubscribe, please visit https://www.myremsleep.com/unsubscribe`,
                html: `
                    <!DOCTYPE html>
                    <html lang="en">
                    <head>
                        <meta charset="utf-8">
                        <meta name="viewport" content="width=device-width, initial-scale=1">
                        <meta http-equiv="X-UA-Compatible" content="IE=edge">
                        ${fontImport}
                        <style>
                            body { margin: 0 !important; padding: 0 !important; width: 100% !important; -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; background-color: #F5F1ED; font-family: 'Montserrat', Helvetica, Arial, sans-serif; -webkit-font-smoothing: antialiased; }
                            table { border-spacing: 0 !important; border-collapse: collapse !important; table-layout: fixed !important; margin: 0 auto !important; }
                            img { -ms-interpolation-mode: bicubic; display: block; border: 0; }
                        </style>
                    </head>
                    <body style="margin: 0; padding: 0; background-color: #F5F1ED;">
                        <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" bgcolor="#F5F1ED">
                            <tr>
                                <td align="center" style="padding: 25px 20px 15px 20px;">
                                    <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 520px; text-align: center;">
                                        <!-- Logo -->
                                        <tr>
                                            <td align="center" style="padding-bottom: 20px;">
                                                <img src="https://www.myremsleep.com/logo5.png" alt="REMsleep" width="140" style="margin: 0 auto; height: auto; opacity: 0.9;" />
                                            </td>
                                        </tr>
                                        <!-- Header -->
                                        <tr>
                                            <td align="center" style="font-family: 'Playfair Display', serif; font-size: 28px; font-weight: 600; color: #1a1a1a; padding-bottom: 20px; line-height: 1.2; letter-spacing: -0.5px;">
                                                Welcome to REMsleep
                                            </td>
                                        </tr>
                                        <!-- Greeting -->
                                        <tr>
                                            <td align="center" style="font-family: 'Montserrat', sans-serif; font-size: 14px; font-weight: 300; letter-spacing: 0.2px; padding-bottom: 10px; color: #2D2A26;">
                                                Hello ${name || 'there'},
                                            </td>
                                        </tr>
                                        <!-- Body Content -->
                                        <tr>
                                            <td align="center" style="font-family: 'Montserrat', sans-serif; font-size: 14px; font-weight: 300; letter-spacing: 0.2px; padding-bottom: 10px; color: #2D2A26; line-height: 1.5;">
                                                In a world that rarely slows down, sleep becomes Recovery, Renewal.<br/>
                                                A quiet reset where new dreams take shape.
                                            </td>
                                        </tr>
                                        <tr>
                                            <td align="center" style="font-family: 'Montserrat', sans-serif; font-size: 14px; font-weight: 300; letter-spacing: 0.2px; padding-bottom: 10px; color: #2D2A26; line-height: 1.5;">
                                                We create calm, considered bedding in grounding tones designed to support your wind-down ritual and elevate every moment you spend in bed.
                                            </td>
                                        </tr>
                                        <tr>
                                            <td align="center" style="font-family: 'Playfair Display', serif; font-style: italic; font-size: 16px; color: #1a1a1a; padding: 5px 0 15px 0;">
                                                Rest. Renew. Awaken new dreams.
                                            </td>
                                        </tr>
                                        <!-- Divider -->
                                        <tr>
                                            <td align="center" style="padding-bottom: 20px;">
                                                <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="40" align="center">
                                                    <tr><td style="border-top: 1px solid #e8e3dc; height: 1px;"></td></tr>
                                                </table>
                                            </td>
                                        </tr>
                                        <!-- Prompt -->
                                        <tr>
                                            <td align="center" style="padding-bottom: 25px;">
                                                <div style="font-family: 'Playfair Display', serif; font-size: 18px; font-style: italic; color: #1a1a1a; padding-bottom: 10px;">
                                                    Before you go, A quick question:
                                                </div>
                                                <div style="font-family: 'Montserrat', sans-serif; font-style: italic; font-size: 14px; font-weight: 300; padding-bottom: 10px; color: #2D2A26;">
                                                    Reply with one word:<br/>What do you want your bedroom to feel like this season?
                                                </div>
                                                <div style="font-family: 'Montserrat', sans-serif; font-size: 10px; color: #1a1a1a; letter-spacing: 2px; text-transform: uppercase; padding-bottom: 8px; font-weight: 600;">
                                                    Calm &bull; Cosy &bull; Restored &bull; Inspired
                                                </div>
                                                <div style="font-family: 'Montserrat', sans-serif; font-size: 14px; font-weight: 300; color: #2D2A26;">I read every reply.</div>
                                            </td>
                                        </tr>
                                        <!-- Signature -->
                                        <tr>
                                            <td align="center" style="padding-bottom: 25px;">
                                                <div style="font-family: 'Montserrat', sans-serif; font-weight: 400; text-transform: uppercase; letter-spacing: 1px; font-size: 11px; padding-bottom: 5px; color: #2D2A26;">With love,</div>
                                                <div style="font-family: 'Playfair Display', serif; font-size: 24px; font-style: italic; color: #1a1a1a; padding-bottom: 2px;">Kiki</div>
                                                <div style="font-family: 'Montserrat', sans-serif; font-size: 10px; color: #888; text-transform: uppercase; letter-spacing: 1px;">Founder, REMsleep</div>
                                            </td>
                                        </tr>
                                        <!-- PS -->
                                        <tr>
                                            <td align="center" style="font-family: 'Montserrat', sans-serif; font-size: 11px; color: #888; font-style: italic; padding-bottom: 25px;">
                                                P.S. Add <a href="mailto:hello@myremsleep.com" style="color: #888; text-decoration: underline;">hello@myremsleep.com</a> to your contacts.
                                            </td>
                                        </tr>
                                        <!-- Footer -->
                                        <tr>
                                            <td align="center" style="border-top: 1px solid #e8e3dc; padding-top: 15px;">
                                                <a href="https://www.instagram.com/myremsleepclub/" style="text-decoration: none; display: inline-block; padding-bottom: 10px;">
                                                    <table role="presentation" border="0" cellpadding="0" cellspacing="0" align="center">
                                                        <tr>
                                                            <td>
                                                                <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/a/a5/Instagram_icon.png/120px-Instagram_icon.png" width="14" height="14" style="opacity: 0.6;" alt="Instagram" />
                                                            </td>
                                                            <td style="font-family: 'Montserrat', sans-serif; font-size: 10px; color: #888; letter-spacing: 1px; padding-left: 6px; text-transform: uppercase;">
                                                                @myremsleepclub
                                                            </td>
                                                        </tr>
                                                    </table>
                                                </a>
                                                <div style="font-family: 'Montserrat', sans-serif; font-size: 9px; color: #aaa; letter-spacing: 1px; text-transform: uppercase; padding-bottom: 10px; line-height: 1.4;">
                                                    REMsleep Headquarters, London, UK<br/>
                                                    &copy; 2026 REMSLEEP. ALL RIGHTS RESERVED.
                                                </div>
                                                <div style="font-family: 'Montserrat', sans-serif; font-size: 9px;">
                                                    <a href="https://www.myremsleep.com/unsubscribe" style="color: #aaa; text-decoration: underline;">Unsubscribe</a>
                                                </div>
                                            </td>
                                        </tr>
                                    </table>
                                </td>
                            </tr>
                        </table>
                    </body>
                    </html>
                `,
            });
            if (welcomeEmail.error) return new Response(JSON.stringify({ error: welcomeEmail.error.message }), { status: 500 });
            return new Response(JSON.stringify({ success: true, data: welcomeEmail.data }), { status: 200 });

        } else if (type === 'questionnaire') {
            const { answers } = body;
            const questionnaireEmail = await resend.emails.send({
                from: 'REMsleep <hello@myremsleep.com>',
                to: ['hello@myremsleep.com'],
                subject: `New Questionnaire Response - ${email}`,
                text: `New Questionnaire Submission
User Email: ${email}

Bed Size: ${answers?.bedSize || 'Not specified'}
Colors: ${answers?.colors?.join(', ') || 'Not specified'} ${answers?.colorOther ? `(Other: ${answers.colorOther})` : ''}
Feel: ${answers?.feel || 'Not specified'}
Priority: ${answers?.priority || 'Not specified'}
Bed Feeling: ${answers?.bedFeeling || 'Not specified'}`,
                html: `
                    <!DOCTYPE html>
                    <html lang="en">
                    <head>
                        <meta charset="utf-8">
                        <meta name="viewport" content="width=device-width, initial-scale=1">
                    </head>
                    <body style="margin: 0; padding: 0; background-color: #ffffff; font-family: 'Montserrat', sans-serif;">
                        <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" bgcolor="#ffffff">
                            <tr>
                                <td align="center" style="padding: 40px 20px;">
                                    <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px; text-align: left; color: #2d2a26;">
                                        <tr>
                                            <td style="padding-bottom: 10px; border-bottom: 2px solid #e8e3dc;">
                                                <h2 style="margin: 0; font-family: 'Montserrat', sans-serif;">New Questionnaire Submission</h2>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td style="padding: 20px 0; font-family: 'Montserrat', sans-serif;">
                                                <p><strong>User Email:</strong> ${email}</p>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td bgcolor="#f9f8f6" style="padding: 20px; border-radius: 4px; font-family: 'Montserrat', sans-serif;">
                                                <h3 style="margin-top: 0;">Responses:</h3>
                                                <p><strong>Bed Size:</strong> ${answers?.bedSize || 'Not specified'}</p>
                                                <p><strong>Colors:</strong> ${answers?.colors?.join(', ') || 'Not specified'} ${answers?.colorOther ? `(Other: ${answers.colorOther})` : ''}</p>
                                                <p><strong>Feel:</strong> ${answers?.feel || 'Not specified'}</p>
                                                <p><strong>Priority:</strong> ${answers?.priority || 'Not specified'}</p>
                                                <p><strong>Bed Feeling:</strong> ${answers?.bedFeeling || 'Not specified'}</p>
                                            </td>
                                        </tr>
                                    </table>
                                </td>
                            </tr>
                        </table>
                    </body>
                    </html>
                `,
            });
            if (questionnaireEmail.error) return new Response(JSON.stringify({ error: questionnaireEmail.error.message }), { status: 500 });
            return new Response(JSON.stringify({ success: true, data: questionnaireEmail.data }), { status: 200 });

        } else {
            if (!name || !userSubject || !message) {
                return new Response(JSON.stringify({ error: 'Missing required fields for contact form' }), {
                    status: 400,
                    headers: { 'Content-Type': 'application/json' },
                });
            }

            // 1. Send Admin Notification
            const adminEmail = await resend.emails.send({
                from: 'REMsleep Contact <noreply@myremsleep.com>',
                to: ['hello@myremsleep.com'],
                replyTo: email,
                subject: `[Contact Form] ${userSubject}`,
                text: `New Contact Form Submission
From: ${name}
Email: ${email}
Subject: ${userSubject}

Message:
${message}`,
                html: `
                    <!DOCTYPE html>
                    <html lang="en">
                    <head>
                        <meta charset="utf-8">
                        <meta name="viewport" content="width=device-width, initial-scale=1">
                    </head>
                    <body style="margin: 0; padding: 0; background-color: #ffffff; font-family: 'Montserrat', sans-serif;">
                        <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" bgcolor="#ffffff">
                            <tr>
                                <td align="center" style="padding: 40px 20px;">
                                    <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px; text-align: left; color: #2d2a26;">
                                        <tr>
                                            <td style="padding-bottom: 10px; border-bottom: 2px solid #e8e3dc;">
                                                <h2 style="margin: 0; font-family: 'Montserrat', sans-serif;">New Contact Form Submission</h2>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td bgcolor="#f9f8f6" style="padding: 20px; border-radius: 4px; border: 1px solid #e8e3dc; margin: 20px 0; font-family: 'Montserrat', sans-serif;">
                                                <p style="margin: 0 0 10px 0;"><strong>From:</strong> ${name}</p>
                                                <p style="margin: 0 0 10px 0;"><strong>Email:</strong> ${email}</p>
                                                <p style="margin: 0;"><strong>Subject:</strong> ${userSubject}</p>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td style="padding: 20px 0; font-family: 'Montserrat', sans-serif;">
                                                <h3 style="margin-bottom: 10px;">Message:</h3>
                                                <p style="white-space: pre-wrap; line-height: 1.6; color: #333; margin: 0;">${message.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</p>
                                            </td>
                                        </tr>
                                    </table>
                                </td>
                            </tr>
                        </table>
                    </body>
                    </html>
                `,
            });

            // 2. Send User Auto-Responder
            const userEmail = await resend.emails.send({
                from: 'REMsleep <hello@myremsleep.com>',
                to: [email],
                replyTo: 'hello@myremsleep.com',
                subject: 'We have received your message - REMsleep',
                text: `Hi ${name || 'there'},

Thank you for reaching out to us. We have received your message and will be in touch with you shortly.

As we prepare for our upcoming drop, we are giving extra attention to every enquiry. If your message relates to our pre-launch, feel free to reply directly to this email with any specific details.

In the meantime, you may find the information you need in our collection notes: https://www.myremsleep.com/faq

Rest. Renew. Awaken new dreams.

With care,
REMsleep Team

@myremsleepclub`,
                html: `
                    <!DOCTYPE html>
                    <html lang="en">
                    <head>
                        <meta charset="utf-8">
                        <meta name="viewport" content="width=device-width, initial-scale=1">
                        <meta http-equiv="X-UA-Compatible" content="IE=edge">
                        ${fontImport}
                        <style>
                            body { margin: 0 !important; padding: 0 !important; width: 100% !important; -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; background-color: #f5f1ed; font-family: 'Montserrat', Helvetica, Arial, sans-serif; -webkit-font-smoothing: antialiased; }
                            table { border-spacing: 0 !important; border-collapse: collapse !important; table-layout: fixed !important; margin: 0 auto !important; }
                        </style>
                    </head>
                    <body style="margin: 0; padding: 0; background-color: #f5f1ed;">
                        <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" bgcolor="#f5f1ed">
                            <tr>
                                <td align="center" style="padding: 60px 20px;">
                                    <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 580px; text-align: left;">
                                        <!-- Logo -->
                                        <tr>
                                            <td align="center" style="padding-bottom: 50px;">
                                                <img src="https://www.myremsleep.com/logo5.png" alt="REMsleep" width="160" style="margin: 0 auto; height: auto; opacity: 0.9;" />
                                            </td>
                                        </tr>
                                        <!-- Greeting -->
                                        <tr>
                                            <td style="font-family: 'Playfair Display', serif; font-size: 30px; font-style: italic; color: #1a1a1a; padding-bottom: 30px;">
                                                Hi ${name || 'there'},
                                            </td>
                                        </tr>
                                        <!-- Content -->
                                        <tr>
                                            <td style="font-family: 'Montserrat', sans-serif; font-weight: 300; padding-bottom: 20px; font-size: 17px; line-height: 1.8; color: #4a4a4a;">
                                                Thank you for reaching out to us. We have received your message and will be in touch with you shortly.
                                            </td>
                                        </tr>
                                        <tr>
                                            <td style="font-family: 'Montserrat', sans-serif; font-weight: 300; padding-bottom: 20px; font-size: 17px; line-height: 1.8; color: #4a4a4a;">
                                                As we prepare for our upcoming drop, we are giving extra attention to every enquiry. If your message relates to our pre-launch, feel free to reply directly to this email with any specific details.
                                            </td>
                                        </tr>
                                        <tr>
                                            <td style="font-family: 'Montserrat', sans-serif; font-weight: 300; padding-bottom: 25px; font-size: 17px; line-height: 1.8; color: #4a4a4a;">
                                                In the meantime, you may find the information you need in our collection notes:
                                            </td>
                                        </tr>
                                        <tr>
                                            <td style="padding-bottom: 45px;">
                                                <a href="https://www.myremsleep.com/faq" style="font-family: 'Montserrat', sans-serif; color: #2d2a26; text-decoration: none; border-bottom: 1px solid #2d2a26; padding-bottom: 2px; font-weight: 500; font-size: 15px; letter-spacing: 1px; text-transform: uppercase;">View our FAQs</a>
                                            </td>
                                        </tr>
                                        <!-- Divider -->
                                        <tr>
                                            <td style="padding-bottom: 45px;">
                                                <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="60">
                                                    <tr><td style="height: 1px; background-color: #e8e3dc;"></td></tr>
                                                </table>
                                            </td>
                                        </tr>
                                        <!-- Footer -->
                                        <tr>
                                            <td>
                                                <div style="font-family: 'Playfair Display', serif; font-size: 20px; font-style: italic; color: #1a1a1a; padding-bottom: 25px;">Rest. Renew. Awaken new dreams.</div>
                                                <div style="font-family: 'Montserrat', sans-serif; font-weight: 400; letter-spacing: 1px; text-transform: uppercase; font-size: 14px; padding-bottom: 5px; color: #4a4a4a;">With care,</div>
                                                <div style="font-family: 'Montserrat', sans-serif; font-weight: 500; padding-bottom: 35px; color: #2d2a26;">REMsleep Team</div>
                                                
                                                <div style="border-top: 1px solid #e8e3dc; padding-top: 30px;">
                                                    <a href="https://www.instagram.com/myremsleepclub/" style="text-decoration: none; color: #2d2a26; font-family: 'Montserrat', sans-serif; font-size: 12px; letter-spacing: 1px; text-transform: uppercase; font-weight: 500;">
                                                        <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/a/a5/Instagram_icon.png/120px-Instagram_icon.png" width="16" height="16" style="vertical-align: middle; margin-right: 8px; opacity: 0.7;" alt="Instagram" />
                                                        @myremsleepclub
                                                    </a>
                                                </div>
                                            </td>
                                        </tr>
                                    </table>
                                </td>
                            </tr>
                        </table>
                    </body>
                    </html>
                `,
            });

            if (adminEmail.error) return new Response(JSON.stringify({ error: adminEmail.error.message }), { status: 500 });

            return new Response(JSON.stringify({
                success: true,
                adminData: adminEmail.data,
                userData: userEmail.data
            }), { status: 200 });
        }
    } catch (err: any) {
        console.error('Server error:', err);
        return new Response(JSON.stringify({ error: `Internal server error: ${err.message}` }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }
}

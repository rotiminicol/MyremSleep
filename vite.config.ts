import { defineConfig, loadEnv, type ViteDevServer } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";
import { Resend } from "resend";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  return {
    server: {
      host: "::",
      port: 8080,
      hmr: {
        overlay: false,
      },
    },
    plugins: [
      react(),
      mode === "development" && componentTagger(),
      {
        name: 'api-server',
        configureServer(server: ViteDevServer) {
          server.middlewares.use('/api/send-email', async (req, res, next) => {
            if (req.method === 'POST') {
              let body = '';
              req.on('data', (chunk: Buffer | string) => {
                body += chunk.toString();
              });
              req.on('end', async () => {
                try {
                  console.log(`[API] Received ${req.method} request to /api/send-email`);

                  if (!body) {
                    console.error('[API] Empty request body');
                    res.statusCode = 400;
                    res.setHeader('Content-Type', 'application/json');
                    res.end(JSON.stringify({ error: 'Empty request body' }));
                    return;
                  }

                  const payload = JSON.parse(body);
                  const { type = 'contact', name, email, subject: userSubject, message } = payload;

                  console.log(`[API] Payload:`, { type, name, email, subject: userSubject, message: message?.substring(0, 20) + '...' });

                  if (!email) {
                    console.error('[API] Missing email');
                    res.statusCode = 400;
                    res.setHeader('Content-Type', 'application/json');
                    res.end(JSON.stringify({ error: 'Missing email' }));
                    return;
                  }

                  if (!env.VITE_RESEND_API_KEY) {
                    console.error('[API] Missing VITE_RESEND_API_KEY');
                    res.statusCode = 500;
                    res.setHeader('Content-Type', 'application/json');
                    res.end(JSON.stringify({ error: 'Server configuration error: Missing API Key' }));
                    return;
                  }

                  const resend = new Resend(env.VITE_RESEND_API_KEY);
                  const fontImport = `
                    <link rel="preconnect" href="https://fonts.googleapis.com">
                    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
                    <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;500;600&family=Playfair+Display:ital,wght@0,400;0,600;1,400&display=swap" rel="stylesheet">
                  `;

                  if (type === 'unsubscribe') {
                    const { data, error } = await resend.emails.send({
                      from: 'REMsleep <hello@myremsleep.com>',
                      to: [email],
                      replyTo: 'hello@myremsleep.com',
                      subject: 'Unsubscription Confirmed - REMsleep',
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
                                                    <div style="font-family: 'Montserrat', sans-serif; font-size: 11px; color: #aaa; margin-top: 30px; letter-spacing: 0.5px;">&copy; 2024 REMSLEEP. ALL RIGHTS RESERVED.</div>
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

                    if (error) {
                      console.error('[API] Resend Error:', error);
                      res.statusCode = 500;
                      res.setHeader('Content-Type', 'application/json');
                      res.end(JSON.stringify({ error: error.message }));
                    } else {
                      console.log('[API] Success:', data);
                      res.statusCode = 200;
                      res.setHeader('Content-Type', 'application/json');
                      res.end(JSON.stringify({ success: true, data }));
                    }
                  } else if (type === 'welcome') {
                    const { data, error } = await resend.emails.send({
                      from: 'Kiki from REMsleep <hello@myremsleep.com>',
                      to: [email],
                      replyTo: 'hello@myremsleep.com',
                      subject: 'Welcome to REMsleep',
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
                                    <td align="center" style="padding: 45px 20px;">
                                        <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 520px; text-align: center;">
                                            <!-- Logo -->
                                            <tr>
                                                <td align="center" style="padding-bottom: 35px;">
                                                    <img src="https://www.myremsleep.com/logo5.png" alt="REMsleep" width="160" style="margin: 0 auto; height: auto; opacity: 0.9;" />
                                                </td>
                                            </tr>
                                            <!-- Header -->
                                            <tr>
                                                <td align="center" style="font-family: 'Playfair Display', serif; font-size: 32px; font-weight: 600; color: #1a1a1a; padding-bottom: 30px; line-height: 1.2; letter-spacing: -0.5px;">
                                                    Welcome to REMsleep
                                                </td>
                                            </tr>
                                            <!-- Greeting -->
                                            <tr>
                                                <td align="center" style="font-family: 'Montserrat', sans-serif; font-size: 15px; font-weight: 300; letter-spacing: 0.2px; padding-bottom: 15px; color: #2D2A26;">
                                                    Hello ${name || 'there'},
                                                </td>
                                            </tr>
                                            <!-- Body Content -->
                                            <tr>
                                                <td align="center" style="font-family: 'Montserrat', sans-serif; font-size: 15px; font-weight: 300; letter-spacing: 0.2px; padding-bottom: 15px; color: #2D2A26; line-height: 1.8;">
                                                    In a world that rarely slows down, sleep becomes Recovery, Renewal.<br/>
                                                    A quiet reset where new dreams take shape.
                                                </td>
                                            </tr>
                                            <tr>
                                                <td align="center" style="font-family: 'Montserrat', sans-serif; font-size: 15px; font-weight: 300; letter-spacing: 0.2px; padding-bottom: 15px; color: #2D2A26; line-height: 1.8;">
                                                    We create calm, considered bedding in grounding tones designed to support your wind-down ritual and elevate every moment you spend in bed.
                                                </td>
                                            </tr>
                                            <tr>
                                                <td align="center" style="font-family: 'Playfair Display', serif; font-style: italic; font-size: 18px; color: #1a1a1a; padding: 5px 0 25px 0;">
                                                    Rest. Renew. Awaken new dreams.
                                                </td>
                                            </tr>
                                            <!-- Divider -->
                                            <tr>
                                                <td align="center" style="padding-bottom: 30px;">
                                                    <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="60" align="center">
                                                        <tr><td style="border-top: 1px solid #e8e3dc; height: 1px;"></td></tr>
                                                    </table>
                                                </td>
                                            </tr>
                                            <!-- Prompt -->
                                            <tr>
                                                <td align="center" style="padding-bottom: 35px;">
                                                    <div style="font-family: 'Playfair Display', serif; font-size: 20px; font-style: italic; color: #1a1a1a; padding-bottom: 15px;">
                                                        Before you go, A Quick Question:
                                                    </div>
                                                    <div style="font-family: 'Montserrat', sans-serif; font-style: italic; font-size: 15px; font-weight: 300; padding-bottom: 15px; color: #2D2A26;">
                                                        Reply with one word:<br/>What do you want your bedroom to feel like this season?
                                                    </div>
                                                    <div style="font-family: 'Montserrat', sans-serif; font-size: 11px; color: #1a1a1a; letter-spacing: 2px; text-transform: uppercase; padding-bottom: 15px; font-weight: 600;">
                                                        Calm &bull; Cosy &bull; Restored &bull; Inspired
                                                    </div>
                                                    <div style="font-family: 'Montserrat', sans-serif; font-size: 15px; font-weight: 300; color: #2D2A26;">I read every reply.</div>
                                                </td>
                                            </tr>
                                            <!-- Signature -->
                                            <tr>
                                                <td align="center" style="padding-bottom: 40px;">
                                                    <div style="font-family: 'Montserrat', sans-serif; font-weight: 400; text-transform: uppercase; letter-spacing: 1px; font-size: 12px; padding-bottom: 10px; color: #2D2A26;">With love,</div>
                                                    <div style="font-family: 'Playfair Display', serif; font-size: 28px; font-style: italic; color: #1a1a1a; padding-bottom: 5px;">Kiki</div>
                                                    <div style="font-family: 'Montserrat', sans-serif; font-size: 11px; color: #888; text-transform: uppercase; letter-spacing: 1px;">Founder, REMsleep</div>
                                                </td>
                                            </tr>
                                            <!-- PS -->
                                            <tr>
                                                <td align="center" style="font-family: 'Montserrat', sans-serif; font-size: 12px; color: #888; font-style: italic; padding-bottom: 40px;">
                                                    P.S. Add <a href="mailto:hello@myremsleep.com" style="color: #888; text-decoration: underline;">hello@myremsleep.com</a> to your contacts so REMsleep always reaches you.
                                                </td>
                                            </tr>
                                            <!-- Footer -->
                                            <tr>
                                                <td align="center" style="border-top: 1px solid #e8e3dc; padding-top: 25px;">
                                                    <a href="https://www.instagram.com/myremsleepclub/" style="text-decoration: none; display: inline-block; padding-bottom: 20px;">
                                                        <table role="presentation" border="0" cellpadding="0" cellspacing="0" align="center">
                                                            <tr>
                                                                <td>
                                                                    <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/a/a5/Instagram_icon.png/120px-Instagram_icon.png" width="16" height="16" style="opacity: 0.6;" alt="Instagram" />
                                                                </td>
                                                                <td style="font-family: 'Montserrat', sans-serif; font-size: 11px; color: #888; letter-spacing: 1px; padding-left: 8px; text-transform: uppercase;">
                                                                    @myremsleepclub
                                                                </td>
                                                            </tr>
                                                        </table>
                                                    </a>
                                                    <div style="font-family: 'Montserrat', sans-serif; font-size: 10px; color: #aaa; letter-spacing: 1px; text-transform: uppercase; padding-bottom: 15px; line-height: 1.5;">
                                                        &copy; 2024 REMSLEEP. ALL RIGHTS RESERVED.
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
                    if (error) {
                      console.error('[API] Resend Error:', error);
                      res.statusCode = 500;
                      res.setHeader('Content-Type', 'application/json');
                      res.end(JSON.stringify({ error: error.message }));
                    } else {
                      res.statusCode = 200;
                      res.setHeader('Content-Type', 'application/json');
                      res.end(JSON.stringify({ success: true, data }));
                    }
                  } else if (type === 'questionnaire') {
                    const { answers } = payload;
                    const { data, error } = await resend.emails.send({
                      from: 'REMsleep <hello@myremsleep.com>',
                      to: ['hello@myremsleep.com'],
                      subject: `New Questionnaire Response - ${email}`,
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
                    if (error) {
                      console.error('[API] Resend Error:', error);
                      res.statusCode = 500;
                      res.setHeader('Content-Type', 'application/json');
                      res.end(JSON.stringify({ error: error.message }));
                    } else {
                      res.statusCode = 200;
                      res.setHeader('Content-Type', 'application/json');
                      res.end(JSON.stringify({ success: true, data }));
                    }
                  } else {
                    if (!name || !userSubject || !message) {
                      console.error('[API] Missing required fields for contact form');
                      res.statusCode = 400;
                      res.setHeader('Content-Type', 'application/json');
                      res.end(JSON.stringify({ error: 'Missing required fields for contact form' }));
                      return;
                    }

                    // 1. Send Admin Notification
                    const adminEmail = await resend.emails.send({
                      from: 'REMsleep Contact <noreply@myremsleep.com>',
                      to: ['hello@myremsleep.com'],
                      replyTo: email,
                      subject: `[Contact Form] ${userSubject}`,
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
                                                <td bgcolor="#f9f8f6" style="padding: 20px; border-radius: 4px; border: 1px solid #e8e3dc; font-family: 'Montserrat', sans-serif;">
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

                    if (adminEmail.error) {
                      console.error('[API] Resend Error:', adminEmail.error);
                      res.statusCode = 500;
                      res.setHeader('Content-Type', 'application/json');
                      res.end(JSON.stringify({ error: adminEmail.error.message }));
                    } else {
                      console.log('[API] Success:', adminEmail.data);
                      res.statusCode = 200;
                      res.setHeader('Content-Type', 'application/json');
                      res.end(JSON.stringify({
                        success: true,
                        adminData: adminEmail.data,
                        userData: userEmail.data
                      }));
                    }
                  }
                } catch (err: any) {
                  console.error('[API] Server Error:', err);
                  res.statusCode = 500;
                  res.setHeader('Content-Type', 'application/json');
                  res.end(JSON.stringify({ error: `A server error occurred: ${err.message}` }));
                }
              });
            } else {
              next();
            }
          });
        },
      },
    ].filter(Boolean),
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
  };
});

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

        const fontImport = '<link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;700&display=swap" rel="stylesheet">';
        const commonStyles = `
            font-family: 'Montserrat', Arial, sans-serif;
            margin: 0;
            padding: 0;
            background-color: #f5f1ed;
            color: #2d2a26;
        `;

        if (type === 'unsubscribe') {
            const { data, error } = await resend.emails.send({
                from: 'REMsleep <hello@myremsleep.com>',
                to: [email],
                subject: 'Unsubscription Confirmed - REMsleep',
                html: `
                <!DOCTYPE html>
                <html>
                <head>
                    ${fontImport}
                    <style>
                        body { ${commonStyles} }
                        .container { max-width: 600px; margin: 40px auto; background-color: #f5f1ed; padding: 60px 40px; border-radius: 4px; box-shadow: 0 4px 6px rgba(0,0,0,0.01); }
                        .logo { text-align: center; margin-bottom: 40px; }
                        .logo img { height: 60px; width: auto; }
                        .content { text-align: center; line-height: 1.8; }
                        .serif-header { font-family: 'Times New Roman', serif; font-size: 32px; color: #1a1a1a; margin-bottom: 24px; font-weight: 300; font-style: italic; }
                        .divider { height: 1px; background-color: #e8e3dc; margin: 40px 0; }
                        .footer-text { font-size: 13px; color: #999; }
                        .cta-link { color: #2d2a26; text-decoration: underline; font-weight: 500; }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <div class="logo">
                            <img src="https://www.myremsleep.com/logo5.png" alt="REMsleep" />
                        </div>
                        <div class="content">
                            <h1 class="serif-header">Rest is not a routine. It is a ritual.</h1>
                            <p style="font-size: 16px; color: #4a4a4a; margin-bottom: 30px;">
                                This email confirms that you've been unsubscribed from the REMsleep mailing list. 
                                We're sorry to see you go, but we respect your space.
                            </p>
                            <p style="font-size: 15px; color: #666;">
                                You will no longer receive updates about our upcoming drops and quiet wind-down rituals.
                            </p>
                            <div class="divider"></div>
                            <p class="footer-text">
                                Changed your mind? You can always join the ritual again at <br/>
                                <a href="https://www.myremsleep.com" class="cta-link">myremsleep.com</a>
                            </p>
                        </div>
                    </div>
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
                subject: 'Welcome to REMsleep',
                html: `
                    <!DOCTYPE html>
                    <html>
                    <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; line-height: 1.6; color: #333333; margin: 0; padding: 0; background-color: #F5F1ED;">
                        <div style="max-width: 600px; margin: 40px auto; background-color: #F5F1ED; padding: 40px; border-radius: 4px;">
                            <p>Hello ${name || 'there'},</p>
                            
                            <p>Welcome to REMsleep.</p>
                            
                            <p>In a world that rarely slows down, sleep becomes recovery. Renewal. A quiet reset where new dreams take shape.</p>
                            
                            <p>We create calm, considered bedding in grounding tones designed to support your wind-down ritual and elevate every moment you spend in bed.</p>
                            
                            <p><i>Rest. Renew. Awaken new dreams.</i></p>
                            
                            <hr style="border: none; border-top: 1px solid #eeeeee; margin: 30px 0;" />
                            
                            <p><strong>Before you go, A Quick Question:</strong></p>
                            
                            <p>• Reply with one word:<br/>
                            What do you want your bedroom to feel like this season?</p>
                            
                            <p><i>Calm. Cosy. Restored. Inspired.</i></p>
                            
                            <p>I read every reply.</p>
                            
                            <p style="margin-top: 30px;">With love,<br/>
                            <strong>Kiki</strong><br/>
                            Founder, REMsleep</p>
                            
                            <p style="font-size: 12px; color: #999999; margin-top: 40px; border-top: 1px solid #eeeeee; padding-top: 20px;">
                                P.S. Add <a href="mailto:hello@myremsleep.com" style="color: #999999;">hello@myremsleep.com</a> to your contacts so REMsleep always reaches you.
                            </p>
                            
                            <div style="margin-top: 20px; text-align: left;">
                                <img src="https://www.myremsleep.com/logo5.png" alt="REMsleep" style="height: 30px; width: auto; opacity: 0.8;" />
                            </div>
                        </div>
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
                html: `
                    <div style="font-family: 'Montserrat', Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #2d2a26;">
                      <h2 style="color: #2d2a26; border-bottom: 2px solid #e8e3dc; padding-bottom: 10px;">
                        New Questionnaire Submission
                      </h2>
                      <p><strong>User Email:</strong> ${email}</p>
                      <div style="background-color: #f9f8f6; padding: 20px; border-radius: 4px; margin: 20px 0;">
                        <h3 style="margin-top: 0;">Responses:</h3>
                        <ul style="list-style-type: none; padding-left: 0;">
                          <li style="margin-bottom: 10px;"><strong>Bed Size:</strong> ${answers?.bedSize || 'Not specified'}</li>
                          <li style="margin-bottom: 10px;"><strong>Colors:</strong> ${answers?.colors?.join(', ') || 'Not specified'} ${answers?.colorOther ? `(Other: ${answers.colorOther})` : ''}</li>
                          <li style="margin-bottom: 10px;"><strong>Feel:</strong> ${answers?.feel || 'Not specified'}</li>
                          <li style="margin-bottom: 10px;"><strong>Priority:</strong> ${answers?.priority || 'Not specified'}</li>
                          <li style="margin-bottom: 10px;"><strong>Bed Feeling:</strong> ${answers?.bedFeeling || 'Not specified'}</li>
                        </ul>
                      </div>
                    </div>
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
                html: `
                    <div style="font-family: 'Montserrat', Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #2d2a26;">
                      <h2 style="color: #2d2a26; border-bottom: 2px solid #e8e3dc; padding-bottom: 10px;">
                        New Contact Form Submission
                      </h2>
                      <div style="background-color: #f9f8f6; padding: 20px; border-radius: 4px; margin: 20px 0;">
                        <p style="margin: 0 0 10px 0;"><strong>From:</strong> ${name}</p>
                        <p style="margin: 0 0 10px 0;"><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
                        <p style="margin: 0;"><strong>Subject:</strong> ${userSubject}</p>
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

            // 2. Send User Auto-Responder
            const userEmail = await resend.emails.send({
                from: 'REMsleep <hello@myremsleep.com>',
                to: [email],
                subject: 'We have received your message - REMsleep',
                html: `
                    <!DOCTYPE html>
                    <html>
                    <head>
                        ${fontImport}
                        <style>
                            body { ${commonStyles} }
                            .container { max-width: 600px; margin: 40px auto; background-color: #f5f1ed; padding: 60px 40px; border-radius: 4px; box-shadow: 0 4px 6px rgba(0,0,0,0.01); }
                            .logo { text-align: center; margin-bottom: 40px; }
                            .logo img { height: 60px; width: auto; }
                            .content { line-height: 1.8; color: #4a4a4a; }
                            .divider { height: 1px; background-color: #e8e3dc; margin: 40px 0; }
                            .footer { font-size: 14px; color: #666; }
                            .cta-link { color: #2d2a26; text-decoration: underline; font-weight: 500; }
                        </style>
                    </head>
                    <body>
                        <div class="container">
                            <div class="logo">
                                <img src="https://www.myremsleep.com/logo5.png" alt="REMsleep" />
                            </div>
                            <div class="content">
                                <p style="font-size: 16px; margin-bottom: 24px;">Hi ${name || 'there'},</p>
                                <p style="margin-bottom: 20px;">Thank you for reaching out. We have received your message and we will be in touch soon.</p>
                                <p style="margin-bottom: 20px;">In the meantime, if your enquiry relates to our pre-launch, you can reply to this email with a little more detail so we can direct it to the right person.</p>
                                <p style="margin-bottom: 10px;">You may also find this helpful:</p>
                                <p style="margin-bottom: 30px;">FAQs: <a href="https://www.myremsleep.com/faq" class="cta-link">myremsleep.com/faq</a></p>
                                
                                <div class="divider"></div>
                                
                                <div class="footer">
                                    <p style="font-style: italic; font-weight: 500; color: #2d2a26; margin-bottom: 20px;">Rest. Renew. Awaken new dreams.</p>
                                    <p style="margin: 0;">With care,</p>
                                    <p style="margin: 0; font-weight: 700;">REMsleep</p>
                                    <p style="margin: 5px 0 0 0;"><a href="mailto:hello@myremsleep.com" style="color: #666; text-decoration: none;">hello@myremsleep.com</a></p>
                                </div>
                            </div>
                        </div>
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

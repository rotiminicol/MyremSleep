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
                    <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;500&family=Playfair+Display:ital,wght@0,400;1,400&display=swap" rel="stylesheet">
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
                      html: `
                        <!DOCTYPE html>
                        <html>
                        <head>
                            ${fontImport}
                            <style>
                                body { ${commonStyles} }
                                .outer-container { background-color: #f5f1ed; padding: 60px 20px; }
                                .container { max-width: 540px; margin: 0 auto; background-color: #f5f1ed; text-align: center; }
                                .logo { margin-bottom: 50px; }
                                .logo img { height: 45px; width: auto; opacity: 0.9; }
                                .serif-header { font-family: 'Playfair Display', serif; font-size: 38px; color: #1a1a1a; margin-bottom: 35px; font-weight: 400; font-style: italic; line-height: 1.2; letter-spacing: -0.5px; }
                                .content-text { font-size: 15px; line-height: 1.8; color: #4a4a4a; font-weight: 300; letter-spacing: 0.2px; margin-bottom: 30px; }
                                .divider { height: 1px; background-color: #e8e3dc; margin: 50px auto; width: 60px; }
                                .footer { margin-top: 50px; padding-top: 30px; border-top: 1px solid #e8e3dc; }
                                .cta-link { color: #2d2a26; text-decoration: none; font-weight: 500; border-bottom: 1px solid #2d2a26; padding-bottom: 2px; font-size: 13px; letter-spacing: 1px; text-transform: uppercase; }
                                .social-link { text-decoration: none; display: inline-block; margin-top: 25px; }
                                .social-icon { width: 18px; height: 18px; vertical-align: middle; opacity: 0.7; }
                                .social-text { font-size: 12px; color: #888; letter-spacing: 1px; margin-left: 8px; vertical-align: middle; text-transform: uppercase; }
                            </style>
                        </head>
                        <body>
                            <div class="outer-container">
                                <div class="container">
                                    <div class="logo">
                                        <img src="https://www.myremsleep.com/logo5.png" alt="REMsleep" />
                                    </div>
                                    <div class="content">
                                        <h1 class="serif-header">Rest is not a routine.<br/>It is a ritual.</h1>
                                        <p class="content-text">
                                            We have processed your request. This email confirms your unsubscription from our journal. 
                                            While we are sorry to see you go, we respect your quiet space.
                                        </p>
                                        <div class="divider"></div>
                                        <p style="margin-bottom: 20px;">
                                            <a href="https://www.myremsleep.com" class="cta-link">Return to the ritual</a>
                                        </p>
                                        
                                        <div class="footer">
                                            <a href="https://www.instagram.com/myremsleepclub/" class="social-link">
                                                <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/a/a5/Instagram_icon.png/120px-Instagram_icon.png" class="social-icon" alt="Instagram" />
                                                <span class="social-text">@myremsleepclub</span>
                                            </a>
                                            <p style="font-size: 11px; color: #aaa; margin-top: 30px; letter-spacing: 0.5px;">&copy; 2024 REMSLEEP. ALL RIGHTS RESERVED.</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
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
                        <html>
                        <head>
                            ${fontImport}
                            <style>
                                body { margin: 0; padding: 0; background-color: #F5F1ED; font-family: 'Montserrat', Helvetica, Arial, sans-serif; -webkit-font-smoothing: antialiased; }
                                .outer { background-color: #F5F1ED; padding: 80px 20px; text-align: center; }
                                .inner { max-width: 520px; margin: 0 auto; line-height: 1.8; color: #2D2A26; }
                                .logo-header { margin-bottom: 60px; }
                                .logo-header img { height: 45px; width: auto; opacity: 0.9; }
                                .editorial-statement { font-family: 'Playfair Display', serif; font-size: 32px; font-style: italic; color: #1a1a1a; margin-bottom: 45px; line-height: 1.2; letter-spacing: -0.5px; }
                                p { margin-bottom: 25px; font-weight: 300; letter-spacing: 0.2px; font-size: 15px; }
                                .divider { border: none; border-top: 1px solid #e8e3dc; margin: 50px auto; width: 60px; }
                                .reflection-prompt { margin: 60px 0; }
                                .reflection-title { font-family: 'Playfair Display', serif; font-size: 20px; font-style: italic; color: #1a1a1a; margin-bottom: 15px; }
                                .reflection-options { font-size: 11px; color: #888; letter-spacing: 2px; text-transform: uppercase; margin-top: 15px; }
                                .signature { margin-top: 70px; }
                                .kiki-sign { font-family: 'Playfair Display', serif; font-size: 28px; font-style: italic; color: #1a1a1a; margin: 10px 0 5px 0; }
                                .footer { margin-top: 80px; padding-top: 40px; border-top: 1px solid #e8e3dc; }
                                .social-link { text-decoration: none; display: inline-block; margin-top: 20px; }
                                .social-icon { width: 16px; height: 16px; vertical-align: middle; opacity: 0.6; }
                                .social-text { font-size: 11px; color: #888; letter-spacing: 1px; margin-left: 8px; vertical-align: middle; text-transform: uppercase; }
                                .ps-text { font-size: 12px; color: #888; margin-top: 30px; font-style: italic; }
                            </style>
                        </head>
                        <body>
                            <div class="outer">
                                <div class="inner">
                                    <div class="logo-header">
                                        <img src="https://www.myremsleep.com/logo5.png" alt="REMsleep" />
                                    </div>
                                    
                                    <div class="editorial-statement">Welcome to REMsleep</div>
                                    
                                    <p>Hello ${name || 'there'},</p>
                                    
                                    <p>Welcome to REMsleep.</p>
                                    
                                    <p>In a world that rarely slows down, sleep becomes recovery. Renewal. A quiet reset where new dreams take shape.</p>
                                    
                                    <p>We create calm, considered bedding in grounding tones designed to support your wind-down ritual and elevate every moment you spend in bed.</p>
                                    
                                    <p style="font-family: 'Playfair Display', serif; font-style: italic; font-size: 18px; color: #1a1a1a; margin: 35px 0;">Rest. Renew. Awaken new dreams.</p>
                                    
                                    <div class="divider"></div>
                                    
                                    <div class="reflection-prompt">
                                        <div class="reflection-title">Before you go, A Quick Question:</div>
                                        <p style="font-style: italic; margin-bottom: 15px;">&bull; Reply with one word:<br/>What do you want your bedroom to feel like this season?</p>
                                        <div class="reflection-options">Calm &bull; Cosy &bull; Restored &bull; Inspired</div>
                                        <p style="margin-top: 15px;">I read every reply.</p>
                                    </div>
                                    
                                    <div class="signature">
                                        <p style="margin-bottom: 0; font-weight: 400; text-transform: uppercase; letter-spacing: 1px; font-size: 12px;">With love,</p>
                                        <div class="kiki-sign">Kiki</div>
                                        <p style="font-size: 11px; color: #888; text-transform: uppercase; letter-spacing: 1px; margin-top: 0;">Founder, REMsleep</p>
                                    </div>

                                    <p class="ps-text">P.S. Add <a href="mailto:hello@myremsleep.com" style="color: #888;">hello@myremsleep.com</a> to your contacts so REMsleep always reaches you.</p>
                                    
                                    <div class="footer">
                                        <a href="https://www.instagram.com/myremsleepclub/" class="social-link">
                                            <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/a/a5/Instagram_icon.png/120px-Instagram_icon.png" class="social-icon" alt="Instagram" />
                                            <span class="social-text">@myremsleepclub</span>
                                        </a>
                                        <p style="font-size: 10px; color: #aaa; margin-top: 35px; letter-spacing: 1px; text-transform: uppercase;">
                                            &copy; 2024 REMSLEEP. ALL RIGHTS RESERVED.
                                        </p>
                                    </div>
                                </div>
                            </div>
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
                      replyTo: 'hello@myremsleep.com',
                      subject: 'We have received your message - REMsleep',
                      html: `
                        <!DOCTYPE html>
                        <html>
                        <head>
                            ${fontImport}
                            <style>
                                body { ${commonStyles} }
                                .outer-container { background-color: #f5f1ed; padding: 60px 20px; }
                                .container { max-width: 580px; margin: 0 auto; background-color: #f5f1ed; }
                                .logo { text-align: center; margin-bottom: 50px; }
                                .logo img { height: 50px; width: auto; }
                                .content { line-height: 1.8; color: #4a4a4a; font-weight: 300; }
                                .greeting { font-family: 'Playfair Display', serif; font-size: 28px; font-style: italic; color: #1a1a1a; margin-bottom: 30px; }
                                .divider { height: 1px; background-color: #e8e3dc; margin: 45px 0; }
                                .footer { margin-top: 50px; font-size: 14px; color: #666; }
                                .serif-signoff { font-family: 'Playfair Display', serif; font-size: 18px; font-style: italic; color: #1a1a1a; margin-bottom: 25px; }
                                .social-section { margin-top: 35px; border-top: 1px solid #e8e3dc; padding-top: 30px; }
                                .social-link { text-decoration: none; color: #2d2a26; font-size: 12px; letter-spacing: 1px; text-transform: uppercase; font-weight: 500; }
                                .social-icon { width: 16px; height: 16px; vertical-align: middle; margin-right: 8px; opacity: 0.7; }
                                .faq-link { color: #2d2a26; text-decoration: none; border-bottom: 1px solid #2d2a26; padding-bottom: 2px; font-weight: 500; font-size: 13px; }
                            </style>
                        </head>
                        <body>
                            <div class="outer-container">
                                <div class="container">
                                    <div class="logo">
                                        <img src="https://www.myremsleep.com/logo5.png" alt="REMsleep" />
                                    </div>
                                    <div class="content">
                                        <h2 class="greeting">Hi ${name || 'there'},</h2>
                                        <p>Thank you for reaching out to us. We have received your message and will be in touch with you shortly.</p>
                                        <p>As we prepare for our upcoming drop, we are giving extra attention to every enquiry. If your message relates to our pre-launch, feel free to reply directly to this email with any specific details.</p>
                                        <p>In the meantime, you may find the information you need in our collection notes:</p>
                                        <p style="margin-top: 25px;"><a href="https://www.myremsleep.com/faq" class="faq-link">View our FAQs</a></p>
                                        
                                        <div class="divider"></div>
                                        
                                        <div class="footer">
                                            <p class="serif-signoff">Rest. Renew. Awaken new dreams.</p>
                                            <p style="margin: 0; font-weight: 400; letter-spacing: 1px; text-transform: uppercase; font-size: 12px;">With care,</p>
                                            <p style="margin: 5px 0 0 0; font-weight: 500;">REMsleep Team</p>
                                            
                                            <div class="social-section">
                                                <a href="https://www.instagram.com/myremsleepclub/" class="social-link">
                                                    <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/a/a5/Instagram_icon.png/120px-Instagram_icon.png" class="social-icon" alt="Instagram" />
                                                    @myremsleepclub
                                                </a>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
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

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
                                body { margin: 0 !important; padding: 0 !important; width: 100% !important; -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; background-color: #f5f1ed; font-family: 'Montserrat'; -webkit-font-smoothing: antialiased; }
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
                                                <td align="center" style="font-family: 'Montserrat', serif; font-size: 38px; color: #1a1a1a; padding-bottom: 35px; font-weight: 400; font-style: italic; line-height: 1.2; letter-spacing: -0.5px;">
                                                    Rest is not a routine.<br/>It is a ritual.
                                                </td>
                                            </tr>
                                            <!-- Content -->
                                            <tr>
                                                <td align="center" style="font-family: 'Montserrat'; font-size: 15px; line-height: 1.8; color: #4a4a4a; font-weight: 300; letter-spacing: 0.2px; padding-bottom: 30px;">
                                                    While we are sorry to see you go, we have processed your request. This email confirms your unsubscription from our mailing list.
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
                                                    <a href="https://www.myremsleep.com" style="font-family: 'Montserrat'; color: #2d2a26; text-decoration: none; font-weight: 500; border-bottom: 1px solid #2d2a26; padding-bottom: 2px; font-size: 13px; letter-spacing: 1px; text-transform: uppercase;">Return to the ritual</a>
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
                                                                <td style="font-family: 'Montserrat'; font-size: 12px; color: #888; letter-spacing: 1px; text-transform: uppercase; padding-left: 8px;">
                                                                    @myremsleepclub
                                                                </td>
                                                            </tr>
                                                        </table>
                                                    </a>
                                                    <div style="font-family: 'Montserrat'; font-size: 11px; color: #aaa; margin-top: 30px; letter-spacing: 0.5px;">&copy; 2026 REMSLEEP. ALL RIGHTS RESERVED.</div>
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
                                body { margin: 0 !important; padding: 0 !important; width: 100% !important; -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; background-color: #ffffff; font-family: 'Montserrat'; -webkit-font-smoothing: antialiased; }
                                table { border-spacing: 0 !important; border-collapse: collapse !important; table-layout: fixed !important; margin: 0 auto !important; }
                                img { -ms-interpolation-mode: bicubic; display: block; border: 0; }
                                
                                /* interactivity Hack */
                                .mood-input { display: none !important; }
                                .mood-label { cursor: pointer; display: inline-block; padding: 5px 15px; border-radius: 4px; transition: all 0.2s; }
                                .reply-btn { display: none; }
                                #calm:checked ~ table #label-calm,
                                #cosy:checked ~ table #label-cosy,
                                #restored:checked ~ table #label-restored,
                                #inspired:checked ~ table #label-inspired {
                                    background-color: #743E00 !important;
                                    color: #ffffff !important;
                                }
                                #calm:checked ~ table #btn-calm,
                                #cosy:checked ~ table #btn-cosy,
                                #restored:checked ~ table #btn-restored,
                                #inspired:checked ~ table #label-inspired {
                                    display: inline-block !important;
                                }

                                /* Mobile Responsiveness */
                                @media only screen and (max-width: 600px) {
                                    .container { width: 100% !important; max-width: 100% !important; }
                                    .hero-section { height: auto !important; padding-bottom: 200px !important; }
                                    .m-text-32 { font-size: 26px !important; }
                                    .m-text-24 { font-size: 20px !important; }
                                    .m-text-22 { font-size: 18px !important; }
                                    .m-tagline { font-size: 24px !important; }
                                    .m-q-heading { font-size: 28px !important; }
                                    .m-q-command { font-size: 28px !important; }
                                    .m-q-question { font-size: 22px !important; }
                                    .m-mood-labels { font-size: 20px !important; white-space: normal !important; }
                                    .m-mood-labels label { margin: 5px !important; }
                                    .m-kiki { font-size: 48px !important; }
                                    .m-padding { padding: 40px 20px !important; }
                                }
                            </style>
                        </head>
                        <body style="margin: 0; padding: 0; background-color: #ffffff;">
                            <center>
                                <div class="container" style="width: 100%; max-width: 700px; margin: 0 auto;">
                                    <!-- Hidden inputs for selection state -->
                                    <input type="radio" name="mood" id="calm" class="mood-input">
                                    <input type="radio" name="mood" id="cosy" class="mood-input">
                                    <input type="radio" name="mood" id="restored" class="mood-input">
                                    <input type="radio" name="mood" id="inspired" class="mood-input">
                                    
                                    <!-- SECTION 1: HERO (Background Overlay) -->
                                    <table class="container" role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" bgcolor="#F5F1ED" align="center" style="width: 100%; max-width: 700px;">
                                        <tr>
                                            <td align="center" class="hero-section" background="https://www.myremsleep.com/topsection.png" style="background-image: url('https://www.myremsleep.com/topsection.png'); background-position: center bottom; background-size: cover; background-repeat: no-repeat; padding: 60px 20px 320px 20px;">
                                                <!--[if gte mso 9]>
                                                <v:rect xmlns:v="urn:schemas-microsoft-com:vml" fill="true" stroke="false" style="width:700px; height:600px;">
                                                    <v:fill type="frame" src="https://www.myremsleep.com/topsection.png" color="#F5F1ED" />
                                                    <v:textbox inset="0,0,0,0">
                                                <![endif]-->
                                                <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
                                                    <!-- Logo -->
                                                    <tr>
                                                        <td align="center" style="padding-bottom: 60px;">
                                                            <img src="https://www.myremsleep.com/logo5.png" alt="REMsleep" width="140" style="margin: 0 auto; height: auto; max-width: 140px;" />
                                                        </td>
                                                    </tr>
                                                    <!-- Headline -->
                                                    <tr>
                                                        <td align="center" class="m-text-32" style="font-family: 'Montserrat'; font-size: 32px; color: #1a1a1a; line-height: 1.3; letter-spacing: -0.04em;">
                                                            <span style="font-weight: 700;">REST</span> <span style="font-weight: 400;">is not a routine.</span><br/>
                                                            <span style="font-weight: 400;">It is a </span><span style="font-weight: 700;">RITUAL.</span>
                                                        </td>
                                                    </tr>
                                                </table>
                                                <!--[if gte mso 9]>
                                                    </v:textbox>
                                                </v:rect>
                                                <![endif]-->
                                            </td>
                                        </tr>
                                    </table>

                                    <!-- SECTION 2: CONTENT (White Background #FFFFFF) -->
                                    <table class="container" role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" bgcolor="#ffffff" align="center" style="width: 100%; max-width: 700px;">
                                        <tr>
                                            <td align="center" class="m-padding" style="padding: 60px 40px 40px 40px;">
                                                <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
                                                    <!-- Welcome Heading -->
                                                    <tr>
                                                        <td align="center" class="m-text-32" style="font-family: 'Montserrat'; font-size: 32px; font-weight: 700; color: #000000; padding-bottom: 30px; line-height: 1.2; letter-spacing: -0.04em;">
                                                            Welcome to REMsleep
                                                        </td>
                                                    </tr>
                                                    <!-- Greeting -->
                                                    <tr>
                                                        <td align="center" class="m-text-24" style="font-family: 'Montserrat'; font-size: 24px; font-weight: 400; letter-spacing: -0.04em; padding-bottom: 35px; color: #000000; line-height: 1.2;">
                                                            Hello ${name || 'there'},
                                                        </td>
                                                    </tr>
                                                    <!-- Body Text -->
                                                    <tr>
                                                        <td align="center" class="m-text-22" style="font-family: 'Montserrat'; font-size: 22px; font-weight: 400; letter-spacing: -0.04em; padding-bottom: 35px; color: #000000; line-height: 1.4;">
                                                            In a world that rarely slows down, sleep becomes Recovery, Renewal.
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td align="center" class="m-text-22" style="font-family: 'Montserrat'; font-size: 22px; font-weight: 400; letter-spacing: -0.04em; padding-bottom: 40px; color: #000000; line-height: 1.4;">
                                                            A quiet reset where new dreams take shape. We create calm, considered bedding in grounding tones designed to support your wind-down ritual and elevate every moment you spend in bed.
                                                        </td>
                                                    </tr>
                                                    <!-- Tagline -->
                                                    <tr>
                                                        <td align="center" class="m-tagline" style="font-family: 'Montserrat', serif; font-style: italic; font-weight: 700; font-size: 32px; color: #000000; padding-bottom: 20px; line-height: 1.2; letter-spacing: -0.04em;">
                                                            Rest. Renew. Awaken new dreams.
                                                        </td>
                                                    </tr>
                                                </table>
                                            </td>
                                        </tr>
                                    </table>

                                    <!-- SECTION 3: QUESTIONNAIRE (Pink Background #FFEDE6) -->
                                    <table class="container" role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" bgcolor="#FFEDE6" align="center" style="width: 100%; max-width: 700px;">
                                        <tr>
                                            <td align="center" class="m-padding" style="padding: 70px 40px;">
                                                <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
                                                    <tr>
                                                        <td align="center" class="m-q-heading" style="font-family: 'Montserrat', serif; font-size: 32px; font-weight: 400; color: #000000; padding-bottom: 35px; line-height: 1.2; letter-spacing: -0.04em;">
                                                            Before you go, A quick question:
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td align="center" class="m-q-command" style="font-family: 'Montserrat'; font-weight: 700; font-size: 36px; padding-bottom: 30px; color: #000000; line-height: 1.2; letter-spacing: -0.04em;">
                                                            Reply with one word:
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td align="center" class="m-q-question" style="font-family: 'Montserrat'; font-size: 28px; font-weight: 400; padding-bottom: 35px; color: #000000; line-height: 1.3; letter-spacing: -0.04em;">
                                                            What do you want your bedroom<br/>to feel like this season?
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td align="center" class="m-mood-labels" style="font-family: 'Montserrat'; font-size: 36px; color: #743E00; letter-spacing: -0.04em; padding-bottom: 50px; font-weight: 700; line-height: 1.2; white-space: nowrap;">
                                                            <label for="calm" id="label-calm" class="mood-label" style="padding: 5px 10px;">Calm</label> &bull; 
                                                            <label for="cosy" id="label-cosy" class="mood-label" style="padding: 5px 10px;">Cosy</label> &bull; 
                                                            <label for="restored" id="label-restored" class="mood-label" style="padding: 5px 10px;">Restored</label> &bull; 
                                                            <label for="inspired" id="label-inspired" class="mood-label" style="padding: 5px 10px;">Inspired</label>
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td align="center" class="m-text-22" style="font-family: 'Montserrat'; font-size: 28px; font-weight: 400; color: #000000; line-height: 1.2; letter-spacing: -0.04em;">
                                                            <div style="padding-bottom: 30px;">I read every reply.</div>
                                                            <!-- Dynamic Buttons -->
                                                            <a id="btn-calm" href="mailto:hello@myremsleep.com?subject=My bedroom mood: Calm" class="reply-btn" style="display: none; padding: 12px 30px; background-color: #000000; color: #ffffff; text-decoration: none; border-radius: 6px; font-size: 18px; font-weight: 600;">Reply with "Calm"</a>
                                                            <a id="btn-cosy" href="mailto:hello@myremsleep.com?subject=My bedroom mood: Cosy" class="reply-btn" style="display: none; padding: 12px 30px; background-color: #000000; color: #ffffff; text-decoration: none; border-radius: 6px; font-size: 18px; font-weight: 600;">Reply with "Cosy"</a>
                                                            <a id="btn-restored" href="mailto:hello@myremsleep.com?subject=My bedroom mood: Restored" class="reply-btn" style="display: none; padding: 12px 30px; background-color: #000000; color: #ffffff; text-decoration: none; border-radius: 6px; font-size: 18px; font-weight: 600;">Reply with "Restored"</a>
                                                            <a id="btn-inspired" href="mailto:hello@myremsleep.com?subject=My bedroom mood: Inspired" class="reply-btn" style="display: none; padding: 12px 30px; background-color: #000000; color: #ffffff; text-decoration: none; border-radius: 6px; font-size: 18px; font-weight: 600;">Reply with "Inspired"</a>
                                                        </td>
                                                    </tr>
                                                </table>
                                            </td>
                                        </tr>
                                    </table>

                                    <!-- SECTION 4: FOOTER (White Background #FFFFFF) -->
                                    <table class="container" role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" bgcolor="#ffffff" align="center" style="width: 100%; max-width: 700px;">
                                        <tr>
                                            <td align="center" class="m-padding" style="padding: 60px 20px 40px 20px;">
                                                <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
                                                    <!-- Signature -->
                                                    <tr>
                                                        <td align="center" style="padding-bottom: 45px;">
                                                            <div class="m-text-22" style="font-family: 'Montserrat'; font-weight: 400; letter-spacing: -0.04em; font-size: 22px; padding-bottom: 10px; color: #000000; line-height: 1.2;">With love,</div>
                                                            <div class="m-kiki" style="font-family: 'Montserrat', serif; font-size: 64px; font-weight: 700; font-style: italic; color: #000000; padding-bottom: 10px; line-height: 1; letter-spacing: -0.04em;">Kiki</div>
                                                            <div class="m-text-20" style="font-family: 'Montserrat'; font-size: 20px; font-weight: 400; color: #000000; letter-spacing: -0.04em; padding-bottom: 40px; line-height: 1.2;">Founder, REMsleep</div>
                                                            
                                                            <!-- Contact Button -->
                                                            <a href="mailto:hello@myremsleep.com" style="display: inline-block; padding: 18px 50px; background-color: #000000; color: #ffffff; text-decoration: none; border-radius: 8px; font-family: 'Montserrat'; font-weight: 500; font-size: 20px; letter-spacing: 0.5px; text-transform: none;">Contact us</a>
                                                        </td>
                                                    </tr>
                                                    <!-- Footer Info -->
                                                    <tr>
                                                        <td align="center" style="border-top: 1px solid #E5E5E5; padding-top: 40px; padding-bottom: 30px;">
                                                            <a href="https://www.instagram.com/myremsleepclub/" style="text-decoration: none; display: inline-block; padding-bottom: 25px;">
                                                                <table role="presentation" border="0" cellpadding="0" cellspacing="0" align="center">
                                                                    <tr>
                                                                        <td style="vertical-align: middle;">
                                                                            <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/a/a5/Instagram_icon.png/120px-Instagram_icon.png" width="22" height="22" style="display: block;" alt="IG" />
                                                                        </td>
                                                                        <td style="font-family: 'Montserrat'; font-size: 18px; font-weight: 400; color: #000000; letter-spacing: -0.04em; padding-left: 10px; vertical-align: middle; line-height: 1;">
                                                                            @myremsleepclub
                                                                        </td>
                                                                    </tr>
                                                                </table>
                                                            </a>
                                                            <div style="padding-bottom: 25px;">
                                                                <img src="https://www.myremsleep.com/logo5.png" alt="REMsleep" width="110" style="margin: 0 auto; height: auto;" />
                                                            </div>
                                                            <div style="font-family: 'Montserrat'; font-size: 12px; font-weight: 400; color: #000000; letter-spacing: 0.05em; text-transform: uppercase; padding-bottom: 12px; line-height: 1.4;">
                                                                REMsleep Headquarters, London, UK<br/>
                                                                &copy; 2026 REMSLEEP. ALL RIGHTS RESERVED.
                                                            </div>
                                                            <div style="font-family: 'Montserrat'; font-size: 12px; font-weight: 400; line-height: 1.4; letter-spacing: 0.05em;">
                                                                <a href="https://www.myremsleep.com/unsubscribe" style="color: #000000; text-decoration: underline;">Unsubscribe</a>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                </table>
                                            </td>
                                        </tr>
                                    </table>
                                </div>
                            </center>
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
                        <body style="margin: 0; padding: 0; background-color: #ffffff; font-family: 'Montserrat';">
                            <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" bgcolor="#ffffff">
                                <tr>
                                    <td align="center" style="padding: 40px 20px;">
                                        <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px; text-align: left; color: #2d2a26;">
                                            <tr>
                                                <td style="padding-bottom: 10px; border-bottom: 2px solid #e8e3dc;">
                                                    <h2 style="margin: 0; font-family: 'Montserrat';">New Questionnaire Submission</h2>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td style="padding: 20px 0; font-family: 'Montserrat';">
                                                    <p><strong>User Email:</strong> ${email}</p>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td bgcolor="#f9f8f6" style="padding: 20px; border-radius: 4px; font-family: 'Montserrat';">
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
                        <body style="margin: 0; padding: 0; background-color: #ffffff; font-family: 'Montserrat';">
                            <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" bgcolor="#ffffff">
                                <tr>
                                    <td align="center" style="padding: 40px 20px;">
                                        <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px; text-align: left; color: #2d2a26;">
                                            <tr>
                                                <td style="padding-bottom: 10px; border-bottom: 2px solid #e8e3dc;">
                                                    <h2 style="margin: 0; font-family: 'Montserrat';">New Contact Form Submission</h2>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td bgcolor="#f9f8f6" style="padding: 20px; border-radius: 4px; border: 1px solid #e8e3dc; font-family: 'Montserrat';">
                                                    <p style="margin: 0 0 10px 0;"><strong>From:</strong> ${name}</p>
                                                    <p style="margin: 0 0 10px 0;"><strong>Email:</strong> ${email}</p>
                                                    <p style="margin: 0;"><strong>Subject:</strong> ${userSubject}</p>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td style="padding: 20px 0; font-family: 'Montserrat';">
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
                                body { margin: 0 !important; padding: 0 !important; width: 100% !important; -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; background-color: #f5f1ed; font-family: 'Montserrat'; -webkit-font-smoothing: antialiased; }
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
                                                <td style="font-family: 'Montserrat', serif; font-size: 30px; font-style: italic; color: #1a1a1a; padding-bottom: 30px;">
                                                    Hi ${name || 'there'},
                                                </td>
                                            </tr>
                                            <!-- Content -->
                                            <tr>
                                                <td style="font-family: 'Montserrat'; font-weight: 300; padding-bottom: 20px; font-size: 17px; line-height: 1.8; color: #4a4a4a;">
                                                    Thank you for reaching out to us. We have received your message and will be in touch with you shortly.
                                                </td>
                                            </tr>
                                            <tr>
                                                <td style="font-family: 'Montserrat'; font-weight: 300; padding-bottom: 20px; font-size: 17px; line-height: 1.8; color: #4a4a4a;">
                                                    As we prepare for our upcoming drop, we are giving extra attention to every enquiry. If your message relates to our pre-launch, feel free to reply directly to this email with any specific details.
                                                </td>
                                            </tr>
                                            <tr>
                                                <td style="font-family: 'Montserrat'; font-weight: 300; padding-bottom: 25px; font-size: 17px; line-height: 1.8; color: #4a4a4a;">
                                                    In the meantime, you may find the information you need in our collection notes:
                                                </td>
                                            </tr>
                                            <tr>
                                                <td style="padding-bottom: 45px;">
                                                    <a href="https://www.myremsleep.com/faq" style="font-family: 'Montserrat'; color: #2d2a26; text-decoration: none; border-bottom: 1px solid #2d2a26; padding-bottom: 2px; font-weight: 500; font-size: 15px; letter-spacing: 1px; text-transform: uppercase;">View our FAQs</a>
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
                                                    <div style="font-family: 'Montserrat', serif; font-size: 20px; font-style: italic; color: #1a1a1a; padding-bottom: 25px;">Rest. Renew. Awaken new dreams.</div>
                                                    <div style="font-family: 'Montserrat'; font-weight: 400; letter-spacing: 1px; text-transform: uppercase; font-size: 14px; padding-bottom: 5px; color: #4a4a4a;">With care,</div>
                                                    <div style="font-family: 'Montserrat'; font-weight: 500; padding-bottom: 35px; color: #2d2a26;">REMsleep Team</div>
                                                    
                                                    <div style="border-top: 1px solid #e8e3dc; padding-top: 30px;">
                                                        <a href="https://www.instagram.com/myremsleepclub/" style="text-decoration: none; color: #2d2a26; font-family: 'Montserrat'; font-size: 12px; letter-spacing: 1px; text-transform: uppercase; font-weight: 500;">
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

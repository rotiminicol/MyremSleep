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
                  const { name, email, subject, message } = payload;

                  console.log(`[API] Payload:`, { name, email, subject, message: message?.substring(0, 20) + '...' });

                  if (!env.VITE_RESEND_API_KEY) {
                    console.error('[API] Missing VITE_RESEND_API_KEY');
                    res.statusCode = 500;
                    res.setHeader('Content-Type', 'application/json');
                    res.end(JSON.stringify({ error: 'Server configuration error: Missing API Key' }));
                    return;
                  }

                  const resend = new Resend(env.VITE_RESEND_API_KEY);

                  const { data, error } = await resend.emails.send({
                    from: 'REMsleep Contact <noreply@myremsleep.com>',
                    to: ['hello@myremsleep.com'],
                    replyTo: email, // Direct reply to user
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
                          <p>This message was sent from the REMsleep website contact form (Local Dev).</p>
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
                    console.log('[API] Success:', data);
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.end(JSON.stringify({ success: true, data }));
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

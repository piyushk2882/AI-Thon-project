import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import * as dotenv from 'dotenv'

// Load environment variables so process.env is populated for the backend handler
dotenv.config()

const apiProxy = () => {
  return {
    name: 'api-proxy',
    configureServer(server) {
      server.middlewares.use('/api/generate-plan', async (req, res, next) => {
        if (req.method === 'POST') {
          let body = '';
          req.on('data', chunk => { body += chunk.toString() });
          req.on('end', async () => {
            try {
              req.body = JSON.parse(body || '{}');
              
              // Dynamically import the handler to ensure fresh environment
              const handler = (await import('./api/generate-plan.js')).default;
              
              // Mock Vercel-like res.status and res.json methods
              res.status = (code) => {
                res.statusCode = code;
                return res;
              };
              res.json = (data) => {
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify(data));
              };

              await handler(req, res);
            } catch (error) {
              console.error('Middleware Error:', error);
              res.statusCode = 500;
              res.end(JSON.stringify({ error: "Internal Server Error" }));
            }
          });
        } else {
          next();
        }
      });
    }
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), apiProxy()],
})

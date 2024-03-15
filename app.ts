import express, { Request, Response, NextFunction } from 'express';
import { createProxyMiddleware, RequestHandler } from 'http-proxy-middleware';
import jwt from 'jsonwebtoken';

const app = express();

// Define your JWT secret key
const JWT_SECRET: string = 'SECRET_KEY';

// Middleware to authenticate JWT tokens
const authenticateJWT: RequestHandler = (req: any, res: any, next: NextFunction) => {
  const token: string | undefined = req.headers.authorization as string | undefined;
  console.log("token", token);
  
  if (!token) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    // Verify JWT token
    const decoded: any = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    console.log("error", error);
    
    return res.status(403).json({ error: 'Forbidden' });
  }
};

// Define your target server
const targetServer: string = "http://localhost:3001";

// Create the proxy middleware
const proxyMiddlewareJWT = createProxyMiddleware({
  target: targetServer,
  changeOrigin: true,
  onProxyReq: (proxyReq, req: any, res: any) => {
    if (req.user) {
      proxyReq.setHeader("username", req.user.username);
    }
  },
});

// Apply the authentication middleware and proxy middleware
app.use((req: Request, res: Response, next: NextFunction) => {
  if (!req.path.includes("/auth")) {
    authenticateJWT(req, res, next);
  } else {
    next();
  }
});

app.use('/', proxyMiddlewareJWT);


// Start the server
const port: number = 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

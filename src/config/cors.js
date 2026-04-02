import config from './index.js';

const allowedOrigins = config.server.allowedOrigins;

const corsOptions = {
  origin: (origin, callback) => {
    // Allow requests without origin (Postman, curl, mobile apps)
    if (!origin) return callback(null, true);

    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error(`CORS: Origin ${origin} is not allowed`));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true, // allow cookies and authentication headers
  maxAge: 86400, // cache preflight requests for 24 hours
};

export default corsOptions;

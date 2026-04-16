const express = require('express');
const path = require('path');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');

const authRoutes = require('./routes/authRoutes');
const adminRoutes = require('./routes/adminRoutes');
const userRoutes = require('./routes/userRoutes');
const productRoutes = require('./routes/productRoutes');
const cartRoutes = require('./routes/cartRoutes');
const orderRoutes = require('./routes/orderRoutes');
const uploadRoutes = require('./routes/uploadRoutes');
const { notFound, errorHandler } = require('./middleware/errorMiddleware');

const app = express();

app.use(
  helmet({
    contentSecurityPolicy: false,
  })
);

const allowedOrigins = [process.env.CLIENT_URL, 'http://localhost:5173', 'http://127.0.0.1:5173'];
app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
  })
);

app.use(express.static(path.join(__dirname, '..', '..', 'frontend')));

app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 200,
    standardHeaders: true,
    legacyHeaders: false,
  })
);

app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'success', message: 'E-commerce API is healthy' });
});

app.get('/api', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'E-commerce API routes',
    routes: {
      health: 'GET /api/health',
      auth: ['...'],
      users: ['...'],
      products: ['...'],
      cart: ['...'],
      orders: ['...'],
    },
  });
});

app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/upload', uploadRoutes);

const pages = ['home', 'cart', 'signin', 'signup', 'checkout-success', 'admin', 'order-details'];
pages.forEach(page => {
  app.get(`/${page}`, (req, res) => {
    res.sendFile(path.join(__dirname, '..', '..', 'frontend', `${page}.html`));
  });
});

app.get('/category/:slug', (req, res) => {
  res.sendFile(path.join(__dirname, '..', '..', 'frontend', 'category.html'));
});

app.get('*', (req, res, next) => {
  
  if (req.url.startsWith('/api') || req.url.includes('.')) {
    return next();
  }
  res.sendFile(path.join(__dirname, '..', '..', 'frontend', 'home.html'));
});

app.use(notFound);
app.use(errorHandler);

module.exports = app;

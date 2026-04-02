import { Router } from 'express';
import { authLimiter } from '../config/rateLimiter.js';

const router = Router();

router.post('/login', authLimiter, (req, res) => {
  res.json({ message: 'Login route' });
});

router.post('/signup', authLimiter, (req, res) => {
  res.json({ message: 'Register route' });
});

router.get('/users', (req, res) => {
  res.json({ message: 'Users route' });
});

router.get('/users/:id', (req, res) => {
  res.json({ message: 'User route' });
});

router.get('/books', (req, res) => {
  res.json({ message: 'Books route' });
});

router.get('/books/:id', (req, res) => {
  res.json({ message: 'Book route' });
});


export default router;
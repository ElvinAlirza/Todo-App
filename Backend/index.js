import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import authRouter from './routes/auth.js';
import todoRouter from './routes/todos.js';

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRouter);
app.use('/api/todos', todoRouter);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

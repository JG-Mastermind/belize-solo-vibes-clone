import express from 'express';
import dotenv from 'dotenv';
import stripeRoutes from './lib/stripe';

dotenv.config(); // Load environment variables

const app = express();
const PORT = 8888;

app.use(express.json());
app.use('/api', stripeRoutes);

app.get('/', (_req, res) => {
  res.send('✅ BelizeVibes API is live!');
});

app.listen(PORT, () => {
  console.log(`🚀 Backend running at http://localhost:${PORT}`);
});

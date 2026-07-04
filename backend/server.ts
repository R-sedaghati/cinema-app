import 'reflect-metadata';
import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';
import { dbConnection } from './config/database.js';
import errorHandler from './middleware/errorHandler.js';
import notFound from './middleware/notFound.js';
import routeConfig from './routes/routeConfig.js';
import { configs } from './config/configs.js';
import { connectRedis } from './config/redis.js';

dotenv.config();

const app = express();
const PORT = configs.dbPort || 3000;

app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api', routeConfig);

app.use(notFound);
app.use(errorHandler);

(async () => {
  await connectRedis();
})();

const startServer = async () => {
  try {
    await dbConnection();

    app.listen(PORT, () => {
      console.log(`🚀 Server is running on http://localhost:${PORT}`);
      console.log(`📝 Environment: ${configs.nodeEnv || 'development'}`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

startServer();

export default app;


import express from 'express';
import routes from './routes';
import { errorHandler } from './middleware/errorMiddleware';
import dotenv from 'dotenv';

dotenv.config();
const app = express();

app.use(express.json());
app.use('/api', routes);
app.use(errorHandler);

export default app;

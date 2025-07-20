import dotenv from 'dotenv';
dotenv.config(); // ✅ Load .env variables here at the top
import bodyParser from 'body-parser';
import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import swaggerUi from 'swagger-ui-express';
import fs from 'fs/promises';
import { VerifyRoute } from './routes/verify.js';
import { DigestRoutes } from './routes/digest.js';
//import { router as contactRoutes } from './routes/contact.js';
import { router as imageRoutes } from './routes/image.js';
import { router as userRoutes } from './routes/users.js';

const app = express();
const swaggerDocument = JSON.parse(
    await fs.readFile(
        new URL('./swagger.json', import.meta.url)
    )
);

app.use(cors({
    origin: 'http://localhost:3000'  // Allow requests from React app
}));
app.use(bodyParser.json());

app.use('/api/verify', VerifyRoute);
app.use('/api/user/', userRoutes);
app.use('/api/image/', imageRoutes);
app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
//app.use('/api/contact', contactRoutes);
app.use('/api/digest', DigestRoutes);

mongoose.set('strictQuery', true);
mongoose
    .connect(process.env.MONGO_URI || 'mongodb://localhost:27017/graphical-auth')
    .then(() => {
        app.listen(process.env.PORT || 5000, () => {
            console.log(`Server running on port ${process.env.PORT || 5000}`);
        });
    })
    .catch(err => console.log(err));


import express from 'express';
import { config } from './config/config';


const app = express();
const port = config.serverPORT;


export default app;
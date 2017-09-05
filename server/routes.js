import express from 'express';
import index from './routes/index.router.js';
import webhooks from './routes/webhooks.router.js';
const router = express();

router.use('/', index);

router.use('/webhook', webhooks);


export default router;
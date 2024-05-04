import express from 'express';
import dotenv from 'dotenv';

const cors = require('cors');

dotenv.config({path:'.env'})

const { PORT } = process.env;

const app = express();
app.use(express.json());
app.use(cors()); 

import shopRouter from './aplicacion';
app.use(shopRouter);

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
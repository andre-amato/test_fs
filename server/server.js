const Koa = require('koa');
const Router = require('koa-router');
const bodyParser = require('koa-bodyparser');
const cors = require('@koa/cors');
const mongoose = require('mongoose');
const storeRoutes = require('./routes/stores');

//MongoDb
//config.mongoose
const dotenv = require('dotenv');
dotenv.config();

mongoose
  .connect(process.env.MONGO_URI, {})
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('Could not connect to MongoDB', err));

//Koa and Middlewares
const app = new Koa();
const router = new Router();
app.use(cors());
app.use(bodyParser());
app.use(storeRoutes.routes());
app.use(storeRoutes.allowedMethods());

//Server
const port = process.env.PORT || 5001;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

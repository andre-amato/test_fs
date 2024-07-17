const Router = require('koa-router');
const Store = require('../models/store'); // Adjust the path to your model file

const router = new Router();

// GET all stores
router.get('/stores', async (ctx) => {
  try {
    const stores = await Store.find();
    ctx.body = stores;
  } catch (err) {
    ctx.status = 500;
    ctx.body = { message: err.message };
  }
});

// GET store by ID
router.get('/stores/:id', async (ctx) => {
  try {
    const store = await Store.findById(ctx.params.id);
    if (!store) {
      ctx.status = 404;
      ctx.body = { message: 'Store not found' };
      return;
    }
    ctx.body = store;
  } catch (err) {
    ctx.status = 500;
    ctx.body = { message: err.message };
  }
});

// POST a new store
router.post('/stores', async (ctx) => {
  const { name, code, image } = ctx.request.body;
  if (!name || !code) {
    ctx.status = 400;
    ctx.body = { message: 'Name and code are required' };
    return;
  }

  let newStore;
  if (image && image.data && image.contentType && image.size) {
    newStore = new Store({
      name,
      code,
      image: {
        data: Buffer.from(image.data, 'base64'),
        contentType: image.contentType,
        size: image.size,
      },
    });
  } else {
    newStore = new Store({
      name,
      code,
    });
  }

  try {
    const savedStore = await newStore.save();
    ctx.status = 201;
    ctx.body = savedStore;
  } catch (err) {
    ctx.status = 400;
    ctx.body = { message: err.message };
  }
});

// DELETE store by ID
router.delete('/stores/:id', async (ctx) => {
  try {
    const store = await Store.findByIdAndDelete(ctx.params.id);
    if (!store) {
      ctx.status = 404;
      ctx.body = { message: 'Store not found' };
      return;
    }
    ctx.status = 204;
  } catch (err) {
    ctx.status = 500;
    ctx.body = { message: err.message };
  }
});

module.exports = router;

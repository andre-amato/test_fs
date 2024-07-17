const Router = require('koa-router');
const multer = require('@koa/multer'); // To upload images
const Store = require('../models/store'); // Adjust the path to your model file

const router = new Router();
const upload = multer();

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

// GET image by store ID
router.get('/stores/:id/image', async (ctx) => {
  try {
    const store = await Store.findById(ctx.params.id);
    if (!store || !store.image || !store.image.data) {
      ctx.status = 404;
      ctx.body = { message: 'Image not found' };
      return;
    }
    ctx.set('Content-Type', store.image.contentType);
    ctx.body = store.image.data;
  } catch (err) {
    ctx.status = 500;
    ctx.body = { message: err.message };
  }
});

// POST a new store
router.post('/stores', upload.single('image'), async (ctx) => {
  const { name, code } = ctx.request.body;
  if (!name || !code) {
    ctx.status = 400;
    ctx.body = { message: 'Name and code are required' };
    return;
  }

  let newStore;
  if (ctx.file) {
    newStore = new Store({
      name,
      code,
      image: {
        data: ctx.file.buffer,
        contentType: ctx.file.mimetype,
        size: ctx.file.size,
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

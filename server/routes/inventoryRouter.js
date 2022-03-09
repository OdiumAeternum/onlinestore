const Router = require('express');
const router = new Router();
const inventoryController = require('../controllers/inventoryController');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/', authMiddleware, inventoryController.add);
router.get('/', authMiddleware, inventoryController.getAll);
router.get('/delete/:id', authMiddleware, inventoryController.deleteOne);

module.exports = router;
import { Router } from 'express';
import controller from './controllers/itensController.js';

const router = Router();

router.get('/', controller.getAllItens);
router.get('/:id', controller.getItemById);
router.post('/', controller.createItem);
router.put('/:id', controller.updateItem);
router.delete('/:id', controller.deleteItem);

export default router;

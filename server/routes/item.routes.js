const router = require('express').Router();
const { body } = require('express-validator');
const auth = require('../middleware/auth');
const requireAdmin = require('../middleware/roleGuard');
const validate = require('../middleware/validate');
const upload = require('../middleware/upload');
const ctrl = require('../controllers/item.controller');

const CATEGORIES = ['Electronics', 'ID/Documents', 'Bags', 'Keys', 'Other'];

const itemValidation = [
  body('category').isIn(CATEGORIES).withMessage('Invalid category'),
  body('description').trim().isLength({ min: 1, max: 500 }).withMessage('Description must be between 1 and 500 characters'),
  body('location').trim().notEmpty().withMessage('Location is required'),
  body('date').isISO8601().withMessage('A valid date is required'),
];

router.get('/', ctrl.list);
router.get('/mine', auth, ctrl.mine);
router.get('/:id', ctrl.getOne);
router.post('/lost', auth, upload.single('photo'), itemValidation, validate, ctrl.create('lost'));
router.post('/found', auth, upload.single('photo'), itemValidation, validate, ctrl.create('found'));
router.delete('/:id', auth, requireAdmin, ctrl.remove);

module.exports = router;

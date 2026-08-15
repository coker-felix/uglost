const router = require('express').Router();
const { body } = require('express-validator');
const auth = require('../middleware/auth');
const requireAdmin = require('../middleware/roleGuard');
const validate = require('../middleware/validate');
const ctrl = require('../controllers/claim.controller');

router.post(
  '/',
  auth,
  [
    body('foundItemId').isInt().withMessage('A valid item id is required'),
    body('verificationAnswer').trim().isLength({ min: 1, max: 1000 }).withMessage('Verification answer must be between 1 and 1000 characters'),
  ],
  validate,
  ctrl.submit
);

router.get('/pending', auth, requireAdmin, ctrl.listPending);
router.get('/mine', auth, ctrl.mine);
router.patch('/:id/approve', auth, requireAdmin, ctrl.approve);
router.patch('/:id/reject', auth, requireAdmin, ctrl.reject);

module.exports = router;

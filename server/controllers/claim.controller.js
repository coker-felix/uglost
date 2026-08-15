const { Claim, Item, User } = require('../models');

function photoUrl(item, req) {
  if (!item || !item.photoPath) return null;
  return `${req.protocol}://${req.get('host')}/uploads/${item.photoPath}`;
}

exports.submit = async (req, res, next) => {
  try {
    const { foundItemId, verificationAnswer } = req.body;
    const item = await Item.findByPk(foundItemId);
    if (!item) return res.status(404).json({ message: 'Item not found' });
    if (item.kind !== 'found') {
      return res.status(400).json({ message: 'You can only claim found items' });
    }
    if (item.status !== 'active') {
      return res.status(400).json({ message: 'This item is no longer available' });
    }
    const claim = await Claim.create({
      verificationAnswer,
      foundItemId,
      claimantId: req.user.id,
    });
    res.status(201).json({ claim });
  } catch (err) {
    next(err);
  }
};

exports.listPending = async (req, res, next) => {
  try {
    const claims = await Claim.findAll({
      where: { status: 'pending' },
      include: [
        { model: Item, as: 'foundItem' },
        { model: User, as: 'claimant', attributes: ['id', 'name', 'email', 'studentId'] },
      ],
      order: [['createdAt', 'ASC']],
    });

    res.json({
      claims: claims.map((c) => {
        const json = c.toJSON();
        if (json.foundItem) {
          json.foundItem.photoUrl = photoUrl(json.foundItem, req);
          delete json.foundItem.photoPath;
        }
        return json;
      }),
    });
  } catch (err) {
    next(err);
  }
};

exports.mine = async (req, res, next) => {
  try {
    const claims = await Claim.findAll({
      where: { claimantId: req.user.id },
      include: [{ model: Item, as: 'foundItem' }],
      order: [['createdAt', 'DESC']],
    });

    res.json({
      claims: claims.map((c) => {
        const json = c.toJSON();
        if (json.foundItem) {
          json.foundItem.photoUrl = photoUrl(json.foundItem, req);
          delete json.foundItem.photoPath;
        }
        return json;
      }),
    });
  } catch (err) {
    next(err);
  }
};

exports.approve = async (req, res, next) => {
  try {
    const claim = await Claim.findByPk(req.params.id);
    if (!claim) return res.status(404).json({ message: 'Claim not found' });
    claim.status = 'approved';
    claim.reviewedBy = req.user.id;
    await claim.save();

    const item = await Item.findByPk(claim.foundItemId);
    if (item) {
      item.status = 'returned';
      await item.save();
    }
    res.json({ claim });
  } catch (err) {
    next(err);
  }
};

exports.reject = async (req, res, next) => {
  try {
    const claim = await Claim.findByPk(req.params.id);
    if (!claim) return res.status(404).json({ message: 'Claim not found' });
    claim.status = 'rejected';
    claim.reviewedBy = req.user.id;
    await claim.save();
    res.json({ claim });
  } catch (err) {
    next(err);
  }
};

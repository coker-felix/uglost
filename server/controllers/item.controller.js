const { Op } = require('sequelize');
const { Item } = require('../models');

function photoUrl(item, req) {
  if (!item.photoPath) return null;
  return `${req.protocol}://${req.get('host')}/uploads/${item.photoPath}`;
}

function serialize(item, req) {
  const json = item.toJSON();
  json.photoUrl = photoUrl(item, req);
  delete json.photoPath;
  return json;
}

exports.list = async (req, res, next) => {
  try {
    const { q, category, kind, status } = req.query;
    const where = {};

    if (kind) where.kind = kind;
    if (category) where.category = category;
    if (status === 'all') {
      // admin view: return every listing regardless of status
    } else {
      where.status = status || 'active';
    }

    if (q) {
      const like = `%${q}%`;
      where[Op.or] = [
        { description: { [Op.like]: like } },
        { location: { [Op.like]: like } },
        { category: { [Op.like]: like } },
      ];
    }

    const items = await Item.findAll({ where, order: [['createdAt', 'DESC']] });
    res.json({ items: items.map((i) => serialize(i, req)), total: items.length });
  } catch (err) {
    next(err);
  }
};

exports.mine = async (req, res, next) => {
  try {
    const items = await Item.findAll({
      where: { userId: req.user.id },
      order: [['createdAt', 'DESC']],
    });
    res.json({ items: items.map((i) => serialize(i, req)) });
  } catch (err) {
    next(err);
  }
};

exports.getOne = async (req, res, next) => {
  try {
    const item = await Item.findByPk(req.params.id);
    if (!item) return res.status(404).json({ message: 'Item not found' });
    res.json({ item: serialize(item, req) });
  } catch (err) {
    next(err);
  }
};

exports.create = (kind) => async (req, res, next) => {
  try {
    const { category, description, location, date } = req.body;
    const item = await Item.create({
      kind,
      category,
      description,
      location,
      date,
      photoPath: req.file ? req.file.filename : null,
      userId: req.user.id,
    });
    res.status(201).json({ item: serialize(item, req) });
  } catch (err) {
    next(err);
  }
};

exports.remove = async (req, res, next) => {
  try {
    const item = await Item.findByPk(req.params.id);
    if (!item) return res.status(404).json({ message: 'Item not found' });
    item.status = 'removed';
    await item.save();
    res.json({ message: 'Listing removed' });
  } catch (err) {
    next(err);
  }
};

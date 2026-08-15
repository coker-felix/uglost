require('dotenv').config();
const bcrypt = require('bcryptjs');
const { sequelize, User, Item } = require('./models');

const ADMIN_EMAIL = 'admin@ug.edu.gh';
const ADMIN_PASSWORD = 'admin123';

async function seed() {
  await sequelize.sync();

  const admin = await User.findOne({ where: { email: ADMIN_EMAIL } });
  if (!admin) {
    const user = await User.create({
      name: 'Campus Security Admin',
      email: ADMIN_EMAIL,
      studentId: 'ADMIN-001',
      passwordHash: await bcrypt.hash(ADMIN_PASSWORD, 10),
      role: 'admin',
    });
    console.log(`Created admin user: ${ADMIN_EMAIL} / ${ADMIN_PASSWORD}`);
    await seedItems(user.id);
  } else if ((await Item.count()) === 0) {
    await seedItems(admin.id);
  } else {
    console.log('Admin user and listings already present, nothing to seed.');
  }

  console.log('Seed complete.');
  process.exit(0);
}

async function seedItems(userId) {
  await Item.bulkCreate([
    {
      kind: 'found',
      category: 'Electronics',
      description: 'Silver 14-inch laptop found in the Balme Library reading room. Has a blue sticker on the lid.',
      location: 'Balme Library, 2nd floor',
      date: '2026-08-14',
      status: 'active',
      userId,
    },
    {
      kind: 'found',
      category: 'ID/Documents',
      description: 'Student ID card found near the JQB lecture hall. Name withheld for verification.',
      location: 'JQB building entrance',
      date: '2026-08-13',
      status: 'active',
      userId,
    },
    {
      kind: 'lost',
      category: 'Bags',
      description: 'Black backpack with a green keychain, lost around the Night Market area.',
      location: 'Night Market',
      date: '2026-08-12',
      status: 'active',
      userId,
    },
    {
      kind: 'lost',
      category: 'Keys',
      description: 'Set of keys on a red lanyard, lost between the Sciences block and the Main Library.',
      location: 'Sciences block',
      date: '2026-08-11',
      status: 'active',
      userId,
    },
  ]);
  console.log('Seeded sample listings.');
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});

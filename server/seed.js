require('dotenv').config();
const bcrypt = require('bcryptjs');
const { sequelize, User, Item } = require('./models');

const ADMIN_EMAIL = 'admin@ug.edu.gh';
const ADMIN_PASSWORD = 'admin123';
const STUDENT_EMAIL = 'test.student@st.ug.edu.gh';
const STUDENT_PASSWORD = 'student123';

async function seed() {
  await sequelize.sync();

  const admin = await ensureUser({
    name: 'Campus Security Admin',
    email: ADMIN_EMAIL,
    studentId: 'ADMIN-001',
    password: ADMIN_PASSWORD,
    role: 'admin',
  });

  await ensureUser({
    name: 'Test Student',
    email: STUDENT_EMAIL,
    studentId: 'STU-1001',
    password: STUDENT_PASSWORD,
    role: 'student',
  });

  if ((await Item.count()) === 0) {
    await seedItems(admin.id);
  } else {
    console.log('Sample listings already present, skipping.');
  }

  console.log('Seed complete.');
  process.exit(0);
}

async function ensureUser({ name, email, studentId, password, role }) {
  const existing = await User.findOne({ where: { email } });
  if (existing) {
    console.log(`Already exists: ${email}`);
    return existing;
  }
  const user = await User.create({
    name,
    email,
    studentId,
    passwordHash: await bcrypt.hash(password, 10),
    role,
  });
  console.log(`Created ${role} user: ${email} / ${password}`);
  return user;
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

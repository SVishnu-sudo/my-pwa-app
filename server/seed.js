const { sequelize, User, GlobalConfig } = require('./models');
const bcrypt = require('bcryptjs');

async function seed() {
  try {
    await sequelize.sync({ force: true }); // WARNING: This drops tables!
    console.log('Database synced.');

    const hashedPassword = await bcrypt.hash('admin123', 10);
    const admin = await User.create({
      username: 'admin',
      password: hashedPassword,
      role: 'admin'
    });
    console.log('Admin created: admin / admin123');

    // Create a Team Leader
    const leaderPass = await bcrypt.hash('leader123', 10);
    const leader = await User.create({
        username: 'leader',
        password: leaderPass,
        role: 'team_leader'
    });
    console.log('Team Leader created: leader / leader123');

    // Create a Subordinate assigned to the leader
    const subPass = await bcrypt.hash('sub123', 10);
    await User.create({
        username: 'worker',
        password: subPass,
        role: 'subordinate',
        teamLeaderId: leader.id
    });
    console.log('Worker created: worker / sub123 (Assigned to leader)');


    // Create SOS Config
    await GlobalConfig.create({
      key: 'sos_number',
      value: '+1234567890'
    });
    console.log('SOS Number seeded.');

  } catch (err) {
    console.error('Seeding error:', err);
  } finally {
    await sequelize.close();
  }
}

seed();

require('dotenv').config();
const bcrypt = require('bcrypt');
const pool = require('../src/config/db');

async function seed() {
  const connection = await pool.getConnection();
  try {
    const hashedPassword = await bcrypt.hash('User@123', 10);

    const normalNames = [
      "Michael Smith",
      "Alex Taylor",
      "Robert Brown",
      "Amanda Jones",
      "Chris Davis"
    ];

    const ownerNames = [
      "Taylor Young",
      "Sam Walker",
      "Ravi Allen",
      "Victoria Johnson",
      "Vikram Hall"
    ];

    const normalUsers = Array.from({ length: 5 }).map((_, i) => ({
      name: normalNames[i],
      email: `user${i + 1}@storerating.com`,
      address: `User Address ${i + 1}`,
      role: 'NORMAL'
    }));

    const ownerUsers = Array.from({ length: 5 }).map((_, i) => ({
      name: ownerNames[i],
      email: `owner${i + 1}@storerating.com`,
      address: `Owner Address ${i + 1}`,
      role: 'OWNER'
    }));

    const [existing] = await connection.query('SELECT id FROM users WHERE role IN ("NORMAL", "OWNER") LIMIT 1');
    if (existing.length > 0) {
      console.log('Clearing existing normal/owner users and stores for a fresh seed...');
      await connection.query('DELETE FROM users WHERE role IN ("NORMAL", "OWNER")');
      await connection.query('DELETE FROM stores');
    }

    console.log('Inserting Normal users...');
    for (const u of normalUsers) {
      await connection.query(
        'INSERT INTO users (name, email, password, address, role) VALUES (?, ?, ?, ?, ?)',
        [u.name, u.email, hashedPassword, u.address, u.role]
      );
    }

    console.log('Inserting Owner users...');
    for (const u of ownerUsers) {
      await connection.query(
        'INSERT INTO users (name, email, password, address, role) VALUES (?, ?, ?, ?, ?)',
        [u.name, u.email, hashedPassword, u.address, u.role]
      );
    }

    const [owners] = await connection.query('SELECT id, name FROM users WHERE role = "OWNER" ORDER BY id ASC');
    
    console.log('Inserting Stores for each owner...');
    for (let i = 0; i < owners.length; i++) {
      const owner = owners[i];
      await connection.query(
        'INSERT INTO stores (name, email, address, owner_id) VALUES (?, ?, ?, ?)',
        [`Awesome Store Number ${i + 1}`, `store${i + 1}@storerating.com`, `Store Address ${i + 1}`, owner.id]
      );
    }

    console.log('Inserting random ratings...');
    const [normals] = await connection.query('SELECT id FROM users WHERE role = "NORMAL" ORDER BY id ASC');
    const [stores] = await connection.query('SELECT id FROM stores ORDER BY id ASC');

    for (const user of normals) {
      for (const store of stores) {
        if (Math.random() > 0.3) {
          const rating = Math.floor(Math.random() * 5) + 1;
          await connection.query(
            'INSERT INTO ratings (user_id, store_id, rating) VALUES (?, ?, ?)',
            [user.id, store.id, rating]
          );
        }
      }
    }

    console.log('Successfully added 5 NORMAL and 5 OWNER users!');
    console.log('Each owner has 1 store, and normal users have submitted random ratings.');
    console.log('All dummy users have the password: User@123');

  } catch (err) {
    console.error('Seeding failed:', err);
  } finally {
    connection.release();
    await pool.end();
  }
}

seed();

require('dotenv').config();
const bcrypt = require('bcrypt');
const pool = require('../src/config/db');

async function seed() {
  const connection = await pool.getConnection();
  try {
    const hashedPassword = await bcrypt.hash('User@1234', 10); // Added digit for extra safety with 'special char + uppercase + number'

    // Need names to be at least 20 characters to match the validator rules naturally!
    const normalNames = [
      "Michael Anderson Thompson",
      "Jennifer Elizabeth Carter",
      "Robert Patrick Williams",
      "Amanda Marie Rodriguez",
      "Christopher David Johnson",
      "Jessica Lauren Mitchell",
      "Daniel Benjamin Phillips",
      "Rachel Catherine Morgan",
      "Matthew Nicholas Bennett",
      "Stephanie Olivia Richards",
      "Andrew Jonathan Sullivan"
    ];

    const ownerNames = [
      "William Alexander Peterson",
      "Katherine Louise Hamilton",
      "Nathaniel Edward Griffin",
      "Victoria Isabelle Hudson",
      "Theodore Franklin Hartley",
      "Samantha Grace Fletcher",
      "Jonathan Richard Caldwell",
      "Elizabeth Rose Harrington",
      "Benjamin Thomas Whitaker",
      "Charlotte Diana Lancaster",
      "Patrick Lawrence Donovan"
    ];

    const normalUsers = normalNames.map((name, i) => ({
      name,
      email: `user${i + 1}_${name.split(' ')[0].toLowerCase()}@gmail.com`,
      address: `${1200 + i} Oak Street, Apt ${101 + i}, Springfield, IL 6270${i}`,
      role: 'NORMAL'
    }));

    const ownerUsers = ownerNames.map((name, i) => ({
      name,
      email: `owner${i + 1}_${name.split(' ')[0].toLowerCase()}@business.com`,
      address: `${500 + i} Maple Avenue, Suite ${12 + i}, Austin, TX 7870${i}`,
      role: 'OWNER'
    }));

    const storeNames = [
      "Downtown Grocery Market Store",
      "Central Avenue Super Market",
      "Westside Electronics And Mobile",
      "Riverside Medical Pharmacy Shop",
      "Main Street Hardware And Paints",
      "Lakeside Clothing And Apparel",
      "Sunshine Sweets And Snack Shop",
      "Northside Dairy And Bakery Co",
      "Harbor Stationery And Gift Shop",
      "Mountain View General Provisions",
      "Garden District Trading Company"
    ];

    const [existing] = await connection.query('SELECT id FROM users WHERE role IN ("NORMAL", "OWNER") LIMIT 1');
    if (existing.length > 0) {
      console.log('Clearing existing normal/owner users, stores, and ratings for a fresh seed...');
      await connection.query('DELETE FROM ratings');
      await connection.query('DELETE FROM stores');
      await connection.query('DELETE FROM users WHERE role IN ("NORMAL", "OWNER")');
    }

    console.log(`Inserting ${normalUsers.length} Normal users...`);
    for (const u of normalUsers) {
      await connection.query(
        'INSERT INTO users (name, email, password, address, role) VALUES (?, ?, ?, ?, ?)',
        [u.name, u.email, hashedPassword, u.address, u.role]
      );
    }

    console.log(`Inserting ${ownerUsers.length} Owner users...`);
    for (const u of ownerUsers) {
      await connection.query(
        'INSERT INTO users (name, email, password, address, role) VALUES (?, ?, ?, ?, ?)',
        [u.name, u.email, hashedPassword, u.address, u.role]
      );
    }

    const [owners] = await connection.query('SELECT id, name FROM users WHERE role = "OWNER" ORDER BY id ASC');
    
    console.log(`Inserting ${storeNames.length} Stores...`);
    for (let i = 0; i < owners.length; i++) {
      const owner = owners[i];
      const storeName = storeNames[i];
      await connection.query(
        'INSERT INTO stores (name, email, address, owner_id) VALUES (?, ?, ?, ?)',
        [storeName, `contact@${storeName.replace(/[^a-zA-Z0-9]/g, '').toLowerCase()}.com`, `Shop No ${i + 1}, Main Road, Central Market, City Center`, owner.id]
      );
    }

    console.log('Inserting highly realistic human-like ratings...');
    const [normals] = await connection.query('SELECT id FROM users WHERE role = "NORMAL" ORDER BY id ASC');
    const [stores] = await connection.query('SELECT id FROM stores ORDER BY id ASC');

    // Make it look natural: some stores have 5 stars, some have 3 or 4, some have 1
    // Not everyone rates everything.
    for (const user of normals) {
      for (const store of stores) {
        if (Math.random() > 0.4) { // 60% chance to rate a store
          
          // Add a slight bias so the ratings are clustered naturally (e.g. 4s and 5s are more common)
          let rating = 4;
          const rand = Math.random();
          if (rand < 0.1) rating = 1;
          else if (rand < 0.2) rating = 2;
          else if (rand < 0.4) rating = 3;
          else if (rand < 0.7) rating = 4;
          else rating = 5;

          await connection.query(
            'INSERT INTO ratings (user_id, store_id, rating) VALUES (?, ?, ?)',
            [user.id, store.id, rating]
          );
        }
      }
    }

    console.log(`Successfully added ${normalUsers.length} NORMAL and ${ownerUsers.length} OWNER users!`);
    console.log('Each owner has 1 store, and normal users have submitted natural-looking ratings.');
    console.log('All dummy users have the password: User@1234');

  } catch (err) {
    console.error('Seeding failed:', err);
  } finally {
    connection.release();
    await pool.end();
  }
}

seed();

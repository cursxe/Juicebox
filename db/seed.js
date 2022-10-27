const {client, getAllUsers,createUser } = require('./index');

async function createInitialUsers() {
    try {
        console.log("Beginning to create users..");

        await createUser({username: "albert", password: "bertie99", name: "albert", location: USA});
        await createUser({username: "albert2", password: "imposteralbert", name: "albert", location:"Canada"});

        console.log("Finished creating users");
    }   catch(error) {
        console.error("Error creatign users");
        throw error;
    }
}

async function testDB() {
    try {
      console.log("Starting to test database...");
  
      const users = await getAllUsers();
      console.log("getAllUsers:", users);
  
      console.log("Finished database tests!");
    } catch (error) {
      console.error("Error testing database!");
      throw error;
    }
  }

async function dropTables() {
    try {
        await client.query(`
        DROP TABLE IF EXISTS users;
        `);
    } catch (error) {
        throw error;
    }
}


async function rebuildDB() {
    try {
      client.connect();
  
      await dropTables();
      await createTables();
      await createInitialUsers();
    } catch (error) {
      throw error;
    }
  }
  

async function createTables() {
    try {
        await client.query(`
        CREATE TABLE users (
            id SERIAL PRIMARY KEY,
            username varchar(255) UNIQUE NOT NULL,
            password varchar(255) NOT NULL
            );
        )`)
    } catch (error) {
        throw error;
    }
}


rebuildDB()
.then(testDB)
.catch(console.error)
.finally(() => client.end());
const {client, getAllUsers,createUser } = require('./index');

async function createInitialPosts() {
  try {
    const [albert, sandra, glamgal] = await getAllUsers();

    console.log("Starting to create posts...");
    await createPost({
    authorId: albert.id,
    title: "First Post",
    content: "This is my first post. I hope I love writing blogs as much as I love writing them.",
      tags: ["#happy", "#youcandoanything"]
    });

    await createPost({
    authorId: sandra.id,
    title: "How does this work?",
    content: "Seriously, does this even do anything?",
    tags: ["#happy", "#worst-day-ever"]
    });

    await createPost({
    authorId: glamgal.id,
    title: "Living the Glam Life",
    content: "Do you even? I swear that half of you are posing.",
    tags: ["#happy", "#youcandoanything", "#canmandoeverything"]
    });
    console.log("Finished creating posts!");
  } catch (error) {
    console.log("Error creating posts!");
    throw error;
  }
}


async function createInitialUsers() {
    try {
        console.log("Beginning to create users..");

        await createUser({username: "albert", password: "bertie99", name: "albert", location: "USA"});
        await createUser({username: "albert2", password: "imposteralbert", name: "albert", location:"Canada"});

        console.log("Finished creating users");
    }   catch(error) {
        console.error("Error creating users");
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
        DROP TABLE IF EXISTS post_tags;
        DROP TABLE  IF EXISTS tags;
        DROP TABLE IF EXISTS posts;
        DROP TABLE IF EXISTS users;
        `);
    } catch (error) {
        throw error;
    }
}

async function createInitialTags() {
  try {
    console.log("Starting to create tags...");

    const [happy, sad, inspo, catman] = await createTags([
      '#happy', 
      '#worst-day-ever', 
      '#youcandoanything',
      '#catmandoeverything'
    ]);

    const [postOne, postTwo, postThree] = await getAllPosts();

    await addTagsToPost(postOne.id, [happy, inspo]);
    await addTagsToPost(postTwo.id, [sad, inspo]);
    await addTagsToPost(postThree.id, [happy, catman, inspo]);

    console.log("Finished creating tags!");
  } catch (error) {
    console.log("Error creating tags!");
    throw error;
  }
}

async function rebuildDB() {
  try {
    client.connect();

    await dropTables();
    await createTables();
    await createInitialUsers();
    await createInitialPosts();
    await createInitialTags();
  } catch (error) {
    console.log("Error during rebuildDB")
    throw error;
  }
}

async function createTables() {
    try {
        await client.query(`
        CREATE TABLE users (
            id SERIAL PRIMARY KEY,
            username varchar(255) UNIQUE NOT NULL,
            password varchar(255) NOT NULL,
            name VARCHAR(255) NOT NULL,
            location VARCHAR(255) NOT NULL,
            active BOOLEAN DEFAULT true
            );
        `)
    } catch (error) {
        throw error;
    }
    try {
      await client.query(`
      CREATE TABLE posts (
      id SERIAL PRIMARY KEY,
      "authorId" INTEGER REFERENCES users(id) NOT NULL,
      title VARCHAR(255) NOT NULL,
      content TEXT NOT NULL,
      active BOOLEAN DEFAULT true
      )
      `)
    } catch (error) {
      throw error;
    }
    try {
      await client.query(`
      CREATE TABLE tags (
        id SERIAL PRIMARY KEY,
        name varchar(255) UNIQUE NOT NULL
      )
      `)
    } catch (error) {
      throw error;
    }
    try {
      await client.query(`
      CREATE TABLE post_tags (
        "postId" INTEGER REFERENCES posts(id),
        "tagId" INTEGER REFERENCES tags(id),
        UNIQUE ("postId", "tagId")
      );
      `);
    } catch (error) {
      throw error;
    }
    }



async function updateUser(id, fields = {} ) {

  const setString= Object.keys(fields).map((key,index) => `${ key }=$${ index + 1 }`).join(',');

  if (setString.length === 0) {
    return;
  }
  try {
    const result = await client.query(`
    UPDATE users
    set ${ setString }
    WHERE id=${ id }
    RETURNING *;
    `, Object.values(fields));
    
    return result;
  } catch (error) {
    throw error;
  }
}

rebuildDB()
.then(testDB)
.catch(console.error)
.finally(() => client.end());
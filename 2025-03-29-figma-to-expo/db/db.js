import * as SQLite from 'expo-sqlite';

let dbPromise = SQLite.openDatabaseAsync('example.db');


//This function creates all the tables
//It also populates with testing data for now
export async function initDB() {
    const db = await dbPromise;
    //I cannot figure out how to reset tables on physical iOS, so just dropping them here
    console.log(`tables are being dropped for testing purposes`)
    await db.execAsync(`DROP TABLE IF EXISTS exercises`);
  
    // We create all tables here? Is that a good idea?
    //all tables should be created in this one statement?
    // CURRENT_TIMESTAMP, '2025-01-01 00:00:00'
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS exercises (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      description TEXT NOT NULL,
      video BLOB NOT NULL,
      difficulty INTEGER NOT NULL,
      Timestamp DATETIME DEFAULT '2025-01-01 00:00:00');
    `);

    //if empty populate with dummy data
    const count = await db.getFirstAsync(`SELECT COUNT(*) as count FROM exercises;`);
    if (count.count ===0){
      await db.execAsync(`
      INSERT INTO exercises (name, description, video, difficulty) VALUES ('easy1', 'easy desc 1', 123, 0);
      INSERT INTO exercises (name, description, video, difficulty) VALUES ('easy2','easy desc 2', 123, 0);
      INSERT INTO exercises (name, description, video, difficulty) VALUES ('easy3','easy desc 3', 123, 0);
      INSERT INTO exercises (name, description, video, difficulty) VALUES ('medium1', 'medium desc 1', 123, 1);
      INSERT INTO exercises (name, description, video, difficulty) VALUES ('medium2', 'medium desc 2', 123, 1);
      INSERT INTO exercises (name, description, video, difficulty) VALUES ('medium3', 'medium desc 3', 123, 1);
      INSERT INTO exercises (name, description, video, difficulty) VALUES ('hard1', 'hard desc 1', 123, 2);
      INSERT INTO exercises (name, description, video, difficulty) VALUES ('hard1', 'hard desc 2', 123, 2);
      INSERT INTO exercises (name, description, video, difficulty) VALUES ('hard1', 'hard desc 3', 123, 2);
      `);
      console.log('testing data added to exercises')
    };
    console.log()
};

//please add comments showing how the output is structured
export async function getExercises(difficulty){
  //check if valid input
  console.log(`PLEASE ADD A CHECK IF FOR THIS INPUT IS VALID!`)
  const db = await dbPromise;
  const selectStatement=`
  SELECT * FROM exercises WHERE difficulty = ?;
  `;
  
  const result = await db.getAllAsync(selectStatement, difficulty);
  console.log(`the result:${result}`);
  for (const row of result) {
    console.log(row.description, row.difficulty, row.video);
  };
  
  return result
};
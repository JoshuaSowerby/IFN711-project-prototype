import * as SQLite from 'expo-sqlite';

let dbPromise = SQLite.openDatabaseAsync('example.db');
/*
SYNCING
- SQLite tables will have 1 extra column, mongo_id this will be the mongoDB tables _id,
  this will signify if it has been synced. If it is null then it hasn't been synced. On sync we get this id so we know it has been
- should I have a timestamp for things that may need updating?
  like exercise list, instructions may need updating but things
  like exercise history wont.
  OR
- SQLite has 2 extra columns, mongo_id and synced, synced is t/f and is what is used for telling if synced, mongo_id is
  what we use to find its mongo equivalent

SQLite -> MongoDB
- for a table send all entries where synced is false or mongo_id is null to MongoDB via API, recieve a list of mongo_id's
  in same order as sent. Update SQLite with these id's

MongoDB -> SQLite
- for a table compare SQLite mongo_id's to _id's in MongoDB,
  MongoDB sends A-B where A is the set of MongoDB _id's and B is the set of SQLite mongo_id's
- SQLite sends set of mongo_id's, MongoDB server does the calculation and sends result of A-B

EXCEPTIONS
...
*/

//This function creates all the tables
//It also populates with testing data for now
export async function initDB() {
    const db = await dbPromise;
    //I cannot figure out how to reset tables on physical iOS, so just dropping them here
    console.log(`tables are being dropped for testing purposes`)
    await db.execAsync(`DROP TABLE IF EXISTS exercises`);
  
    // We create all tables here? Is that a good idea?
    //all tables should be created in this one statement? No split out for readability
    // CURRENT_TIMESTAMP, '2025-01-01 00:00:00'
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS exercises (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      description TEXT NOT NULL,
      video BLOB NOT NULL,
      difficulty INTEGER NOT NULL,
      Timestamp DATETIME DEFAULT CURRENT_TIMESTAMP);
    `);

    //CREATE scoreHistory table
    await db.execAsync(`
    CREATE TABLE IF NOT EXISTS scoreHistory (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    score REAL,
    Timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
    mongoDB_id TEXT,
    synced BOOLEAN DEFAULT 0);
    `);

    //if empty populate with dummy data
    const count = await db.getFirstAsync(`SELECT COUNT(*) as count FROM exercises;`);
    if (count.count ===0){
      await db.execAsync(`
      INSERT INTO exercises (name, description, video, difficulty, Timestamp) VALUES ('easy1', 'easy desc 1', 123, 0, '2025-01-01 00:00:00');
      INSERT INTO exercises (name, description, video, difficulty, Timestamp) VALUES ('easy2', 'easy desc 2', 123, 0, '2025-01-01 00:00:00');
      INSERT INTO exercises (name, description, video, difficulty, Timestamp) VALUES ('easy3', 'easy desc 3', 123, 0, '2025-01-01 00:00:00');
      INSERT INTO exercises (name, description, video, difficulty, Timestamp) VALUES ('medium1', 'medium desc 1', 123, 1, '2025-01-01 00:00:00');
      INSERT INTO exercises (name, description, video, difficulty, Timestamp) VALUES ('medium2', 'medium desc 2', 123, 1, '2025-01-01 00:00:00');
      INSERT INTO exercises (name, description, video, difficulty, Timestamp) VALUES ('medium3', 'medium desc 3', 123, 1, '2025-01-01 00:00:00');
      INSERT INTO exercises (name, description, video, difficulty, Timestamp) VALUES ('hard1', 'hard desc 1', 123, 2, '2025-01-01 00:00:00');
      INSERT INTO exercises (name, description, video, difficulty, Timestamp) VALUES ('hard1', 'hard desc 2', 123, 2, '2025-01-01 00:00:00');
      INSERT INTO exercises (name, description, video, difficulty, Timestamp) VALUES ('hard1', 'hard desc 3', 123, 2, '2025-01-01 00:00:00');
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

//should make more generic insert, this is just for scoreHistories
export async function insertNewScore(data) {
  const db = await dbPromise;

  const insertStatement = `
  INSERT INTO scoreHistory (score)
  VALUES (?)
  `;

  const { score } = data;

  await db.runAsync(insertStatement, [score]);
};

//Should make this more generic, for now just gets last socre in scoreHistory
export async function getLastScore(){
  const db = await dbPromise;
  const lastScore = await db.getFirstAsync(`
      SELECT * FROM scoreHistory
      ORDER BY Timestamp DESC
      LIMIT 1;
      `);
  return lastScore;
};

export async function getScoreHistory() {
  const db = await dbPromise;
  const allRows = await db.getAllAsync('SELECT * FROM scoreHistory ORDER BY Timestamp DESC');
  return allRows;
}

//should make tis more generic, but for now it is for logging all scores from scoreHistory
export async function logScores(){
  const db = await dbPromise;
  const allRows = await db.getAllAsync('SELECT * FROM scoreHistory');
  for (const row of allRows) {
      console.log(row.id, row.score, row.Timestamp);
  };
};
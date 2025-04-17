import * as SQLite from 'expo-sqlite';


// Create a shared async function to open the DB
let dbPromise = SQLite.openDatabaseAsync('example.db');

export async function initDB() {
  const db = await dbPromise;

  // We create all tables here? Is that a good idea?
  //all tables should be created in this one statement?
  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS scoreHistory (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    score REAL,
    Timestamp DATETIME DEFAULT CURRENT_TIMESTAMP);
    `);
};

export async function insertNewScore(data) {
    const db = await dbPromise;
  
    const insertStatement = `
    INSERT INTO scoreHistory (score)
    VALUES (?)
    `;
  
    const { score } = data;
  
    await db.runAsync(insertStatement, [score]);
};

export async function getLastScore(){
    const db = await dbPromise;
    const lastScore = await db.getFirstAsync(`
        SELECT * FROM scoreHistory
        ORDER BY Timestamp DESC
        LIMIT 1;
        `);
    return lastScore;
};

export async function logScores(){
    const db = await dbPromise;
    const allRows = await db.getAllAsync('SELECT * FROM scoreHistory');
    for (const row of allRows) {
        console.log(row.id, row.score, row.Timestamp);
    };
};
//incomplete notes
//how all these things should look:
/*
const db = await dbPromise;
const insertStatement = `
INSERT INTO scoreHistory (a,b,c,d)
VALUES (?,?,?,?)
`;

const { a,b,c,d } = data;

await db.runAsync(insertStatement, [a,b,c,d]);

//get
const db = await dbPromise;
const result = await db.???
return result
*/
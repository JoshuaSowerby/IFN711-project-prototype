//should make more generic insert, this is just for scoreHistories
import { dbPromise } from "./db";

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
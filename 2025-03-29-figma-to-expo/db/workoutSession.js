// tablename ='workoutSession';
//   await db.execAsync(`
//     CREATE TABLE IF NOT EXISTS ${tablename} (
//     id INTEGER PRIMARY KEY AUTOINCREMENT,
//     exerciseId TEXT,
//     difficulty TEXT,
//     startTime DATETIME,
//     endTime DATETIME,
//     totalReps INTEGER,
//     totalScore REAL,
//     synced INTEGER DEFAULT 0,
//     mongo_id TEXT,
//     lastUpdated DATETIME DEFAULT '2000-01-01 00:00:00');
//   `);

//   //CREATE scoreHistory table
//   await db.execAsync(`
//   CREATE TABLE IF NOT EXISTS scoreHistory (
//   id INTEGER PRIMARY KEY AUTOINCREMENT,
//   score REAL,
//   Timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
//   mongoDB_id TEXT,
//   synced INTEGER DEFAULT 0);
//   `);
import { dbPromise } from "./db";

export async function insertNewWorkoutSession(data) {
  const db = await dbPromise;

  const insertStatement = `
  INSERT INTO workoutSession (
  name,
  difficulty,
  startTime,
  endTime, 
  totalReps,
  totalScore,
  synced,
  lastUpdated)
  VALUES ( ?, ?, ?, CURRENT_TIMESTAMP, ?, ?, 0, CURRENT_TIMESTAMP);
  `;

  const { name, difficulty, startTime, totalReps, totalScore } = data;

  await db.runAsync(insertStatement, [name, difficulty, startTime, totalReps, totalScore]);
};

//Should make this more generic, for now just gets last score in scoreHistory
export async function getLastScore(){
  const db = await dbPromise;
  const lastScore = await db.getFirstAsync(`
      SELECT * FROM workoutSession
      ORDER BY endTime DESC
      LIMIT 1;
      `);
  return lastScore;
};

export async function getWorkoutSessionHistory() {
  const db = await dbPromise;
  const allRows = await db.getAllAsync('SELECT * FROM workoutSession ORDER BY endTime DESC');
  return allRows;
};

export function formatInsertWorkoutSession(item){
  return {statement:`
          INSERT INTO workoutSession (
          name,
          difficulty,
          startTime,
          endTime,
          totalReps,
          totalScore,
          synced,
          mongo_id,
          lastUpdated) VALUES (?,?,?,?,?,?,?,?,?)
          `,
          vars:[ item.exerciseId,
            item.difficulty,
            item.startTime,
            item.endTime,
            item.totalReps,
            item.totalScore,
            1,
            item._id,
            new Date().toISOString() ]};
};
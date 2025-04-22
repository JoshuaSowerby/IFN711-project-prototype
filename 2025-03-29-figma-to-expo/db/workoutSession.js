
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
  VALUES ( ?, ?, ?, ?, ?, ?, 0, ?);
  `;

  const { name, difficulty, startTime, totalReps, totalScore } = data;

  await db.runAsync(insertStatement, [name, difficulty, startTime, new Date().toISOString(), totalReps, totalScore, new Date().toISOString()]);
  //get last totalScore, add this to it, assume there is always one score (I will init with 0 if there are none in initDBs)
  const lastScore = await db.getFirstAsync(`SELECT totalScore, lastDecay FROM totalScoreHistory ORDER BY lastUpdated DESC;`);
  await db.runAsync(`
    INSERT INTO totalScoreHistory (
    totalScore,
    lastDecay,
    lastUpdated)
    VALUES (?, ?, ?);`,
    [ lastScore.totalScore+totalScore,
      lastScore.lastDecay,
      new Date().toISOString()]);
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
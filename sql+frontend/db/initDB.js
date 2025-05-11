import { dbPromise } from './dbPromise';
import { initExercises } from './exercises';
import { insertScoreHistory } from './scoreHistory';

export const initDB = async ()=>{
    /**
     * for any DATETIME, set usng new Date().toISOString() to ensure consistency with mongo
     */



    const db = await dbPromise;
    let tablename;


    // await db.execAsync(`DROP TABLE IF EXISTS profile;`);
    // await db.execAsync(`DROP TABLE IF EXISTS exercises;`);
    // await db.execAsync(`DROP TABLE IF EXISTS exerciseHistory;`);
    // await db.execAsync(`DROP TABLE IF EXISTS scoreHistory;`);


    tablename='profile';
    await db.execAsync(`
        CREATE TABLE IF NOT EXISTS ${tablename} (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT,
        imageUrl TEXT);
    `);

    //more fields may be needed later
    tablename= 'exercises'
    await db.execAsync(`
        CREATE TABLE IF NOT EXISTS ${tablename} (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        exerciseName TEXT,
        description TEXT,
        instructions TEXT,
        difficulty TEXT);
    `);
    var count = await db.getFirstAsync(`SELECT COUNT(*) as count FROM ${tablename};`);
    if (count.count ===0){ await initExercises()};

    tablename= 'exerciseHistory'
    await db.execAsync(`
        CREATE TABLE IF NOT EXISTS ${tablename} (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        exerciseName TEXT,
        score REAL,
        timestamp DATETIME);
    `);

    tablename= 'scoreHistory'
    await db.execAsync(`
        CREATE TABLE IF NOT EXISTS ${tablename} (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        score REAL,
        timestamp DATETIME,
        lastDecay DATETIME);
    `);
    var count = await db.getFirstAsync(`SELECT COUNT(*) as count FROM ${tablename};`);
    if (count.count ===0){ await insertScoreHistory(0)};
    
    

}
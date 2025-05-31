import { dbPromise } from './dbPromise';
import { initExercises } from './exercises';
import { insertScoreHistory } from './scoreHistory';

export const initDB = async ()=>{
    /**
     * for any DATETIME, set usng new Date().toISOString() to ensure consistency with mongo
     */

    const db = await dbPromise;
    
    // uncomment to clear tables on load
    // await db.execAsync(`DROP TABLE IF EXISTS profile;`);
    // await db.execAsync(`DROP TABLE IF EXISTS exercises;`);
    // await db.execAsync(`DROP TABLE IF EXISTS exerciseHistory;`);
    // await db.execAsync(`DROP TABLE IF EXISTS scoreHistory;`);
    
    let tablename;
    await db.execAsync('PRAGMA foreign_keys = ON;');
    tablename='profile';
    await db.execAsync(`
        CREATE TABLE IF NOT EXISTS ${tablename} (
        id TEXT PRIMARY KEY,
        username TEXT);
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
        duration REAL,
        timestamp DATETIME,
        user_id TEXT,
        FOREIGN KEY (user_id) REFERENCES profile(id) ON DELETE CASCADE
        );
    `);

    tablename= 'scoreHistory'
    await db.execAsync(`
        CREATE TABLE IF NOT EXISTS ${tablename} (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        score REAL,
        timestamp DATETIME,
        lastDecay DATETIME,
        user_id TEXT,
        FOREIGN KEY (user_id) REFERENCES profile(id) ON DELETE CASCADE
        );
    `);
    // var count = await db.getFirstAsync(`SELECT COUNT(*) as count FROM ${tablename};`);
    // if (count.count ===0){ await insertScoreHistory(0)};
    
}
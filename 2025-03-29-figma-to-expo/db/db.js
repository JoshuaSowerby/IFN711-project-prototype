import * as SQLite from 'expo-sqlite';
import { makeReq } from '../api/makeReq';
import { timeNow } from '../utils/timeNow';

export const dbPromise = SQLite.openDatabaseAsync('example.db');
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
  console.log(`PLEASE add proper handling of JWT`)
  const db = await dbPromise;
  //I cannot figure out how to reset tables on physical iOS, so just dropping them here
  
  //INDEXING
  //await db.execAsync(`CREATE INDEX IF NOT EXISTS idx_username ON ${profile}(username);`);
  //Just an example, we shouldnt index that but we should index score histories


  /*//Profile
    const profileSchema = new mongoose.Schema({
      userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
      username: { type: String, required: true },
      bio: { type: String, default: "" },
      age: { type: Number, default: null },
      imageUrl: { type: String, default: "" }
    }, { timestamps: true });
  */

  //Should only ever have one row
  //We are only going to sync rows, not individual columns, so if we change imgUrl to a blob we should move it to another table
  //by default this is not synced and has never been updated
  //consider using template for table names for easy change
  let count;
  let tablename;

  tablename='profile';
  console.log(`DROPPING ${tablename}`)
  await db.execAsync(`DROP TABLE IF EXISTS ${tablename};`);

  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS ${tablename} (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT,
    bio TEXT,
    age INTEGER
    imageUrl TEXT,
    synced INTEGER DEFAULT 0,
    mongo_id TEXT,
    lastUpdated DATETIME DEFAULT '2000-01-01 00:00:00');
  `);
  count = await db.getFirstAsync(`SELECT COUNT(*) as count FROM ${tablename};`);
  if (count.count ===0){
    console.log(`${tablename} is empty`);
    //get from mongoDB
    //if guest ignore
  };
  
  /*//SensorEvent
  // don't think this is needed, review later
  const sensorEventSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    username: String, 
    exerciseId: String,
    motion: {
      left: Number,
      middle: Number,
      right: Number,
      leftStretch: Number,
      rightStretch: Number
    },
    totalMotion: Number,
    isRep: Boolean,
    timestamp: { type: Date, default: Date.now }
  });
  */

  /*//User
  // I would split non auth fields into profile? maybe not
  const userSchema = new mongoose.Schema({
    username: String,
    email: { type: String, unique: true },
    password: String,
    gravityScore: { type: Number, default: 0 },     // score for current session/day
    bestScore: { type: Number, default: 0 },        // highest score ever achieved
    streak: { type: Number, default: 0 },           // consecutive days with activity
    lastActiveDate: { type: Date, default: null },    // track activity date for streak
    favorites: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Workout' }]
  });
  */
  //should only ever have one row
  ///!!!Install SecureStore for the JWT
  //favorites needs to be its own table
  tablename ='user';
  console.log(`DROPPING ${tablename}`)
  await db.execAsync(`DROP TABLE IF EXISTS ${tablename};`);

  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS ${tablename} (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    gravityScore REAL,
    bestScore REAL,
    streak INTEGER
    imageUrl TEXT,
    lastActiveDate DATETIME DEFAULT CURRENT_TIMESTAMP,
    synced INTEGER DEFAULT 0,
    mongo_id TEXT,
    lastUpdated DATETIME DEFAULT '2000-01-01 00:00:00');
  `);
  count = await db.getFirstAsync(`SELECT COUNT(*) as count FROM ${tablename};`);
  if (count.count ===0){
    console.log(`${tablename} is empty`);
    //makeReq('GET','')
    //get from mongoDB
    //if guest ignore
  };

  /*//Workout
  const workoutSchema = new mongoose.Schema({
    name: { type: String, required: true },
    difficulty: { type: String, enum: ['easy', 'medium', 'hard'], required: true },
    description: { type: String, default: '' },
    muscleGroup: { type: String, default: '' }
  });
  */

  tablename ='workout';
  console.log(`DROPPING ${tablename}`)
  await db.execAsync(`DROP TABLE IF EXISTS ${tablename};`);
  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS ${tablename} (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    difficulty TEXT,
    description TEXT,
    muscleGroup TEXT,
    synced INTEGER DEFAULT 0,
    mongo_id TEXT,
    lastUpdated DATETIME DEFAULT '2000-01-01 00:00:00'
    );
  `);
  count = await db.getFirstAsync(`SELECT COUNT(*) as count FROM ${tablename};`);
  if (count.count ===0){
    try {
      console.log(`${tablename} is empty`);
      console.log('API subject to change');
      
      const workoutToAdd = await makeReq('GET','workout/workouts' );
      // console.log(workoutToAdd);
      await db.execAsync(`BEGIN TRANSACTION`);
      for (const item of workoutToAdd){
        // console.log(item.difficulty);
        await db.runAsync(`
          INSERT INTO workout (
          name,
          difficulty,
          description,
          muscleGroup,
          synced,
          mongo_id,
          lastUpdated) VALUES (?,?,?,?,?,?,?)
          `,
          [ item.name,
            item.difficulty,
            item.description,
            item.muscleGroup,
            1,
            item._id,
            timeNow() ]
        );
      };
      await db.execAsync('COMMIT');
      console.log(`workout insert success`);
      //await getWorkouts();
    } catch (error) {
      await db.execAsync('ROLLBACK');
      console.log('error inserting', error);
    }
    
    //get from mongoDB
    //if guest ignore
  };

  /*//WorkoutSession//This is my scoreHistory
  const workoutSessionSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    exerciseId: String,
    difficulty: { type: String, enum: ['easy', 'medium', 'hard'], default: 'medium' }, 
    startTime: { type: Date, default: Date.now },
    endTime: Date,
    totalReps: { type: Number, default: 0 },
    totalScore: { type: Number, default: 0 }
  });
  */
  //exerciseId renamed to name to match workout
  tablename ='workoutSession';
  console.log(`DROPPING ${tablename}`)
  await db.execAsync(`DROP TABLE IF EXISTS ${tablename};`);
  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS ${tablename} (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    difficulty TEXT,
    startTime DATETIME,
    endTime DATETIME,
    totalReps INTEGER,
    totalScore REAL,
    synced INTEGER DEFAULT 0,
    mongo_id TEXT,
    lastUpdated DATETIME DEFAULT '2000-01-01 00:00:00');
  `);
  count = await db.getFirstAsync(`SELECT COUNT(*) as count FROM ${tablename};`);
  if (count.count ===0){
    console.log(`${tablename} is empty`);
    try {
      console.log(`${tablename} is empty`);
      console.log('API subject to change');
      
      const sessionsToAdd = await makeReq('GET', 'session');
      console.log('ADD CHECK IF EMPTY');
      await db.execAsync(`BEGIN TRANSACTION`);
      for (const item of sessionsToAdd){
        
        await db.runAsync(`
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
          [ item.exerciseId,
            item.difficulty,
            item.startTime,
            item.endTime,
            item.totalReps,
            item.totalScore,
            1,
            item._id,
            new timeNow() ]
        );
      };
      await db.execAsync('COMMIT');
      console.log(`${tablename} insert success`);
      //await getWorkouts();
    } catch (error) {
      await db.execAsync('ROLLBACK');
      console.log('error inserting', error);
    }

    
    //get from mongoDB, no direct get...
    //if guest ignore
  };

  /*//DIFFERENCES
    NOT PRESENT
      scoreHistory, or exerciseHistory : equivalent is workoutSessions but no direct get
      leaderboard
    DIFFERENT
      I have Auth, which holds login info, their user hs auth+settings and score...
      we could move some of that to their profile...
  */
};



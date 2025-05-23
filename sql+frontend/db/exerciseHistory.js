import {insertScoreHistory} from "./scoreHistory";
import { dbPromise} from "./dbPromise";
import * as SecureStore from 'expo-secure-store';

export const insertExerciseHistory = async (exerciseName, score, duration=1, timestamp=new Date().toISOString())=>{
    const db = await dbPromise;
    
    try {
        const email = await SecureStore.getItemAsync('email');
        await db.execAsync(`
            INSERT INTO exerciseHistory
            (user_id, exerciseName, score, duration, timestamp)
            VALUES (?, ?, ?, ?, ?);`,
            [email, exerciseName, score, duration, timestamp]);

        //inserts into scoreHistory, which sends to leaderboard. If this goes on forever, it is liekly a problem sending to mongo
        console.log('exerciseHistory insert success');
        await insertScoreHistory(score, timestamp);
    } catch (error) {
        console.error(error);
    };

};
export const getExerciseHistory = async ()=>{
    const db = await dbPromise;
    try {
        const email = await SecureStore.getItemAsync('email');
        const res = await db.getAllAsync(`
            SELECT * FROM exerciseHistory WHERE user_id=?;`,[email]);
        return res;
    } catch (error) {
        console.error(error);
    }
}
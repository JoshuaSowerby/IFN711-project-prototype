import {insertScoreHistory} from "./scoreHistory";
import { dbPromise} from "./dbPromise";

export const insertExerciseHistory = async (exerciseName, score, timestamp=new Date().toISOString())=>{
    const db = await dbPromise;
    
    try {
        await db.getAllAsync(`
            INSERT INTO exerciseHistory
            (exerciseName, score, timestamp)
            VALUES (?, ?, ?);`,
            [exerciseName, score, timestamp]);

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
        const res = await db.getAllAsync(`
            SELECT * FROM exerciseHistory;`);
        return res;
    } catch (error) {
        console.error(error);
    }

}
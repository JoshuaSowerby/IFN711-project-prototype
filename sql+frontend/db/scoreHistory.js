// import { postLeaderboard } from "../api/postLeaderboard";
import { postLeaderboard } from "../api/leaderboard";
import { dbPromise } from "./dbPromise";
import * as SecureStore from 'expo-secure-store';


export const insertScoreHistory = async (score, timestamp=new Date().toISOString(), isDecay=false)=>{
    const db = await dbPromise;
    lastScore = await getLatestScoreHistory()

    if (!lastScore){
        lastScore= {score:0, lastDecay:timestamp}
    }

    if (isDecay){
        lastDecay=timestamp;
    }else{
        lastDecay=lastScore.lastDecay;
    }
    score=Math.max(score+lastScore.score,0);
    try {
        const email = await SecureStore.getItemAsync('email');
        await db.runAsync(`
            INSERT INTO scoreHistory
            (user_id, score, lastDecay, timestamp)
            VALUES (?, ?, ?, ?);`,
            [email, score, lastDecay, timestamp]);
        console.log('scoreHistory insert success');
        //if logged in or if token exists and is not expired
        await postLeaderboard(score, timestamp);//this may not need to be await
    } catch (error) {
        console.error(error);
    };
};

export const getScoreHistory= async ()=>{
    const db = await dbPromise;
    try {
        const email = await SecureStore.getItemAsync('email');
        const res = await db.getAllAsync(`
            SELECT * FROM scoreHistory WHERE user_id=?;`,[email]);
        return res;
    } catch (error) {
        console.error(error);
    };
};

export const getLatestScoreHistory= async ()=>{
    const db = await dbPromise;

    try {
        const email = await SecureStore.getItemAsync('email');
        const latestScore = await db.getFirstAsync(`
            SELECT *
            FROM scoreHistory
            WHERE user_id=?
            ORDER BY timestamp DESC
            LIMIT 1;`,[email]);
        return latestScore;
    } catch (error) {
        console.error(error);
    }
};
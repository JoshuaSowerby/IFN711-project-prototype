// import { postLeaderboard } from "../api/postLeaderboard";
import { postLeaderboard } from "../api/leaderboard";
import { dbPromise } from "./dbPromise";

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
    score=score+lastScore.score;
    try {
        await db.runAsync(`
            INSERT INTO scoreHistory
            (score, lastDecay, timestamp)
            VALUES (?, ?, ?);`,
            [score, lastDecay, timestamp]);
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
        const res = await db.getAllAsync(`
            SELECT * FROM scoreHistory;`);
        return res;
    } catch (error) {
        console.error(error);
    };
};

export const getLatestScoreHistory= async ()=>{
    const db = await dbPromise;

    try {
        const latestScore = await db.getFirstAsync(`
            SELECT *
            FROM scoreHistory
            ORDER BY timestamp DESC
            LIMIT 1;`);
        return latestScore;
    } catch (error) {
        console.error(error);
    }
};

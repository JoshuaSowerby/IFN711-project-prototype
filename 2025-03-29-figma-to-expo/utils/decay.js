import { useEffect, useRef } from "react";
import { dbPromise } from "../db/db"
import { AppState } from "react-native";

export const applyDecay = async () =>{
    const db = await dbPromise;
    const lastScoreHistory = await db.getFirstAsync(`SELECT totalScore, lastDecay FROM totalScoreHistory ORDER BY lastUpdated DESC;`);
    //we are only going to look ad difference in days.
    const now = new Date();
    lastDecay= new Date(lastScoreHistory.lastDecay);
    lastDecay = new Date(lastDecay.getFullYear(), lastDecay.getMonth(), lastDecay.getDate());
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const oneDay = 86400000;
    numOfDecays=0;
    difference = today - lastDecay
    if (difference >=oneDay){
        //while the difference between dates is greater than or equal to one day, subtract one day from difference and add 1 to numOfDecays
        while (difference >=oneDay){
            numOfDecays++;
            difference-=oneDay;
        };

        console.log('PLESE ADD PROPER DECAY FUNC HERE')
        newScore=lastScoreHistory.totalScore-numOfDecays
        //insert decayed score
        await db.runAsync(`
            INSERT INTO totalScoreHistory (
            totalScore,
            lastDecay,
            lastUpdated)
            VALUES (?, ?, ?);`,
            [   newScore,
                today.toISOString(),
                new Date().toISOString()]);
    };
};

export const dailyDecay = (isDbReady) =>{
    const appState = useRef(AppState.currentState);
    useEffect(()=>{
        if(!isDbReady){return};
        applyDecay();//run on load

        /*if AppState event listener sees change, compare that state(nextAppState) to
         *appState, if it was cahgning from inactive/background to active, run applyDecay()
         */
        const subscription = AppState.addEventListener('change', nextAppState =>{
            if (
                appState.current.match(/inactive|background/) &&
                nextAppState === 'active'
            ){
                applyDecay();
            };
            appState.current=nextAppState;
        });
        return () => {subscription.remove()};
    }, []);
};
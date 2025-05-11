import { useEffect, useRef } from "react";
import { dbPromise } from "../db/dbPromise";
import { AppState } from "react-native";
import { getLatestScoreHistory, insertScoreHistory } from "../db/scoreHistory";



// it may make sense to check this when inserting any score instead...
export const applyDecay = async () =>{
    const db = await dbPromise;
    const latestScore = await getLatestScoreHistory();
    const now = new Date();
    lastDecay = new Date(latestScore.lastDecay);
    lastDecay = new Date(lastDecay.getFullYear(), lastDecay.getMonth(), lastDecay.getDate());
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    //const today = new Date()//to test this, comment out rounding to nearest day and use bsolute date then change the oneDay
    const oneDay = 86400000;
    numOfDecays=0;
    difference = today - lastDecay
    console.log(`decay: difference ${difference} >= oneDay ${oneDay}, ${difference >=oneDay}`)
    if (difference >=oneDay){
        //while the difference between dates is greater than or equal to one day, subtract one day from difference and add 1 to numOfDecays
        while (difference >=oneDay){
            numOfDecays++;
            difference-=oneDay;
        };

        console.log('ADD PROPER DECAY FUNC HERE')
        console.log(`${-1*numOfDecays}`)
        decayAmount=-1*numOfDecays
        //insert decayed score
        await insertScoreHistory(decayAmount, undefined , true);
    };
};

//have to name use so it uses hook rules
export const useDailyDecay = (isDbReady) =>{
    
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
    }, [isDbReady]);
};
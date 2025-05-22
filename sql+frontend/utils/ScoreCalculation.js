export const PointsChange= (leftBack, middleBack, rightBack, leftArm, rightArm, backMaxError, armMaxError, armGoal) =>{

    /* MaxError are maximum total error before you get no points
     * points are per sensor, linear relation to error, Max(1-error/maxerror,0)
     * The maximum amount of points you can score per check is 1, being 100% correct, minimum is 0
     * Total max is 5 as 5 sensors
     * The idea is that you are scored the percent off you are from perfect, 
     */
    deltaScore=0;

    //back sensors
    totalBack = leftBack + rightBack + middleBack;

    //the highest any of these can be is 1
    lBackRatio = leftBack/total;
    mBackRatio = middleBack/total;
    rBackRatio = rightBack/total;

    //1/3 is optimal ratio... too hard to understand?
    lBackError = Math.abs(lBackRatio-1/3);
    mBackError = Math.abs(mBackRatio-1/3);
    rBackError = Math.abs(rBackRatio-1/3);
    
    lBackScore= Math.max(1-lBackError/backMaxError,0)
    mBackScore= Math.max(1-mBackError/backMaxError,0)
    rBackScore= Math.max(1-rBackError/backMaxError,0)


    //arm sensors
    lArmError=Math.abs(leftArm-armGoal)
    rArmError=Math.abs(rightArm-armGoal)
    
    lArmScore= Math.max(1-lArmError/armMaxError,0)
    rArmScore= Math.max(1-rArmError/armMaxError,0)

    deltaScore= lBackScore+mBackScore+rBackScore+lArmScore+rArmScore;

    
    return deltaScore;
};

// or weighted average, would need to pass all changes in then
export const ScoreCalc =(points, time, difficulty)=>{
    /* This score is bad as it involves *time /time
     */
    difficultyModifier=0;
    switch(difficulty){
        case "easy":
            difficultyModifier=1;
            break;
        case "medium":
            difficulty=2;
        case "hard":
            difficulty=4;
    }
    const maxSinglePoint=5;
    formQuality = points/time/maxSinglePoint;

    score= (formQuality * difficultyModifier)*(time/60);
    //difficulty*(average for quality)
    return score;
}


/*
 * 
 */
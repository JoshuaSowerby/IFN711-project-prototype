import { dbPromise } from "./db";

//please add comments showing how the output is structured

export async function getWorkouts(difficulty){
    //check if valid input
    //should make input an object so we can do better queries
    console.log(`PLEASE ADD A CHECK IF FOR THIS INPUT IS VALID!`)
    const db = await dbPromise;
    const selectStatement=`
    SELECT * FROM workout WHERE difficulty = ?;
    `;
    
    const result = await db.getAllAsync(selectStatement, difficulty);
    console.log(`the result:${result}`);
    // for (const row of result) {
    //   console.log(row.description, row.difficulty, row.video);
    // };
    //if empty should probably check mongoDB
    return result
  };
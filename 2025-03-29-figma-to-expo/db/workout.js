import { dbPromise } from "./db";

//please add comments showing how the output is structured

export async function getWorkouts(difficulty){
    //check if valid input
    //should make input an object so we can do better queries
    console.log(`PLEASE ADD A CHECK IF FOR THIS INPUT IS VALID!`)
    const db = await dbPromise;
    let selectStatement;
    //let result;
    
    if (!difficulty){
      selectStatement=`
      SELECT * FROM workout;
      `;
    }else{
      selectStatement=`
      SELECT * FROM workout WHERE difficulty = ?;
      `;
    }
    //console.log(selectStatement, difficulty);
    try {
      const result = await db.getAllAsync(selectStatement, difficulty);
      //console.log(`the result:${result}`);
      return result;
    } catch (error) {
      console.error('Error querying workout:',error);
    }
    
  };

export function formatInsertWorkout(item){
  return {statement:`
    INSERT INTO workout (
    name,
    difficulty,
    description,
    muscleGroup,
    synced,
    mongo_id,
    lastUpdated) VALUES (?,?,?,?,?,?,?)
    `, vars:
    [ item.name,
      item.difficulty,
      item.description,
      item.muscleGroup,
      1,
      item._id,
      new Date().toISOString() ]};
};
import { dbPromise} from "./dbPromise";



export async function getExercises(difficulty='any'){

    const db = await dbPromise;
    let selectStatement;
    
    if (difficulty==="any"){
      selectStatement=`
      SELECT * FROM exercises;
      `;
    }else{
      selectStatement=`
      SELECT * FROM exercises WHERE difficulty = ?;
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


export const insertExercise = async (exerciseName, description, instructions, difficulty)=>{
    const db = await dbPromise;
    
    try {
        await db.runAsync(`
            INSERT INTO exercises
            (exerciseName, description, instructions, difficulty)
            VALUES (?,?,?,?);`,
        [exerciseName, description, instructions, difficulty]);
        
    } catch (error) {
        console.error(error);
    };
}


const exercisesToAdd = [
    {exerciseName:"Shoulder", description:"improves Posture and core stability", instructions:"Step 1\n Step 2\n Step 3\n", difficulty:"easy"},
    {exerciseName:"Slow Stretch", description:"improves Posture and core stability", instructions:"Step 1\n Step 2\n Step 3\n", difficulty:"easy"},
    {exerciseName:"Slow Stretch Each Arm", description:"improves Posture and core stability", instructions:"Step 1\n Step 2\n Step 3\n", difficulty:"easy"},
    {exerciseName:"Side To Side", description:"improves Posture and core stability", instructions:"Step 1\n Step 2\n Step 3\n", difficulty:"medium"},
    {exerciseName:"Slow Stretch", description:"improves Posture and core stability", instructions:"Step 1\n Step 2\n Step 3\n", difficulty:"medium"},
    {exerciseName:"Slow Stretch Each Arm", description:"improves Posture and core stability", instructions:"Step 1\n Step 2\n Step 3\n", difficulty:"medium"},
    {exerciseName:"Golf Swing No Arms", description:"improves Posture and core stability", instructions:"Step 1\n Step 2\n Step 3\n", difficulty:"hard"},
    {exerciseName:"Golf Swing Arms", description:"improves Posture and core stability", instructions:"Step 1\n Step 2\n Step 3\n", difficulty:"hard"},
    {exerciseName:"Slow Stretch Each Arm", description:"improves Posture and core stability", instructions:"Step 1\n Step 2\n Step 3\n", difficulty:"hard"},
]
export const initExercises = async ()=>{
    for (const item of exercisesToAdd){
        insertExercise(item.exerciseName, item.description,item.instructions,item.difficulty);
      };
}
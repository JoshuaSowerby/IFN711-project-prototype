import { makeReq } from "../api/makeReq";
import { dbPromise } from "./db";
import { formatInsertProfile } from "./profile";
import { formatInsertWorkout } from "./workout";
import { formatInsertWorkoutSession } from "./workoutSession";





const path=`2025-03-29-figma-to-expo/db/sync.js`


//untested
export const getFromMongoDB = async (tablename) => {
    const endpoint=`${process.env.EXPO_PUBLIC_API}sync/remote/${tablename}`
    const db = await dbPromise;
    const selectStatement=`
    SELECT mongo_id, lastUpdated FROM ${tablename};
    `;
    const syncedRows = await db.getAllAsync(selectStatement);
    console.log(`${path} please format syncedRows`);

    //make synced correct format
    // method, endpoint, body
    //This will return all rows that are not present in app using the mongo_id as a filter
    const result = await makeReq('POST', endpoint, syncedRows);
    console.log(`${path} add proper if result successful check`);
    if (result.ok){//if the result is valid and exists

        await db.execAsync(`BEGIN TRANSACTION`);
        if (tablename === 'Workout'){
            for (item of result){
                const query=formatInsertWorkout(item);
                await db.runAsync(query.statement,query.vars);
            };
        }else if (tablename === 'Profile'){
            for (item of result){
                const query=formatInsertProfile(item);
                await db.runAsync(query.statement,query.vars);
            };
        }else if (tablename === 'WorkoutSession'){
            for (item of result){
                const query=formatInsertWorkoutSession(item);
                await db.runAsync(query.statement,query.vars);
            };
        };
        await db.execAsync('COMMIT');
        console.log(`${tablename} insert success`);
        
    };
};

//untested
export const sendToMongoDB = async (tablename, columns) =>{
    // you have to specify the relevant columns
    const endpoint=`${process.env.EXPO_PUBLIC_API}sync/local/${tablename}`
    const db = await dbPromise;
    // this select statement probbly has some redundant columns...
    const selectStatement=`
    SELECT id, ${columns} FROM ${tablename}
    WHERE synced = 0;
    `;
    const localOnlyRows = await db.getAllAsync(selectStatement);
    console.log(`${path} please format localOnlyRows`);
    const result = await makeReq('POST', endpoint, localOnlyRows);
    //result = [ {id:SQLite id, mongo_id: MongoDB _id}, ... ]
    //The POST req will handle confliciting results using timestamps
    //if successful
    console.log(`${path} add proper if result successful check`);
    if (result.ok){
        for (item of result.mongo_ids){
            await db.runAsync(`UPDATE ${tablename} SET synced = ?, mongo_id= ? WHERE id = ?`, [1, item.mongo_id,item.id]);
        }
        console.log(result);
    };
}
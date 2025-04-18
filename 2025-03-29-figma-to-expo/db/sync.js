import { makeReq } from "../api/makeReq";
import { dbPromise } from "./db";


const path=`2025-03-29-figma-to-expo/db/sync.js`
//we could combine the functions to be one...
const getFromMongoDB = async () => {
    const db = await dbPromise;
    tablename;
    endpoint;
    const selectStatement=`
    SELECT mongo_id FROM ${tablename};
    `;
    const syncedRows = await db.getAllAsync(selectStatement);
    console.log(`${path} please format syncedRows`);

    //make synced correct format
    // method, endpoint, body
    //This will return all rows that are not present in app using the mongo_id as a filter
    const result = await makeReq('POST', endpoint, syncedRows);
    console.log(`${path} add proper if result successful check`);
    if (result){//if the result is valid and exists
        const insertStatement=`INSERT INTO ${tablename};`;//fix
        await db.execAsync(insertStatement)
    };
};

const sendToMongoDB = async () =>{
    const db = await dbPromise;
    tablename;
    endpoint;
    // this select statement probbly has some redundant columns...
    const selectStatement=`
    SELECT * FROM ${tablename}
    WHERE synced = 0;
    `;
    const localOnlyRows = await db.getAllAsync(selectStatement);
    console.log(`${path} please format localOnlyRows`);
    const result = await makeReq('POST', endpoint, localOnlyRows);
    //The POST req will handle confliciting results using timestamps
    //if successful
    console.log(`${path} add proper if result successful check`);
    if (result){
        //update synced to 1
    };
}
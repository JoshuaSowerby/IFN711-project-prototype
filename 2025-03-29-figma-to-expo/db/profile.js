import { timeNow } from "../utils/timeNow";

export function formatInsertProfile(item){
  return {statement:`
    INSERT INTO profile (
    username,
    bio,
    age,
    imageUrl,
    synced,
    mongo_id,
    lastUpdated) VALUES (?,?,?,?,?,?,?)
    `, vars:
    [   item.username,
        item.bio,
        item.age,
        item.imageUrl,
        1,
        item._id,
        new Date().toISOString() ]};
};
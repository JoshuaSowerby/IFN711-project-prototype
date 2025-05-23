import { dbPromise} from "./dbPromise";
import * as SecureStore from 'expo-secure-store';

export const ProfileReady=async()=>{
    db = await dbPromise;
    try {
        const email = await SecureStore.getItemAsync('email');
        const username = await SecureStore.getItemAsync('username');
        const result = await db.getFirstAsync(
            `SELECT 1 FROM profile WHERE id = ? LIMIT 1;`,
            [email]
        );
        const exists = !!result;
        if (exists){
            return true;
        }else{
            await db.runAsync(`
            INSERT INTO profile
            (id, username)
            VALUES (?,?);`,
        [email, username]);
            return true;
        }
    } catch (error) {
        return false;
    }
}
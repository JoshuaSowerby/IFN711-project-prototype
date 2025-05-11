import * as SecureStore from 'expo-secure-store';

const api="http://192.168.0.108:3000/api/";
//const token="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2ODBiMTkxZTA2ZjRkOWRhNDY3ZWZlZTAiLCJ1c2VybmFtZSI6IkIiLCJpYXQiOjE3NDU1NTc3OTAsImV4cCI6MTc0NjE2MjU5MH0.47AfITd1-lVFpDo-DeZl0-aNMDHzy8FIoNbF54TJNVk"

export const getLeaderboard = async ()=>{
    try{
        const req = {
            method:'GET'
        };
        res = await fetch(`${api}leaderboard`,req);
        if (!res.ok){
            console.warn('getLeaderboard not ok');
        };
        return await res.json();

    }catch(error){
        console.error(error);
    };
};


//this should occur on insert
export const postLeaderboard = async (score, lastUpdated)=>{
    try{
        const token = await SecureStore.getItemAsync('JWT');
        const req = {
            method:'POST',
            headers : {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                score:score,
                lastUpdated:lastUpdated
            })
        };
        res = await fetch(`${api}leaderboard`,req);
        if (!res.ok){
            console.warn('postLeaderboard not ok');
        };
        return await res.json();

    }catch(error){
        console.error(error);
    };
}
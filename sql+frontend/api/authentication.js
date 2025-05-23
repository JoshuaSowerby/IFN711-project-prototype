import * as SecureStore from 'expo-secure-store';
import { ProfileReady } from '../db/initProfile';

const api="http://192.168.0.108:3000/api/";

//register user
export const register = async (email, username, password) =>{
    //
    try {
        const req = {
            method:'POST',
            headers:{
                "Content-Type":"application/json",
            },
            body: JSON.stringify({
                username,
                email,
                password
            })
        };
        const res = await fetch(`${api}auth/register`,req);
        const data = await res.json();
        if (res.ok){
            console.log('register success');
            //store token
            await SecureStore.setItemAsync('JWT', String(data.token));
            await SecureStore.setItemAsync('username', String(data.username));
            await ProfileReady();
            return true;
        };
        
    } catch (error) {
        console.log(error);
    }
    
    

};

//login
export const login = async (email, password) =>{
    try {
        const req = {
            method:'POST',
            headers:{
                "Content-Type":"application/json",
            },
            body: JSON.stringify({
                email,
                password
            })
        };
        const res = await fetch(`${api}auth/login`,req);
        const data = await res.json();
        if (res.ok){
            console.log('login success');
            //store token
            await SecureStore.setItemAsync('JWT', String(data.token));
            await SecureStore.setItemAsync('username', String(data.username));
            await SecureStore.setItemAsync('email', email);
            //init user
            await ProfileReady();
            return true;
        };
    } catch (error) {
        console.log(error);
    }
    
};
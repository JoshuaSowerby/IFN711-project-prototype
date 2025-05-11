// import * as SecureStore from 'expo-secure-store';
// import jwtDecode from 'jwt-decode';

// export const isTokenExpired =async ()=>{
//     const token = await SecureStore.getItemAsync('JWT');
//     if(!token){
//         return true;
//     }
//     try {
//         const decodeToken = jwtDecode(token);
//         const currentTime = Math.floor(Date.now()/1000)

//         if (decodeToken.exp<currentTime){
//             return true;
//         }
//         return false;//else
//     } catch (error) {
//         console.error("error decoding token", error)
//         return true;
//     }
// }
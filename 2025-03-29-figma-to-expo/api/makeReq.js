//api and token should be stored securely somewhere
export const makeReq = async (method, endpoint, body) =>{
// const makeReq = async (method, endpoint, body) =>{
  console.log(`PLEASE FIX, use real JWT, 2025-03-29-figma-to-expo/api/makeReq.js`)
  try {
    const token=1;
    const url = `${process.env.EXPO_PUBLIC_API}${endpoint}`;
    console.log(`url: ${url}`);
    const options = {
      method,
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      //only add body if POST req
      body: method === 'POST' ? JSON.stringify(body) : undefined
    };
    const res = await fetch(url,options)
    return await res.json();
  } catch (error) {
    console.error(error);
  };
}

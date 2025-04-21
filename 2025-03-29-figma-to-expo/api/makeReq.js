
//api and token should be stored securely somewhere
export const makeReq = async (method, endpoint, body) =>{
  console.log(`PLEASE FIX, use real JWT, 2025-03-29-figma-to-expo/api/makeReq.js`)
  try {
    const token=process.env.EXPO_PUBLIC_TOKEN;
    console.log(`token: ${token}`);
    const url = `${process.env.EXPO_PUBLIC_API}${endpoint}`;
    console.log(`${method} url: "${url}"`);
    const options = {
      method,
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      //only add body if POST req
      body: method === 'POST' ? JSON.stringify(body) : undefined
    };
    const res = await fetch(url,options);
    if (!res.ok) {
      const errorText = await res.text();
      console.warn(`Error response: ${errorText}`);
      return null;
    }
    return await res.json();
  } catch (error) {
    console.error(error);
  };
}

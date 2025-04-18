
//api and token should be stored securely somewhere
export const makeReq = async (method, endpoint, body) =>{
  try {
    const url = api+endpoint;
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
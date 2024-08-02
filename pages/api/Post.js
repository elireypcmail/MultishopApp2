import instance from '@g/api'

async function loginUser(data) {
  console.log(data)
  try {
    const res = await instance.post(`/login/user`, data)
    console.log(res)
    return res
  } catch (err) { console.error(err) }
}

async function verifyToken (token) {
  try {
    const res = await instance.post('/verify-token', { authHeader: `Bearer ${token}` });
    return res;
  } catch (err) {
    console.error('Error al verificar token:', err);
    throw err;
  }
}

async function codeV(code) {
  try {
    const res = instance.post('/code', code)
    return res
  } catch (err) {
    console.error(err)
  }
}

export{
  loginUser,
  verifyToken,
  codeV
}
import instance from '@g/api'

export const loginUser = async (cliente) => {
  try {
    const response = await instance.post('/clients/login', cliente)
    const data = response.data
    return data
  } catch (error) {
    throw error
  }
}

export const verifyToken = async (token) => {
  try {
    const response = await instance.post('/clients/verify-token', {}, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    return response.data
  } catch (error) {
    console.error('Error en la verificación del token:', error)
    throw error
  }
}

export const getParametros = async () => {
  try {
    const response = await instance.get('/clients/parameters')
    // console.log(response);
    // console.log(response.status);
    // console.log(response.data)    
    return response.data
  } catch (error) {
    console.log(error)
    console.error('Error en la solicitud de login:', error)
    throw error
  }
}

export const generateToken = async (data) => {
  try {
    const response = await instance.post('/clients/generate-code', data)
    // console.log(response);
    // console.log(response.status);
    // console.log(response.data)    
    return response.data
  } catch (error) {
    console.log(error)
    console.error('Error en la solicitud del code:', error)
    throw error
  }
}

export const validateToken = async (data) => {
  try {
    const response = await instance.put('/clients/validate-code', data)
    // console.log(response);
    // console.log(response.status);
    // console.log(response.data)    
    return response.data
  } catch (error) {
    console.log(error)
    console.error('Error en la solicitud del code:', error)
    throw error
  }
}

// export const verifyTokenCode = async (data) => {
//   try {
//     const response = await instance.put('/verify-token', data)
//     return response.data
//   } catch (error) {
//     console.error('Error al consumir el token:', error)
//     throw error
//   }
// }


export const disabledToken = async (data) => {
  try {
    const response = await instance.put('/clients/disable-code', data)
    return response.data
  } catch (error) {
    console.log(error)
    throw error
  }
}
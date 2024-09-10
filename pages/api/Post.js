import instance from '@g/api'

export const loginUser = async (cliente) => {
  try {
    const response = await instance.post('/login/user', cliente)
    console.log(response)
    
    return response.data
  } catch (error) {
    console.error('Error en la solicitud de login:', error)
    throw error
  }
}

export const verifyToken = async (token) => {
  try {
    const response = await instance.post('/verify-token', { token })
    console.log(response)
    
    return response.data
  } catch (error) {
    console.error('Error en la verificación del token:', error)
    throw error
  }
}
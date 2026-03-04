import { loginUser, verifyToken } from '@api/Post'

/**
 * Encapsula la lógica de autenticación contra el backend.
 * No toca contexto, cookies ni localStorage.
 */
export async function authenticateWithCredentials(cliente) {
  const res = await loginUser(cliente)
  if (!res?.tokenCode) {
    throw new Error('Respuesta inválida del servidor.')
  }

  const tokenRes = await verifyToken(res.tokenCode)

  const baseSession = {
    tokenCode: res.tokenCode,
    identificacion: res.identificacion,
    type_graph: res.type_graph,
    type_comp: res.type_comp,
    userId: res.userId,
  }

  let status = 'unknown'

  if (tokenRes.message === 'Suscripción activa') {
    status = 'active'
  } else if (tokenRes.message === 'El token ha expirado') {
    status = 'expired'
  } else if (tokenRes.message?.startsWith('Faltan ') || tokenRes.message?.startsWith('Su suscripción ')) {
    status = 'partial'
  }

  return { res, tokenRes, baseSession, status }
}


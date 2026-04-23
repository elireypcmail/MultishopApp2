import { customGraph } from '@api/Post'

export async function updateGraphTypePreference(cliente) {
  const res = await customGraph(cliente)

  if (!res) {
    throw new Error('No se recibió respuesta del servidor al actualizar el gráfico.')
  }

  if (cliente.type_graph) {
    localStorage.setItem('selectedGraphType', cliente.type_graph)
    localStorage.setItem('defaultGraphType', cliente.type_graph)
  }

  let status = 'unknown'

  if (res.message === 'Actualizado correctamente' || res.success || res) {
    status = 'success'
  } else {
    status = 'failed'
  }

  return { res, status }
}
import axios from 'axios'

export default async (req, res) => {
  if (req.method === 'POST') {
    const { from, to, graph } = req.body
    nombreCliente, nombreTabla, fechaInicio, fechaFin, kpi

    try {
      const response = await axios.get('http://localhost:4000', {
        params: {
          nombreCliente: 'yender',
          nombreTabla: 'ventas',
          from,
          to,
          graph
        }
      })

      console.log(response)
      res.status(200).json(response.data)
    } catch (error) {
      console.error('Error fetching data:', error)
      res.status(500).json({ message: 'Error fetching data' })
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' })
  }
}
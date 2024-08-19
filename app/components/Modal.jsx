import React, { useState, useEffect } from 'react'
import { CloseModal } from './Icons'

const Modal = ({ category, onClose, onSave, selectedGraph }) => {
  const [currentSelectedGraph, setCurrentSelectedGraph] = useState(selectedGraph)
  const [nameSelectedGraph, setNameSelectedGraph] = useState('')
  const [closing, setClosing] = useState(false)

  const getGraphs = () => {
    switch (category) {
      case 'financial':
        return [
          { name: 'Totales Generales de Venta', value: 'total_totalventa' },
          { name: 'Promedio Diario de Venta', value: 'promedio_totalventa' },
          { name: 'Totales Generales de Utilidad', value: 'total_totalut' },
          { name: 'Promedio Diario de Utilidad', value: 'promedio_totalut' },
          { name: 'Totales Generales de Valor Ticket de Venta', value: 'total_valor_tp' },
          { name: 'Promedio Diario de Valor Ticket de Venta', value: 'promedio_valor_tp' },
          { name: 'Totales Generales de Costos de Venta', value: 'total_totalcosto' },
          { name: 'Promedio Diario de Costos de Venta', value: 'promedio_totalcosto' },
          { name: 'Totales Generales de Porcentaje de Utilidad', value: 'total_porcentajedeutilidad' },
          { name: 'Promedio Diario de Porcentaje de Utilidad', value: 'promedio_porcentajedeutilidad' },
          { name: 'Promedio Diario de Margen de Ganancia', value: 'promedio_margendeldia' },
        ];
      case 'operative':
        return [
          { name: 'Totales Generales de Unidades Vendidas', value: 'total_cantidadund' },
          { name: 'Promedio Diario de Unidades Vendidas', value: 'promedio_cantidadund' },
          { name: 'Totales Generales de Facturas Emitidas', value: 'total_cantidadfac' },
          { name: 'Promedio Diario de Facturas Emitidas', value: 'promedio_cantidadfac' },
          { name: 'Totales Generales de Unidades en Bolsa', value: 'total_valor_uxb' },
          { name: 'Promedio Diario de Unidades en Bolsa', value: 'promedio_valor_uxb' },
          { name: 'Totales Generales de Valor Promedio de la Unidad', value: 'total_valor_up' },
          { name: 'Promedio Diario de Valor Promedio de la Unidad', value: 'promedio_valor_up' },
          { name: 'Totales Generales de Clientes Atendidos', value: 'total_clientesa' },
          { name: 'Promedio Diario de Clientes Atendidos', value: 'promedio_clientesa' },
          { name: 'Totales Generales de Clientes Frecuentes', value: 'total_clientesf' },
          { name: 'Promedio Diario de Clientes Frecuentes', value: 'promedio_clientesf' },
          { name: 'Totales Generales de Clientes Nuevos', value: 'total_clientesn' },
          { name: 'Promedio Diario de Clientes Nuevos', value: 'promedio_clientesn' },
        ];
      case 'statistical':
        return [
          { name: 'Día más Exitoso', value: 'total_diamassexitoso' },
          { name: 'Venta más Exitosa', value: 'total_ventamasexitosa' },
          { name: 'Ranking de 5 Operadores más Productivos', value: 'total_rankingoperadores' },
          { name: 'Ranking de 5 Fabricantes más Vendidos', value: 'total_rankingfabricantes' },
        ];
      default:
        return [];
    }
  }

  useEffect(() => {
    setCurrentSelectedGraph(selectedGraph)
  }, [selectedGraph])

  const handleItemClick = (graph) => {
    setCurrentSelectedGraph(graph.value)
    setNameSelectedGraph(graph.name)
  }  

  const handleClose = () => {
    setClosing(true)
    setTimeout(() => {
      onClose()
      setClosing(false)
    }, 300)
  }

  const handleSave = () => {
    const [prefix, baseValue] = currentSelectedGraph.split('_')
    console.log('Saving currentSelectedGraph:', baseValue)
    console.log('Saving currentSelectedGraph:', nameSelectedGraph)
    onSave(baseValue)
    localStorage.setItem('selectedGraph', baseValue)
    localStorage.setItem('selectedGraphName', nameSelectedGraph)
    handleClose()
  }

  return (
    <div className={`modal-ca ${closing ? 'fade-out' : 'fade-in'}`}>
      <div className={`modal-content ${closing ? 'fade-out' : 'fade-in'}`}>
        <span className="close-button" onClick={handleClose}>
          <CloseModal />
        </span>
        <h2 className='ti-graph'>Gráficos de {category}</h2>
        <ul className='li'>
          {getGraphs().map((graph) => (
            <li
              key={graph.value}
              className={`separate ${currentSelectedGraph === graph.value ? 'selected' : ''}`}
              onClick={() => handleItemClick(graph)}
            >
              <div className="list">
                <div className="gra-li">
                  {graph.name}
                </div>
              </div>
            </li>
          ))}
        </ul>
        <div className="save-button-container">
          <button onClick={handleSave} disabled={!currentSelectedGraph}>Guardar</button>
        </div>
      </div>
    </div>
  )
}

export default Modal
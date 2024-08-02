import React, { useState, useEffect } from 'react'
import { CloseModal } from './Icons'

const Modal = ({ category, onClose, onSave, selectedGraph }) => {
  const [currentSelectedGraph, setCurrentSelectedGraph] = useState(selectedGraph)
  const [closing, setClosing] = useState(false)

  const getGraphs = () => {
    switch (category) {
      case 'financial':
        return [
          'Total venta generales',
          'Promedio diario de venta',
          'Total de utilidad generales',
          'Promedio diario de utilidad',
          'Total general de ticket de venta',
          'Promedio diario de ticket de venta',
          'Total general de costos de venta',
          'Promedio diario de costos de venta',
          'Total general porcentaje de utilidad',
          'Promedio diario de porcentaje de utilidad',
          'Promedio diario de margen de ganancia'
        ]
      case 'operative':
        return [
          'Total general de utilidades vendidas',
          'Promedio diario de utilidades vendidas',
          'Total de facturas emitidas',
          'Promedio diario de facturas emitidas',
          'Total de unidades en bolsa',
          'Promedio diario de unidades en bolsa',
          'Total general de valor promedio de la unidad',
          'Promedio diario de valor promedio de la unidad',
          'Total general de clientes atentidos',
          'Promedio diario de clientes atendidos',
          'Total general de clientes frecuentes',
          'Promedio diario de clientes frecuentes',
          'Total general de clientes nuevos',
          'Promedio diario de clientes nuevos'
        ]
      case 'statistical':
        return [
          'Día más exitoso',
          'Venta más exitosa',
          'Ranking 5 Operadores más productivos',
          'Ranking 5 Fabricantes más vendidos'
        ]
      default:
        return []
    }
  }

  useEffect(() => {
    setCurrentSelectedGraph(selectedGraph)
  }, [selectedGraph])

  const handleItemClick = (graph) => {
    setCurrentSelectedGraph(graph)
  }

  const handleClose = () => {
    setClosing(true)
    setTimeout(() => {
      onClose()
      setClosing(false)
    }, 300) // La duración debe coincidir con la duración de la animación CSS
  }

  const handleSave = () => {
    onSave(currentSelectedGraph)
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
          {getGraphs().map((graph, index) => (
            <li 
              key={index} 
              className={`separate ${currentSelectedGraph === graph ? 'selected' : ''}`}
              onClick={() => handleItemClick(graph)}
            >
              <div className="list">
                <div className="gra-li">
                  {graph}
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
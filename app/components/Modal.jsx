import React, { useState, useEffect } from 'react'
import { CloseModal } from './Icons'

const Modal = ({ category, onClose, onSave, selectedGraph }) => {
  const [currentSelectedGraph, setCurrentSelectedGraph] = useState(selectedGraph)
  const [closing, setClosing] = useState(false)

  const getGraphs = () => {
    switch (category) {
      case 'financial':
        return [
          { name: 'Totales Generales de Venta', value: 'totalventa' },
          { name: 'Promedio Diario de Venta', value: 'promdiarioventa' },
          { name: 'Totales Generales de Utilidad', value: 'totalut' },
          { name: 'Promedio Diario de Utilidad', value: 'promdiarioutilidad' },
          { name: 'Totales Generales de Valor Ticket de Venta', value: 'valor_tp' },
          { name: 'Promedio Diario de Valor Ticket de Venta', value: 'promdiariovalorticket' },
          { name: 'Totales Generales de Costos de Venta', value: 'totalcosto' },
          { name: 'Promedio Diario de Costos de Venta', value: 'promdiariocosto' },
          { name: 'Totales Generales de Porcentaje de Utilidad', value: 'porcentajedeutilidad' },
          { name: 'Promedio Diario de Porcentaje de Utilidad', value: 'promdiarioporcentajedeutilidad' },
          { name: 'Promedio Diario de Margen de Ganancia', value: 'margendeldia' },
        ];
      case 'operative':
        return [
          { name: 'Totales Generales de Unidades Vendidas', value: 'cantidadund' },
          { name: 'Promedio Diario de Unidades Vendidas', value: 'promdiariounidvend' },
          { name: 'Totales Generales de Facturas Emitidas', value: 'cantidadfac' },
          { name: 'Promedio Diario de Facturas Emitidas', value: 'promdiariofactemit' },
          { name: 'Totales Generales de Unidades en Bolsa', value: 'valor_uxb' },
          { name: 'Promedio Diario de Unidades en Bolsa', value: 'promdiariounidbolsa' },
          { name: 'Totales Generales de Valor Promedio de la Unidad', value: 'valor_up' },
          { name: 'Promedio Diario de Valor Promedio de la Unidad', value: 'promdiariovalorup' },
          { name: 'Totales Generales de Clientes Atendidos', value: 'clientesa' },
          { name: 'Promedio Diario de Clientes Atendidos', value: 'promdiarioclientesat' },
          { name: 'Totales Generales de Clientes Frecuentes', value: 'clientesf' },
          { name: 'Promedio Diario de Clientes Frecuentes', value: 'promdiarioclientesfrec' },
          { name: 'Totales Generales de Clientes Nuevos', value: 'clientesn' },
          { name: 'Promedio Diario de Clientes Nuevos', value: 'promdiarioclientesnuev' },
        ];
      case 'statistical':
        return [
          { name: 'Día más Exitoso', value: 'diamassexitoso' },
          { name: 'Venta más Exitosa', value: 'ventamasexitosa' },
          { name: 'Ranking de 5 Operadores más Productivos', value: 'rankingoperadores' },
          { name: 'Ranking de 5 Fabricantes más Vendidos', value: 'rankingfabricantes' },
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
  }  

  const handleClose = () => {
    setClosing(true)
    setTimeout(() => {
      onClose()
      setClosing(false)
    }, 300)
  }

  const handleSave = () => {
    console.log('Saving currentSelectedGraph:', currentSelectedGraph)
    onSave(currentSelectedGraph)
    localStorage.setItem('selectedGraph', currentSelectedGraph)
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
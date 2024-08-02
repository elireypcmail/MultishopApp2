import React, { useState, useEffect } from 'react'
import { CloseModal, BarGraph, CircularGraph, LineGraph } from './Icons'

const GraphTypeModal = ({ onClose, onSave, selectedGraphType }) => {
  const [currentSelectedGraphType, setCurrentSelectedGraphType] = useState(selectedGraphType)
  const [closing, setClosing] = useState(false)

  const graphTypes = [
    { name: 'Barra', icon: <BarGraph /> },
    { name: 'Torta', icon: <CircularGraph /> },
    { name: 'Línea', icon: <LineGraph /> },
  ]

  useEffect(() => {
    setCurrentSelectedGraphType(selectedGraphType)
  }, [selectedGraphType])

  const handleItemClick = (graphType) => {
    setCurrentSelectedGraphType(graphType.name)
  }

  const handleClose = () => {
    setClosing(true)
    setTimeout(() => {
      onClose()
      setClosing(false)
    }, 300) 
  }

  const handleSave = () => {
    onSave(currentSelectedGraphType)
    handleClose()
  }

  return (
    <div className={`modal-type ${closing ? 'fade-out' : 'fade-in'}`}>
      <div className={`modal-content ${closing ? 'fade-out' : 'fade-in'}`}>
        <span className="close-button" onClick={handleClose}>
          <CloseModal />
        </span>
        <h2 className="ti-graph">Tipos de Gráficos</h2>
        <ul className="li">
          {graphTypes.map((graphType, index) => (
            <li 
              key={index} 
              className={`separate ${currentSelectedGraphType === graphType.name ? 'selected' : ''}`}
              onClick={() => handleItemClick(graphType)}
            >
              <div className="list">
                <div className="graph-icon">
                  {graphType.icon}
                </div>
                <div className="gra-li">
                  {graphType.name}
                </div>
              </div>
            </li>
          ))}
        </ul>
        <div className="save-button-container">
          <button onClick={handleSave} disabled={!currentSelectedGraphType}>Guardar</button>
        </div>
      </div>
    </div>
  )
}

export default GraphTypeModal
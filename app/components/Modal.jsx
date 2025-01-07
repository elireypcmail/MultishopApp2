import { useRouter }         from 'next/router'
import multishop             from "@p/Logo Sistema Multishop Pequeno.png"
import Image                 from "next/image"
import FooterGraph           from './Footer'
import instance              from '@g/api'
import { defaultChartTypes } from '@conf/defaultChartTypes'
import { getCookie }         from '@a/globals/cookies'
import React, 
  { useState, useEffect } 
from 'react'
import { 
  ArrowLeft, 
  Sun, 
  Moon 
} 
from './Icons'

const Modal = () => {
  const router = useRouter()
  const [category, setCategory]                         = useState('')
  const [currentSelectedGraph, setCurrentSelectedGraph] = useState('')
  const [selectedGraphType, setSelectedGraphType]       = useState(null)
  const [darkMode, setDarkMode]                         = useState(false)
  const [isDataFetched, setIsDataFetched]               = useState(false)
  const [chartData, setChartData]                       = useState([])
  const [instanciaUser, setInstanciaUser]               = useState('')
  const [noDataMessage, setNoDataMessage]               = useState('')
  const [defaultGraphType, setDefaultGraphType]         = useState('Torta')
  
  useEffect(() => {
    const savedCategory = router.query.category || localStorage.getItem('selectedCategory')
    setCategory(savedCategory || '')

    const savedGraphType = localStorage.getItem('defaultGraphType')
    if (savedGraphType) setDefaultGraphType(savedGraphType) 
  }, [router.query.category])

  useEffect(() => {
    const savedDarkMode = localStorage.getItem('darkMode')
    if (savedDarkMode !== null) setDarkMode(JSON.parse(savedDarkMode)) 

    const cookieValue = getCookie('instancia')
    if (cookieValue) {
      setInstanciaUser(cookieValue)
      console.log('Valor de la cookie instancia:', cookieValue)
    }
  }, [])

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [darkMode])

  const toggleDarkMode = () => {
    const newMode = !darkMode
    setDarkMode(newMode)
    localStorage.setItem('darkMode', JSON.stringify(newMode))
  }

  useEffect(() => {
    if (isDataFetched && chartData.length > 0) {
      router.push({
        pathname: '/graph',
        query: {
          selectedGraph: currentSelectedGraph,
          selectedGraphType,
          chartData: JSON.stringify(chartData),
        },
      })
    }
  }, [isDataFetched, chartData, router, currentSelectedGraph, selectedGraphType])

  const getGraphs = () => {
    switch (category) {
      case 'Financieros':
        return [
          { name: 'Ventas en USD',      value: 'totalventa' },
          { name: 'Utilidad',           value: 'totalut' },
          { name: 'Ticket de Venta',    value: 'valor_tp' },
          { name: 'Costo de Venta',     value: 'totalcosto' },
          { name: 'Margen de Utilidad', value: 'porcentajedeutilidad' },
        ]
      case 'Operativos':
        return [
          { name: 'Unidades Vendidas',           value: 'cantidadund' },
          { name: 'Facturas Emitidas',           value: 'cantidadfac' },
          { name: 'Unidades en Bolsa',           value: 'valor_uxb' },
          { name: 'Valor Promedio de la Unidad', value: 'valor_up' },
          { name: 'Clientes Atendidos',          value: 'clientesa' },
          { name: 'Clientes Frecuentes',         value: 'clientesf' },
          { name: 'Clientes Nuevos',             value: 'clientesn' },
        ]
      case 'Estadísticos':
        return [
          { name: 'Día más Exitoso',            value: 'DiaMasExitoso' },
          { name: 'Venta más Exitosa',          value: 'VentaMasExitosa' },
          { name: 'Cajeros con más Venta',      value: 'CajerosConMasVentas' },
          { name: 'Fabricantes con más Ventas', value: 'FabricantesConMasVentas' },
          { name: 'Productos más vendidos',     value: 'ProductosTOP' },
        ]
      default:
        return []
    }
  }

  const handleItemClick = (graph) => {
    localStorage.setItem('selectedGraph',     graph.value)
    localStorage.setItem('selectedGraphName', graph.name)
    localStorage.setItem('selectedCategory',  category)
    
    setCurrentSelectedGraph(graph.value)
    
    const graphType = category === 'Estadísticos' ? 'Texto' : (defaultChartTypes[graph.name] || defaultGraphType)
    setSelectedGraphType(graphType)
    localStorage.setItem('selectedGraphType', graphType)
  }

  const handleFetchChartData = async () => {
    if (!instanciaUser) {
      console.log('instanciaUser no está disponible aún.')
      return
    }
  
    const dateRange    = JSON.parse(localStorage.getItem('dateRange'))
    const { from, to } = dateRange

    const fromDate = new Date(dateRange.from).toLocaleDateString('en-CA')
    const toDate   = new Date(dateRange.to).toLocaleDateString('en-CA')
  
    try {
      const endpoint = category === 'Estadísticos' ? '/kpi/custom' : '/filter-data'
      const response = await instance.post(endpoint, {
        nombreCliente: instanciaUser, 
        nombreTabla: 'ventas',
        fechaInicio: from,
        fechaFin: to,
        kpi: localStorage.getItem('selectedGraph'),
      })

      if (response.data && (response.data.results || response.data.length > 0)) {
        const chartDataWithDateRange = {
          ...response.data,
          dateRange: { from, to }
        }

        localStorage.setItem('chartData', JSON.stringify(chartDataWithDateRange))
        setChartData(chartDataWithDateRange)
        setNoDataMessage('')
      } else {
        setNoDataMessage(`No hay datos disponibles para el rango de fechas seleccionado (${fromDate} / ${toDate}).`)
        localStorage.setItem('noDataMessage', `No hay datos disponibles para el rango de fechas seleccionado (${fromDate} / ${toDate}).`)
        setChartData([])
      }
      
      setIsDataFetched(true)
      router.push('/graph')
    } catch (error) {
      console.error('Error fetching chart data:', error)
      setNoDataMessage(`No hay datos disponibles para el rango de fechas seleccionado (${fromDate} / ${toDate}).`)
      localStorage.setItem('noDataMessage', `No hay datos disponibles para el rango de fechas seleccionado (${fromDate} / ${toDate}).`)
      setIsDataFetched(true)
      router.push('/graph')
    }
  }

  const handleSearchGraph = async (e) => {
    e.preventDefault()
    await handleFetchChartData()
  }

  const handleClose = () => { router.push('/category') }

  return (
    <div className="body">
      <div className="calendar">
        <div className="nav">
          <div className="logo-small">
            <Image
              src={multishop}
              className="mutishop"
              alt="Logo de Multishop"
            />
          </div>
          <div className="mood">
            <button
              className={`mood-btn ${darkMode ? "dark" : ""}`}
              onClick={toggleDarkMode}
            >
              <Sun className="icon" />
              <div className="circle2"></div>
              <Moon className="icon" />
            </button>
          </div>
        </div>

        <div className='modal-ca'>
          <div className='modal-content'>
            <h2 className='ti-graph'>{category === 'Estadísticos' ? 'Análisis' : 'Gráficos'} {category}</h2>
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
              <button className='back' onClick={handleClose}>
                <div className="btn">
                  <ArrowLeft />
                  <span>Atrás</span>
                </div>
              </button>
              <button onClick={handleSearchGraph} disabled={!currentSelectedGraph}>
                {category === 'Estadísticos' ? 'Ver estadística' : 'Ver gráfico'}
              </button>
            </div>
          </div>
        </div>

        <FooterGraph />
      </div>
    </div>
  )
}

export default Modal
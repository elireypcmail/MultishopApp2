'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { ArrowLeft, Sun, Moon } from './Icons'
import multishop from "@p/Logo Sistema Multishop Pequeno.png"
import Image from "next/image"
import FooterGraph from './Footer'
import instance from '@g/api'
import { defaultChartTypes } from '@conf/defaultChartTypes'

const Modal = () => {
  const router = useRouter()
  const [category, setCategory] = useState('')
  const [currentSelectedGraph, setCurrentSelectedGraph] = useState('')
  const [selectedGraphType, setSelectedGraphType] = useState(null)
  const [darkMode, setDarkMode] = useState(false)
  const [isDataFetched, setIsDataFetched] = useState(false)
  const [chartData, setChartData] = useState([])

  useEffect(() => {
    const savedCategory = router.query.category || localStorage.getItem('selectedCategory')
    setCategory(savedCategory || '')

    const savedDarkMode = localStorage.getItem("darkMode")
    if (savedDarkMode !== null) {
      setDarkMode(JSON.parse(savedDarkMode))
    }
  }, [router.query.category])

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [darkMode])

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

  const toggleDarkMode = () => {
    const newMode = !darkMode
    setDarkMode(newMode)
    localStorage.setItem("darkMode", JSON.stringify(newMode))
  }

  const getGraphs = () => {
    switch (category) {
      case 'Financieros':
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
        ]
      case 'Operativos':
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
        ]
      case 'Estadísticos':
        return [
          { name: 'Día más Exitoso', value: 'total_diamassexitoso' },
          { name: 'Venta más Exitosa', value: 'total_ventamasexitosa' },
          { name: 'Ranking de 5 Operadores más Productivos', value: 'total_rankingoperadores' },
          { name: 'Ranking de 5 Fabricantes más Vendidos', value: 'total_rankingfabricantes' },
        ]
      default:
        return []
    }
  }

  const handleItemClick = (graph) => {
    const [prefix, baseValue] = graph.value.split('_')
  
    localStorage.setItem('selectedGraph', baseValue)
    localStorage.setItem('selectedGraphName', graph.name)
  
    setCurrentSelectedGraph(graph.value)
  
    const defaultGraphType = defaultChartTypes[graph.name] || 'Barra'
    setSelectedGraphType(defaultGraphType)
    localStorage.setItem('selectedGraphType', defaultGraphType)
  }

  const handleFetchChartData = async () => {
    const dateRange = JSON.parse(localStorage.getItem('dateRange'))
    const { from, to } = dateRange

    try {
      const response = await instance.post('/filter-data', {
        nombreCliente: 'prueba',
        nombreTabla: 'ventas',
        fechaInicio: from,
        fechaFin: to,
        kpi: localStorage.getItem('selectedGraph'),
      })

      setChartData(response.data)
      setIsDataFetched(true)

      router.push('/graph')
    } catch (error) {
      console.error('Error fetching chart data:', error)
    }
  }

  const handleSearchGraph = async (e) => {
    e.preventDefault()
    await handleFetchChartData()
  }

  const handleClose = () => {
    router.push('/category')
  }

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
            <h2 className='ti-graph'>Gráficos {category}</h2>
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
              <button onClick={handleClose}>Atrás</button>
              <button onClick={handleSearchGraph} disabled={!currentSelectedGraph}>Buscar</button>
            </div>
          </div>
        </div>

        <FooterGraph />
      </div>
    </div>
  )
}

export default Modal
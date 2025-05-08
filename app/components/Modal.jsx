import { useRouter } from 'next/router'
import multishop from "@p/Logo Sistema Multishop Pequeno.png"
import Image from "next/image"
import FooterGraph from './Footer'
import instance from '@g/api'
import { defaultChartTypes } from '@conf/defaultChartTypes'
import { getCookie } from '@a/globals/cookies'
import React, { useState, useEffect } from 'react'
import { ArrowLeft, Sun, Moon, ReloadIcon } from './Icons'

const Modal = () => {
  const router = useRouter()
  const [category, setCategory] = useState('')
  const [currentSelectedGraph, setCurrentSelectedGraph] = useState('')
  const [selectedGraphType, setSelectedGraphType] = useState(null)
  const [darkMode, setDarkMode] = useState(false)
  const [isDataFetched, setIsDataFetched] = useState(false)
  const [chartData, setChartData] = useState([])
  const [instanciaUser, setInstanciaUser] = useState('')
  const [noDataMessage, setNoDataMessage] = useState('')
  const [defaultGraphType, setDefaultGraphType] = useState('Torta')
  const [modalState, setModalState] = useState({ open: false, message: '', status: '' });
  const [isButtonDisabled, setIsButtonDisabled] = useState(false) // Agregar estado para deshabilitar el botón
  const [isLoading, setIsLoading] = useState(false);

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
    const handleRouteChangeComplete = () => {
      setIsLoading(false);
      setModalState({ open: false, message: '', status: '' });
    };

    router.events.on('routeChangeComplete', handleRouteChangeComplete);
    return () => {
      router.events.off('routeChangeComplete', handleRouteChangeComplete);
    };
  }, [router]);

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
          { name: 'Ventas en USD', value: 'totalventa' },
          { name: 'Utilidad', value: 'totalut' },
          { name: 'Ticket de Venta', value: 'ticketDeVenta' },
          { name: 'Costo de Venta', value: 'totalcosto' },
          { name: 'Margen de Utilidad', value: 'margenDeUtilidad' },
          { name: 'Análisis de Ventas vs Compras', value: 'ventasVScompras' },
        ]
      case 'Operativos':
        return [
          { name: 'Unidades Vendidas', value: 'cantidadund' },
          { name: 'Facturas Emitidas', value: 'cantidadfac' },
          { name: 'Unidades en Bolsa', value: 'unidadesVendidas' },
          { name: 'Valor Promedio de la Unidad', value: 'valorDeLaUnidadPromedio' },
          { name: 'Clientes Atendidos', value: 'clientesa' },
          { name: 'Clientes Frecuentes', value: 'clientesf' },
          { name: 'Clientes Nuevos', value: 'clientesn' },
          { name: 'Flujo de Caja', value: 'flujoDeCaja' }
        ]
      case 'Estadísticos':
        return [
          { name: 'Día más Exitoso', value: 'DiaMasExitoso' },
          { name: 'Venta más Exitosa', value: 'VentaMasExitosa' },
          { name: 'Cajeros con más Venta', value: 'CajerosConMasVentas' },
          { name: 'Fabricantes con más Ventas', value: 'FabricantesConMasVentas' },
          { name: 'Productos más vendidos', value: 'ProductosTOP' },
          { name: 'Valores de Inventario', value: 'Inventario' },
        ]
      default:
        return []
    }
  }

  const handleItemClick = (graph) => {
    localStorage.setItem('selectedGraph', graph.value)
    localStorage.setItem('selectedGraphName', graph.name)
    localStorage.setItem('selectedCategory', category)

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
    setModalState({ open: true, message: 'Cargando...', status: 'loading' });
  
    const typeCompanies = localStorage.getItem('typeCompanies')
    const dateRange = JSON.parse(localStorage.getItem('dateRange'))
    const { from, to } = dateRange

    const fromDate = new Date(from).toLocaleDateString('en-CA')
    const toDate = new Date(to).toLocaleDateString('en-CA')
    const kpiSelected = localStorage.getItem('selectedGraph')

    try {
      const endpoint = (category === 'Estadísticos' || kpiSelected === 'flujoDeCaja') 
        ? '/kpi/custom' 
        : '/filter-data';
  
      // Realizar ambas solicitudes en paralelo
      const [dataResponse, lastDateResponse] = await Promise.all([
        instance.post(endpoint, {
          nombreCliente: instanciaUser,
          nombreTabla: 'ventas',
          fechaInicio: from,
          fechaFin: to,
          kpi: kpiSelected,
          typeCompanies,
        }),
        instance.post("/lastDateSincro", { cliente: instanciaUser })
      ])
  
      // Guardar la fecha de sincronización
      if (lastDateResponse.data?.data) {
        localStorage.setItem('lastdateSincro', lastDateResponse.data.data)
        console.log('Fecha de última sincronización:', lastDateResponse.data.data)
      }
  
      const data = dataResponse.data
      const resultsExist = data?.results || (Array.isArray(data) && data.length > 0)
  
      if (resultsExist) {
        const chartDataWithDateRange = {
          ...data,
          dateRange: { from, to }
        }
  
        setModalState({ open: true, message: 'Kpi encontrado', status: 'success' });
        localStorage.setItem('chartData', JSON.stringify(chartDataWithDateRange))
        setChartData(chartDataWithDateRange)
        setNoDataMessage('')
        setIsDataFetched(true)
  
        router.push('/graph').then(() => {
          setModalState({ open: false, message: '', status: '' }) // Cierra el modal después de la navegación
        })
  
      } else {
        handleNoDataMessage(fromDate, toDate)
      }
  
    } catch (error) {
      console.error('Error fetching chart data:', error)
      setNoDataMessage(`No hay datos disponibles para el rango de fechas seleccionado (${fromDate} / ${toDate}).`)
      localStorage.setItem('noDataMessage', `No hay datos disponibles para el rango de fechas seleccionado (${fromDate} / ${toDate}).`)
      setIsDataFetched(true)
      router.push('/graph')
    }
  }

  // Función auxiliar para manejar el mensaje de "No hay datos"
  const handleNoDataMessage = (fromDate, toDate) => {
    const message = `No hay datos disponibles para el rango de fechas seleccionado (${fromDate} / ${toDate}).`
    setNoDataMessage(message)
    localStorage.setItem('noDataMessage', message)
    setChartData([])
    setModalState({ open: false, message: '', status: '' }) // Asegura que el modal se cierre en este caso
    setIsButtonDisabled(false)
  }
  
  const handleSearchGraph = async (e) => {
    e.preventDefault()
    setIsButtonDisabled(true) // Deshabilitar el botón
    await handleFetchChartData()
    setModalState({ open: false, message: '', status: '' });
    setIsButtonDisabled(false);
    setTimeout(() => {
      setIsButtonDisabled(false) // Volver a habilitar el botón después de 5 segundos
    }, 5000)
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
              <button onClick={handleSearchGraph} disabled={isButtonDisabled || !currentSelectedGraph}>
                {category === 'Estadísticos' ? 'Ver estadística' : 'Ver gráfico'}
              </button>
            </div>
          </div>
        </div>

        {modalState.open && modalState.status === 'loading' && (
          <div className="modal-login-loading">
            <ReloadIcon className="icon-loading" />
          </div>
        )}

        <FooterGraph />
      </div>
    </div>
  )
}

export default Modal

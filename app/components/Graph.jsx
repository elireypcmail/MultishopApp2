import { useRouter } from 'next/router'
import { useState, useEffect } from 'react'
import FooterGraph from './Footer'
import BarChartComponent from './BarChart'
import PieChartComponent from './PieChart'
import LineChartComponent from './AreaChart'
import { Sun, Moon, NotFound, ArrowLeft, Options } from './Icons'
import { defaultChartTypes } from '@conf/defaultChartTypes'
import GraphTypeModal from './GraphType'

export default function Graph() {
  const router = useRouter()
  const [darkMode, setDarkMode] = useState(false)
  const [chartDataState, setChartDataState] = useState(null)
  const [nameGraph, setNameGraph] = useState('')
  const [dateGraph, setDateGraph] = useState('')
  const [currentGraphType, setCurrentGraphType] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false) 

  useEffect(() => {
    const savedDarkMode = localStorage.getItem('darkMode') === 'true'
    setDarkMode(savedDarkMode)
  }, [])

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [darkMode])

  useEffect(() => {
    loadName()
    loadChartData()
  }, [])

  const loadChartData = () => {
    const storedChartData = localStorage.getItem('chartData')
    if (storedChartData) {
      try {
        const parsedData = JSON.parse(storedChartData)
        console.log('Loaded chart data:', parsedData)
        setChartDataState(parsedData)
      } catch (error) {
        console.error('Error parsing chart data:', error)
      }
    }
  }

  useEffect(() => {
    const selectedGraphType = localStorage.getItem('selectedGraphType')
    const defaultGraphType = defaultChartTypes[nameGraph] || 'Barra'
    setCurrentGraphType(selectedGraphType || defaultGraphType)
  }, [nameGraph])

  const toggleDarkMode = () => {
    const newDarkMode = !darkMode
    setDarkMode(newDarkMode)
    localStorage.setItem('darkMode', newDarkMode)
  }

  const loadName = () => {
    const res = localStorage.getItem('selectedGraphName')
    const date = JSON.parse(localStorage.getItem('dateRange'))
    if (date) {
      const from = new Date(date.from).toLocaleDateString('en-CA')
      const to = new Date(date.to).toLocaleDateString('en-CA')

      setNameGraph(res)
      setDateGraph(`${from} / ${to}`)
    }
  }

  const renderChart = () => {
    if (!chartDataState || !chartDataState.dateRange) {
      return (
        <div className='not-found'>
          <div className="icon-not-found">
            <NotFound />
          </div>
          <span>
            No hay datos disponibles para mostrar.
          </span>
        </div>
      )
    }

    switch (currentGraphType) {
      case 'Barra':
        return <BarChartComponent data={chartDataState} dateRange={chartDataState.dateRange} />
      case 'Torta':
        return <PieChartComponent data={chartDataState} dateRange={chartDataState.dateRange} />
      case 'Línea':
        return <LineChartComponent data={chartDataState} dateRange={chartDataState.dateRange} />
      default:
        return (
          <div className='not-found'>
            <div className="icon-not-found">
              <NotFound />
            </div>
            <span>
              No se ha seleccionado ningún tipo de gráfico.
            </span>
          </div>
        )
    }
  }

  const backRouter = (e) => {
    e.preventDefault()
    router.push('/listkpi')
  }

  const handleOpenModal = () => {
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
  }

  const handleSaveGraphType = (newGraphType) => {
    setCurrentGraphType(newGraphType)
    localStorage.setItem('selectedGraphType', newGraphType)
    setIsModalOpen(false)
  }

  return (
    <div className="body">
      <div className="calendar gra-content">
        <div className="graph-option">
          <div className="graph-type" onClick={handleOpenModal}>
            <Options />
          </div>

          <div className="mood">
            <button className={`mood-btn ${darkMode ? 'dark' : ''}`} onClick={toggleDarkMode}>
              <Sun className="icon" />
              <div className="circle2"></div>
              <Moon className="icon" />
            </button>
          </div>
        </div>

        <div className="graph__body">
          <div className="graph__header">
            <div className="content-header">
              <div className="graph__header__title">{nameGraph}</div>
              <div className="graph__header__data">
                <span>{dateGraph}</span>
              </div>
            </div>
          </div>
          <div className="graph__body__content">
            {renderChart()}
          </div>

          <div className="button__graph">
            <button className='btn' onClick={backRouter}>
              <ArrowLeft></ArrowLeft>
              <span>Atrás</span>
            </button>
          </div>
        </div>

        <FooterGraph />
      </div>

      {isModalOpen && (
        <GraphTypeModal
          onClose={handleCloseModal}
          onSave={handleSaveGraphType}
          selectedGraphName={nameGraph}
        />
      )}
    </div>
  )
}
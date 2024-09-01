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
  const { selectedGraph, selectedGraphType, chartData } = router.query
  const [darkMode, setDarkMode] = useState(false)
  const [chartDataState, setChartDataState] = useState([])
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
    if (chartData) {
      try {
        const parsedData = JSON.parse(chartData)
        setChartDataState(parsedData)
      } catch (error) {
        console.error('Error parsing chart data:', error)
      }
    }
  }, [chartData, nameGraph])

  useEffect(() => {
    const defaultGraphType = defaultChartTypes[nameGraph] || 'Barra'
    setCurrentGraphType(selectedGraphType || defaultGraphType)
  }, [selectedGraphType, nameGraph])

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
    switch (currentGraphType) {
      case 'Barra':
        return <BarChartComponent data={chartDataState} />
      case 'Torta':
        return <PieChartComponent data={chartDataState} />
      case 'Línea':
        return <LineChartComponent data={chartDataState} />
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
            {selectedGraphType ? (
              <>
                <div className="content-header">
                  <div className="graph__header__title">{nameGraph}</div>
                  <div className="graph__header__data">
                    <span>{dateGraph}</span>
                  </div>
                </div>
              </>
            ) : null}
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
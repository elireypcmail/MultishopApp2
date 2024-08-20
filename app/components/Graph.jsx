import { useRouter } from 'next/router'
import { useState, useEffect } from 'react'
import FooterGraph from './Footer'
import BarChartComponent from './BarChart'
import PieChartComponent from './PieChart'
import LineChartComponent from './AreaChart'
import { Sun, Moon, NotFound } from './Icons'
import { defaultChartTypes } from '@conf/defaultChartTypes'

export default function Graph() {
  const router = useRouter()
  const { selectedGraph, selectedGraphType, chartData } = router.query
  const [darkMode, setDarkMode] = useState(false)
  const [chartDataState, setChartDataState] = useState([])
  const [nameGraph, setNameGraph] = useState('')
  const [dateGraph, setDateGraph] = useState('')
  const [currentGraphType, setCurrentGraphType] = useState('') 

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
    if (selectedGraphType) {
      const defaultGraphType = defaultChartTypes[nameGraph] || 'Barra'
      console.log(defaultGraphType)
      setCurrentGraphType(defaultGraphType)
    } else {
      setCurrentGraphType(selectedGraphType)
      console.log(selectedGraphType)
    }
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
      setDateGraph(`${from} - ${to}`)
    }
  }

  const renderChart = () => {
    console.log(currentGraphType)
    
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

  return (
    <div className="body">
      <div className="calendar gra-content">
        <div className="mood">
          <button className={`mood-btn ${darkMode ? 'dark' : ''}`} onClick={toggleDarkMode}>
            <Sun className="icon" />
            <div className="circle2"></div>
            <Moon className="icon" />
          </button>
        </div>

        <div className="graph__body">
          <div className="graph__header">
            {selectedGraphType ? (
              <>
                <div className="graph__header__title">{nameGraph}</div>
                <div className="graph__header__data">
                  <span>{dateGraph}</span>
                </div>
              </>
            ) : null}
          </div>
          <div className="graph__body__content">
            {renderChart()}
          </div>
        </div>

        <FooterGraph />
      </div>
    </div>
  )
}
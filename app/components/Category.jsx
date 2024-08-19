import { useState, useEffect } from 'react'
import { 
  Financial, 
  Operative, 
  Statistical, 
  ArrowRight, 
  ArrowDown, 
  Sun, 
  Moon 
} from './Icons'
import Image from 'next/image'
import { useRouter } from 'next/router'
import multishop from '@p/Logo Sistema Multishop Pequeno.png'
import FooterGraph from './Footer'
import Modal from './Modal'
import GraphTypeModal from './GraphType'
import instance from '@g/api'
import BarChartComponent from './BarChart'
import LineChartComponent from './AreaChart'
import PieChartComponent from './PieChart'

export default function Category() {
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false)
  const [isGraphTypeModalOpen, setIsGraphTypeModalOpen] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState(null)
  const [selectedGraph, setSelectedGraph] = useState(null)
  const [selectedGraphType, setSelectedGraphType] = useState(null)
  const [darkMode, setDarkMode] = useState(false)
  const [chartData, setChartData] = useState([])
  const [isDataFetched, setIsDataFetched] = useState(false)

  const router = useRouter()

  useEffect(() => {
    const savedDarkMode = localStorage.getItem("darkMode")
    if (savedDarkMode !== null) {
      setDarkMode(JSON.parse(savedDarkMode))
    }
  }, [])

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [darkMode])

  useEffect(() => {
    if (isDataFetched && chartData.length > 0) {
      console.log(JSON.stringify(chartData))
      
      router.push({
        pathname: '/graph',
        query: {
          selectedGraph,
          selectedGraphType,
          chartData: JSON.stringify(chartData),
        },
      })
    }
  }, [isDataFetched, chartData, router, selectedGraph, selectedGraphType])

  const toggleDarkMode = () => {
    const newMode = !darkMode
    setDarkMode(newMode)
    localStorage.setItem("darkMode", JSON.stringify(newMode))
  }

  const handleCategoryClick = (category) => {
    setSelectedCategory(category)
    setIsCategoryModalOpen(true)
    console.log('Category clicked:', category)
  }

  const handleGraphTypeClick = () => {
    setIsGraphTypeModalOpen(true)
  }

  const handleCloseCategoryModal = () => {
    setIsCategoryModalOpen(false)
  }

  const handleCloseGraphTypeModal = () => {
    setIsGraphTypeModalOpen(false)
  }

  const handleSaveGraphs = (graph) => {
    setSelectedGraph(graph)
    console.log('Graph saved:', graph)
  }

  const handleSaveGraphType = (graphType) => {
    setSelectedGraphType(graphType)
    console.log('Graph type saved:', graphType)
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
        kpi: selectedGraph,
      })

      setChartData(response.data)
      setIsDataFetched(true)
      console.log(response.data)

    } catch (error) {
      console.error('Error fetching chart data:', error)
    }
  }

  const handleSearchGraph = async (e) => {
    e.preventDefault()
    await handleFetchChartData()
  }

  return (
    <div className="body">
      <div className="calendar">
        <div className="mood">
          <button className={`mood-btn ${darkMode ? 'dark' : ''}`} onClick={toggleDarkMode}>
            <Sun className="icon" />
            <div className="circle2"></div>
            <Moon className="icon" />
          </button>
        </div>

        <div className="container-ca">
          <div className="title-ca">
            <h1>Selecciona la categoría</h1>
          </div>

          <div className="row-ca">
            <div className="categoria" onClick={() => handleCategoryClick('financial')}>
              <Financial />
              <span className='ca-ti'>Análisis Financiero</span>
            </div>
            <div className="categoria" onClick={() => handleCategoryClick('operative')}>
              <Operative />
              <span className='ca-ti'>Análisis Operativo</span>
            </div>
            <div className="categoria" onClick={() => handleCategoryClick('statistical')}>
              <Statistical />
              <span className='ca-ti'>Análisis Estadístico</span>
            </div>
          </div>

          <div className="title-graph">
            <h1>Selecciona el tipo de gráfico</h1>
          </div>
          <div className="row-graph" onClick={handleGraphTypeClick}>
            <div className="graph">
              Selecciona aquí
              <div className="arrow">
                <ArrowDown />
              </div>
            </div>
          </div>
        </div>

        <div className="footer2-ca">
          <div className="logo-small">
            <Image src={multishop} className="mutishop" alt="Logo de Multishop" />
          </div>
          <div className="button-calendar" onClick={handleSearchGraph}>
            <span>Buscar gráfico</span>
            <ArrowRight />
          </div>
        </div>

        <FooterGraph />
      </div>

      {isCategoryModalOpen && (
        <Modal
          category={selectedCategory}
          onClose={handleCloseCategoryModal}
          onSave={handleSaveGraphs}
          selectedGraph={selectedGraph}
        />
      )}

      {isGraphTypeModalOpen && (
        <GraphTypeModal
          onClose={handleCloseGraphTypeModal}
          onSave={handleSaveGraphType}
          selectedGraphType={selectedGraphType}
        />
      )}
    </div>
  )
}
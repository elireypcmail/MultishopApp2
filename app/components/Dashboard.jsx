import React, { useState } from "react"
import { addDays } from "date-fns"
import { DayPicker } from "react-day-picker"
import "react-day-picker/dist/style.css"
import Navbar from "./Navbar"
import { Dash, Search } from "./Icons"
import dynamic from "next/dynamic"
import { useRouter } from "next/router"

const MyChart = dynamic(() => import("./MyChart"), { ssr: false })

export default function Dashboard() {
  const initialRange = {
    from: new Date(),
    to: addDays(new Date(), 4),
  }

  const [isCalendarOpen, setIsCalendarOpen] = useState(false)
  const [isGraphOpen, setIsGraphOpen] = useState(false)
  const [range, setRange] = useState(initialRange)
  const [selectedGraph, setSelectedGraph] = useState("Selecciona el gráfico")
  const [showGraph, setShowGraph] = useState(false)

  const {push} = useRouter()

  const handleCalendarClick = () => {
    setIsCalendarOpen(!isCalendarOpen)
    setIsGraphOpen(false) 
  }

  const handleGraphClick = () => {
    setIsGraphOpen(!isGraphOpen)
    setIsCalendarOpen(false) 
  }

  const handleDaySelection = (selectedRange) => {
    setRange(selectedRange)
    setIsCalendarOpen(false)
  }

  const closeCalendarModal = () => {
    setIsCalendarOpen(false)
  }

  const closeGraphModal = () => {
    setIsGraphOpen(false)
  }

  const selectGraph = (graphName) => {
    setSelectedGraph(graphName)
    setIsGraphOpen(false)
  }

  const handleSearchClick = () => {
    setShowGraph(true) 
    setIsCalendarOpen(false) 
  }

  const calculateGranularity = (range) => {
    const diffTime = Math.abs(range.to - range.from)
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    if (diffDays <= 15) {
      return "day"
    } else if (diffDays <= 30) {
      return "week"
    } else {
      return "month"
    }
  }

  const granularity = calculateGranularity(range)

  const graphData = {
    "Total de promedio diario por unidad": {
      labels: ["2024-06-01", "2024-07-01", "2024-08-01"],
      datasets: [
        {
          label: "Promedio diario por unidad",
          data: [5.273, 2.75, 2.833],
          backgroundColor: "rgba(75,192,192,0.2)",
          borderColor: "rgba(75,192,192,1)",
        },
      ],
    },
    "Ventas mensuales": {
      labels: ["2024-06-01", "2024-07-01", "2024-08-01"],
      datasets: [
        {
          label: "Ventas mensuales",
          data: [1470, 798.3, 873.3],
          backgroundColor: "rgba(255, 99, 132, 0.2)",
          borderColor: "rgba(255, 99, 132, 1)",
        },
      ],
    },
  }

  const graphOptions = {
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  }

  const logout = () => {
    push('/')
  }

  return (
    <>
      <div className="dash">
        <Navbar />
        <div className="dash-content-title">
          <div className="title">
            <Dash />
            <h1>Dashboard</h1>
          </div>
        </div>
        <div className="dash-content">
          <div className="search">
            <span className="search-date">Busca tu venta por fecha</span>
            <div className="search-input">
              <button className="button-calendar" onClick={handleGraphClick}>
                {selectedGraph}
              </button>
              {isGraphOpen && (
                <div className="modal2">
                  <div className="modal-content2">
                    <button className="close-button" onClick={closeGraphModal}>
                      ×
                    </button>
                    <ul>
                      <li onClick={() => selectGraph("Total de promedio diario por unidad")}>
                        Total de promedio diario por unidad
                      </li>
                      <li onClick={() => selectGraph("Ventas mensuales")}>
                        Ventas mensuales
                      </li>
                    </ul>
                  </div>
                </div>
              )}
            </div>
            <div className="btns">
              <button className="button-calendar" onClick={handleCalendarClick}>
                Seleccionar fecha
              </button>
              <button className="button-search" onClick={handleSearchClick}>
                <Search />
                <span>Buscar</span>
              </button>
            </div>
            {isCalendarOpen && (
              <div className="modal">
                <div className="modal-content">
                  <button className="close-button" onClick={closeCalendarModal}>
                    ×
                  </button>
                  <DayPicker mode="range" selected={range} onSelect={handleDaySelection} />
                </div>
              </div>
            )}
          </div>

          <div className="dash-graph">
            {showGraph && (
                <MyChart data={graphData[selectedGraph]} options={graphOptions} granularity={granularity} />
            )}
          </div>
          <div className="ventas">
            <button className="venta1" onClick={logout}>
              <span>Cerrar Sesión</span>
            </button>
          </div>
        </div>
      </div>
    </>
  )
}
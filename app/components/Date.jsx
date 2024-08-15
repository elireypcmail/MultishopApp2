import "react-day-picker/dist/style.css"
import React, { useState, useEffect } from "react"
import { ArrowRight, Sun, Moon } from "./Icons"
import { addDays } from "date-fns"
import { DayPicker } from "react-day-picker"
import multishop from "@p/Logo Sistema Multishop Pequeno.png"
import Image from "next/image"
import FooterGraph from "./Footer"
import Router from "next/router"

export default function DateComponent() {
  const [darkMode, setDarkMode] = useState(false)
  const [range, setRange] = useState({
    from: new Date(),
    to: addDays(new Date(), 4),
  })

  const { push } = Router

  useEffect(() => {
    const savedDarkMode = localStorage.getItem("darkMode")
    if (savedDarkMode !== null) {
      setDarkMode(JSON.parse(savedDarkMode))
    }

    const savedRange = localStorage.getItem("dateRange")
    if (savedRange) {
      const parsedRange = JSON.parse(savedRange)
      setRange({
        from: new Date(parsedRange.from),
        to: new Date(parsedRange.to),
      })
    }
  }, [])

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark")
    } else {
      document.documentElement.classList.remove("dark")
    }
  }, [darkMode])

  const toggleDarkMode = () => {
    const newMode = !darkMode
    setDarkMode(newMode)
    localStorage.setItem("darkMode", JSON.stringify(newMode))
  }

  const handleNext = () => {
    localStorage.setItem(
      "dateRange",
      JSON.stringify({
        from: range.from.toISOString(),
        to: range.to.toISOString(),
      })
    )

    push("/category")
  }

  return (
    <div className="body">
      <div className="calendar">
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
        <div className="title-calendar">
          <h1>Selecciona el rango de fecha</h1>
        </div>
        <div className="range">
          <div className="range-date">
            <DayPicker mode="range" selected={range} onSelect={setRange} />
          </div>
        </div>
        <div className="footer2">
          <div className="logo-small">
            <Image
              src={multishop}
              className="mutishop"
              alt="Logo de Multishop"
            />
          </div>
          <div className="button-calendar" onClick={handleNext}>
            <span>Siguiente</span>
            <ArrowRight />
          </div>
        </div>
        <FooterGraph />
      </div>
    </div>
  )
}
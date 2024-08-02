import "react-day-picker/dist/style.css"
import React, { useState } from "react"
import { addDays }         from "date-fns"
import { DayPicker }       from "react-day-picker"
import multishop           from '@p/Logo Sistema Multishop Pequeno.png'
import Image               from "next/image"
import { ArrowRight}       from "./Icons"
import FooterGraph         from './Footer'

export default function DateComponent() {
  const initialRange = {
    from: new Date(),
    to: addDays(new Date(), 4),
  }

  const [range, setRange] = useState(initialRange)

  return (
    <div className="body">
      <div className="calendar">
        <div className="title-calendar">
          <h1>Selecciona el rango de fecha</h1>
        </div>
        <div className="range">
          <div className="range-date">
            <DayPicker 
              mode="range" 
              selected={range} 
              onSelect={setRange} 
            />
          </div>
        </div>
        <div className="footer2">
          <div className="logo-small">
            <Image src={multishop} className="mutishop" alt="Logo de Multishop" />
          </div>
          <div className="button-calendar">
            <span>Siguiente</span>
            <ArrowRight />
          </div>
        </div>

        <FooterGraph />
      </div>
    </div>
  )
}
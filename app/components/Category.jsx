'use client'

import { useState, useEffect } from 'react'
import Image                   from 'next/image'
import { useRouter }           from 'next/router'
import { ArrowLeft }           from './Icons'
import multishop               from '@p/Logo Sistema Multishop Pequeno.png'
import FooterGraph             from './Footer'
import { 
  Financial, 
  Operative, 
  Statistical, 
  Sun, 
  Moon 
} from './Icons'

export default function Category() {
  const [selectedCategory, setSelectedCategory] = useState(null)
  const [darkMode, setDarkMode]                 = useState(false)
  const router = useRouter()

  useEffect(() => {
    const savedCategory = localStorage.getItem('selectedCategory')
    if (savedCategory) {
      setSelectedCategory(savedCategory)
    }

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

  const toggleDarkMode = () => {
    const newMode = !darkMode
    setDarkMode(newMode)
    localStorage.setItem("darkMode", JSON.stringify(newMode))
  }

  const handleCategoryClick = (category) => {
    localStorage.setItem('selectedCategory', category)
    setSelectedCategory(category)

    router.push({
      pathname: '/listkpi',
      query: { category }
    })
  }

  const backRouter = (e) => {
    e.preventDefault()
    router.push('/date')
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

        <div className="container-ca">
          <div className="title-ca">
            <h1>Selecciona la categoría</h1>
          </div>

          <div className="row-ca">
            <div 
              className={`categoria ${selectedCategory === 'Financieros' ? 'active' : ''}`}
              onClick={() => handleCategoryClick('Financieros')}
            >
              <Financial />
              <span className='ca-ti'>Análisis Financiero</span>
            </div>
            <div 
              className={`categoria ${selectedCategory === 'Operativos' ? 'active' : ''}`}
              onClick={() => handleCategoryClick('Operativos')}
            >
              <Operative />
              <span className='ca-ti'>Análisis Operativo</span>
            </div>
            <div 
              className={`categoria ${selectedCategory === 'Estadísticos' ? 'active' : ''}`}
              onClick={() => handleCategoryClick('Estadísticos')}
            >
              <Statistical />
              <span className='ca-ti'>Análisis Estadístico</span>
            </div>
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
    </div>
  )
}
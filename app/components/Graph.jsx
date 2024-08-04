import FooterGraph from './Footer'
import ComponentGraph from './GraphSelect'
import { useState, useEffect } from 'react'
import { Sun, Moon } from './Icons'

export default function Graph() {
  const [darkMode, setDarkMode] = useState(false)

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [darkMode])

  const toggleDarkMode = () => {
    setDarkMode(!darkMode)
  }

  return(
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
            <div className="graph__header__title">Graph</div>
            <div className="graph__header__data">
              <span>Dato1: 10</span>
              <span>Dato2: 20</span>
              <span>Dato3: 30</span>
            </div>
          </div>
          <div className="graph__body__content">
            <ComponentGraph />
          </div>
        </div>

        <FooterGraph />
      </div>
    </div>
  )
}
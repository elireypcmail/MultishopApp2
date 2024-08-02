import { User, Sun, Moon } from "./Icons"
import Image from "next/image"
import { useEffect, useState } from "react"
import multishop from '@p/Logo Sistema Multishop Pequeno.png'

export default function Navbar() {
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

  return (
    <nav className="navbar">
      <div className="navbar__logo">
        <div className="circle">
          <User />
        </div>
        <Image className='img2' src={multishop} alt='logo multishop' priority width={103} height={36} />
      </div>
      <div className="mood">
        <button className={`mood-btn ${darkMode ? 'dark' : ''}`} onClick={toggleDarkMode}>
          <Sun className="icon" />
          <div className="circle2"></div>
          <Moon className="icon" />
        </button>
      </div>
    </nav>
  )
}
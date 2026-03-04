import { useEffect, useRef, useState, useCallback } from "react"
import { CloseModal } from "./Icons"
import { AiOutlineLoading3Quarters } from "react-icons/ai"
import { useGenerateTokenMutation, useValidateTokenMutation, useDisableTokenMutation } from "@g/useTokenMutations"
import Cookies from "js-cookie"

const DURATION = 60

const ModalToken = ({ onClose }) => {
  const [timeLeft, setTimeLeft] = useState(DURATION)
  const [code, setCode] = useState(null)
  const [closing, setClosing] = useState(false)
  const [withTransition, setWithTransition] = useState(true)
  const ref = useRef(true)
  const timerRef = useRef(null)
  const generatingRef = useRef(false)

  const identificacion = Cookies.get("instancia")
  const id_user = localStorage.getItem("idUser")

  const { mutateAsync: generateTokenMutate } = useGenerateTokenMutation()
  const { mutateAsync: validateTokenMutate } = useValidateTokenMutation()
  const { mutateAsync: disableTokenMutate } = useDisableTokenMutation()

  const createToken = useCallback(async () => {
    if (generatingRef.current) return
    generatingRef.current = true

    // DESACTIVAMOS transición y bajamos OPACIDAD para el efecto difuminado
    setWithTransition(false)

    try {
      const newCode = Math.floor(100000 + Math.random() * 900000)
      await generateTokenMutate({ identificacion, id_user, codigo: newCode })
      setCode(newCode)
      ref.current = true
      setTimeLeft(DURATION)

      // Reactivamos todo tras un breve instante
      setTimeout(() => {
        setWithTransition(true)
      }, 50)

    } catch (error) {
      console.error("Error generando token", error)
    } finally {
      generatingRef.current = false
    }
  }, [identificacion, id_user, generateTokenMutate])

  const handleClose = useCallback(async (manual = true) => {
    clearInterval(timerRef.current)
    if (manual && code) {
      try { await disableTokenMutate({ identificacion, id_user, codigo: code }) } catch (_) { }
    }
    setClosing(true)
    setTimeout(() => {
      onClose()
      setClosing(false)
    }, 300)
  }, [identificacion, id_user, code, disableTokenMutate, onClose])


  const handleExpire = useCallback(async () => {
    try {
      const res = await validateTokenMutate({ identificacion, id_user, codigo: code })
      if (res.valid) {
        await disableTokenMutate({ identificacion, id_user, codigo: code })
        await createToken()
        return
      }
      handleClose(false)
    } catch (err) {
      console.error("Error al validar token", err)
    }
  }, [code, disableTokenMutate, createToken, handleClose, identificacion, id_user, validateTokenMutate])

  useEffect(() => {
    createToken()
    return () => clearInterval(timerRef.current)
  }, [createToken])

  useEffect(() => {
    if (!code) return
    clearInterval(timerRef.current)

    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 0 && ref.current === true) {
          ref.current = false
          clearInterval(timerRef.current)
          handleExpire()
          return 0
        }
        if (ref.current === false) {
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timerRef.current)
  }, [code, handleExpire, ref, identificacion, id_user])

  /* =========================
      UI PROGRESS (INVERTIDO)
  ========================= */
  const radius = 60
  const circumference = 2 * Math.PI * radius

  // PROGRESO AL REVÉS: 
  // Al inicio (timeLeft=60), dashOffset = circunferencia (vacío)
  // Al final (timeLeft=0), dashOffset = 0 (lleno)
  const progressPercentage = (timeLeft / DURATION)
  const dashOffset = circumference * progressPercentage

  return (
    <div className={`modal-type ${closing ? "fade-out" : "fade-in"}`}>
      <div className={`modal-content-type ${closing ? "fade-out" : "fade-in"}`}>
        <span className="close-button" onClick={() => handleClose(true)}>
          <CloseModal />
        </span>

        <h2 className="ti-graph">Código de Seguridad</h2>

        {code ? (
          <h2 className={`gra-li-token ${!withTransition ? "blur-effect" : ""}`}
            style={{ transition: 'filter 0.3s ease, opacity 0.3s ease', opacity: withTransition ? 1 : 0.3 }}>
            {code.toString().replace(/(\d{3})(\d{3})/, "$1 $2")}
          </h2>
        ) : (
          <AiOutlineLoading3Quarters className="icon-loading" />
        )}

        <div className="progress-container">
          <svg width="140" height="140" style={{ transform: 'rotate(-90deg)' }}>
            <circle className="bg" r={radius} cx="70" cy="70" strokeWidth="8" />
            <circle
              className="progress"
              r={radius}
              cx="70"
              cy="70"
              strokeWidth="8"
              // fill="transparent"
              strokeDasharray={circumference}
              strokeDashoffset={dashOffset}
              strokeLinecap="round"
              style={{
                // Animación de la barra + Difuminado (opacity)
                transition: withTransition ? 'stroke-dashoffset 1s linear, opacity 0.5s ease' : 'none',
                opacity: withTransition ? 1 : 0 // Se desvanece al resetear
              }}
            />
          </svg>
          <span className="progress-text" style={{ opacity: withTransition ? 1 : 0.5, transition: 'opacity 0.3s' }}>
            {timeLeft}s
          </span>
        </div>

        <div className="save-button-container">
          <button onClick={() => handleClose(true)}>Cerrar</button>
        </div>
      </div>
    </div>
  )
}

export default ModalToken
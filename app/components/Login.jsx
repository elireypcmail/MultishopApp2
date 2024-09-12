import { useState } from 'react'
import Image from 'next/image'
import multishop from '@p/Logo Sistema Multishop Pequeno.png'
import { useRouter } from 'next/router'
import VerifyCode from './VerifyCode'
import { loginUser, verifyToken } from '@api/Post'
import {
  UserLogin,
  Identificacion,
  Instancia,
  Telefono,
  Clave,
  CloseModal,
} from '@c/Icons'
import { setCookie } from '@g/cookies'
import toast, {Toaster} from 'react-hot-toast'

export default function Login() {
  const [cliente, setCliente] = useState({
    identificacion: '',
    instancia: '',
    correo: '',
    telefono: '',
    clave: '',
  })
  const [idtError, setIdtError] = useState('')
  const [telError, setTelError] = useState('')
  const [tokenValue, setTokenValue] = useState(null)
  const [verifyOpen, setVerifyOpen] = useState(false)

  const notifySucces = (msg) => { toast.success(msg) }
  const notifyError  = (msg) => { toast.error(msg) }

  const { push } = useRouter()

  const validarIdentificacion = (value) => {
    const regex = /^V-\d*$/
    if (!regex.test(value)) {
      setIdtError('Formato incorrecto de identificación')
    } else {
      setIdtError('')
    }
  }

  const validarTelefono = (value) => {
    const regex = /^\d{4}-\d{7}$/
    if (!regex.test(value)) {
      setTelError('Formato incorrecto del teléfono')
    } else {
      setTelError('')
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setCliente({ ...cliente, [name]: value })
    if (name === 'identificacion') {
      validarIdentificacion(value)
    }
    if (name === 'telefono') {
      validarTelefono(value)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const res = await loginUser(cliente)
      if (res?.tokenCode) {
        console.log('Token obtenido:', res.tokenCode)

        const tokenRes = await verifyToken(res.tokenCode)
        
        if (tokenRes.message == 'Suscripción activa') {
          setCookie('instancia', cliente.instancia)
          push('/date') 
        } else if(tokenRes.message == 'El token ha expirado') {
          notifyError('Su suscripción ha caducado, comunícate con los administradores.')
        } else {
          console.error('Error al verificar el token:', tokenRes.message)
        }
      } 
      console.error('Error en el inicio de sesión:', res.message)
      notifyError(res.message)
    } catch (error) {
      console.error('Error en la solicitud:', error)
    }
  }

  const handleVerifyClick = () => {
    setVerifyOpen(!verifyOpen)
  }

  const closeVerifyModal = () => {
    const modalContent = document.querySelector('.modal-content-verify')
    const modalBackground = document.querySelector('.modal-verify')
    if (modalContent && modalBackground) {
      modalContent.classList.add('fade-out')
      setTimeout(() => {
        modalBackground.classList.add('fade-out-background')
      }, 150)

      setTimeout(() => {
        setVerifyOpen(false)
      }, 300)
    }
  }

  return (
    <div className="body">
      <Toaster position="top-right" reverseOrder={true} duration={5000}/>
      <div className="container">
        <div className="container-form">
          <div className="user">
            <i>
              <UserLogin />
            </i>
          </div>
          <div className="form">
            <form onSubmit={handleSubmit}>
              <div className="input-icon input-msg">
                <i className="idt">
                  <Identificacion />
                </i>
                <input
                  className="input"
                  name="identificacion"
                  type="text"
                  placeholder="V-Identificación"
                  value={cliente.identificacion}
                  onChange={handleChange}
                />
                {idtError && <p className="text-red-500 text-sm">{idtError}</p>}
              </div>

              <div className="input-icon instancia">
                <i className="int">
                  <Instancia />
                </i>
                <input
                  className="input"
                  type="text"
                  placeholder="Instancia"
                  value={cliente.instancia}
                  onChange={handleChange}
                  name="instancia"
                />
              </div>

              <div className="input-icon input-msg2">
                <i className="tel">
                  <Telefono />
                </i>
                <input
                  className="input"
                  name="telefono"
                  value={cliente.telefono}
                  onChange={handleChange}
                  type="tel"
                  placeholder="Teléfono"
                />
                {telError && (
                  <div className="error">
                    <p className="text-red-500 text-sm">{telError}</p>
                  </div>
                )}
              </div>

              <div className="input-icon clave">
                <i className="cla">
                  <Clave />
                </i>
                <input
                  className="input"
                  type="password"
                  placeholder="Clave"
                  value={cliente.clave}
                  onChange={handleChange}
                  name="clave"
                />
              </div>

              <div className="btn">
                <button className="button" type="submit">
                  Iniciar Sesión
                </button>
              </div>
            </form>
          </div>
        </div>

        {verifyOpen && (
          <div className="modal-verify">
            <div className="modal-content-verify">
              <button className="close-button-verify" onClick={closeVerifyModal}>
                <CloseModal />
              </button>
              <VerifyCode />
            </div>
          </div>
        )}

        <div className="logo">
          <Image
            className="img"
            src={multishop}
            alt="logo multishop"
            priority
          />
        </div>
      </div>
    </div>
  )
}

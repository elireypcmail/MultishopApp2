import { useState }       from 'react'
import Image              from 'next/image'
import multishop          from '@p/Logo Sistema Multishop Pequeno.png'
import { useRouter }      from 'next/router'
import VerifyCode         from './VerifyCode'
import { setCookie }      from '@g/cookies'
import toast, { Toaster } from 'react-hot-toast'
import { 
  loginUser, 
  verifyToken 
} from '@api/Post'
import {
  UserLogin,
  Identificacion,
  Instancia,
  Telefono,
  Clave,
  CloseModal,
  HidePassword, 
  VisiblePassword,  
} from '@c/Icons'

export default function Login() {
  const [cliente, setCliente] = useState({
    login_user: '',
    clave: '',
  })
  const [idtError, setIdtError]         = useState('')
  const [telError, setTelError]         = useState('')
  const [tokenValue, setTokenValue]     = useState(null)
  const [verifyOpen, setVerifyOpen]     = useState(false)
  const [showPassword, setShowPassword] = useState(false) 

  const notifySucces  = (msg) => { toast.success(msg) }
  const notifyWarning = (msg) => { toast.warn(msg) }
  const notifyError   = (msg) => { toast.error(msg) }

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
    setCliente({
      ...cliente,
      [name]: value.toUpperCase(), 
    })
  }  

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const res = await loginUser(cliente)
      if (res?.tokenCode) {
        const tokenRes = await verifyToken(res.tokenCode)
        if (tokenRes.message == 'Suscripción activa') {
          setCookie('instancia', res.identificacion)
          localStorage.setItem('defaultGraphType', res.type_graph)
          notifySucces('Haz iniciado sesión!')
  
          setTimeout(() => {
            push('/date')
          }, 3000)
        } else if (tokenRes.message == 'El token ha expirado') {
          notifyError('Su suscripción ha caducado, comunícate con los administradores.')
        } else if(tokenRes.message.startsWith('A partir de hoy te quedan')) {
          console.error('Error al verificar el token:', tokenRes.message)
        }
      }
    } catch (error) {
      if (error) notifyError(error?.response?.data?.message) 
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

  const handlePasswordToggle = () => { setShowPassword((prevShowPassword) => !prevShowPassword) }  

  return (
    <div className="body">
      <Toaster position="top-right" reverseOrder={true} duration={5000} />
      <div className="container">
        <div className="container-form">
          <div className="user">
            <i>
              <UserLogin />
            </i>
          </div>
          <div className="form">
            <form onSubmit={handleSubmit}>
              {/* <div className="input-icon input-msg">
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
              </div> */}

              <div className="input-icon instancia">
                <i className="int">
                  <Identificacion />
                </i>
                <input
                  className="input"
                  type="text"
                  placeholder="Nombre de usuario"
                  value={cliente.login_user}
                  onChange={handleChange}
                  name="login_user"
                />
              </div>

              {/*<div className="input-icon input-msg2">
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
              </div>*/}

              <div className="input-icon clave" style={{ position: 'relative' }}>
                <i className="cla">
                  <Clave />
                </i>
                <input
                  className="input"
                  type={showPassword ? 'text' : 'password'} 
                  placeholder="Clave"
                  value={cliente.clave}
                  onChange={handleChange}
                  name="clave"
                />
                <i className="password-toggle" onClick={handlePasswordToggle}>
                  {showPassword ? <VisiblePassword /> : <HidePassword />}
                </i>
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
          <Image className="img" src={multishop} alt="logo multishop" priority />
        </div>
      </div>
    </div>
  )
}
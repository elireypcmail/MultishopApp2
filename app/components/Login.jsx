import { useEffect, useState } from 'react'
import Image from 'next/image'
import multishop from '@p/Logo Sistema Multishop Pequeno.png'
import { useRouter } from 'next/router'
import { useLoginMutation } from '@g/useLoginMutation'
import { useParametrosQuery } from '@g/useParametrosQuery'
import { UserLogin, Identificacion, Clave, HidePassword, VisiblePassword, ReloadIcon } from '@c/Icons'
import { sileo } from 'sileo'
import ModalTerms from './ModalTerms'

export default function Login() {
  const [cliente, setCliente] = useState({ login_user: '', clave: '' })
  const [showPassword, setShowPassword] = useState(false)
  const [showTermsModal, setShowTermsModal] = useState(false)
  const { push } = useRouter()
  const { mutate: loginMutate, isPending } = useLoginMutation()
  const { data: parametros } = useParametrosQuery()

  const codeVersion = parametros?.data?.version ?? ''

  const notifyError = (msg) =>
    sileo.error({
      title: 'Error',
      description: msg,
    })

  const notifySucces = (msg) =>
    sileo.success({
      title: 'Éxito',
      description: msg,
    })

  const handleChange = (e) => {
    const { name, value } = e.target
    setCliente({ ...cliente, [name]: value.toUpperCase() })
  }

  useEffect(() => {
    if (parametros?.data) {
      localStorage.setItem('version', parametros.data.version)
      localStorage.setItem('timeExpire', parametros.data.tiempo)
    }
  }, [parametros])

  const handleSubmit = (e) => {
    e.preventDefault()

    loginMutate(cliente, {
      onSuccess: ({ tokenRes, status }) => {
        if (status === 'active') {
          notifySucces('Haz iniciado sesión!')
          push('/date')
        } else if (status === 'expired') {
          notifyError('Su suscripción ha vencido. Por favor realice la renovación. Contáctenos')
        } else if (status === 'partial') {
          notifySucces(tokenRes.message)
          push('/date')
        } else {
          notifyError(tokenRes?.message || 'Error en el inicio de sesión.')
        }
      },
      onError: (error) => {
        const message = error?.response?.data?.message || 'Error en la solicitud.'
        notifyError(message)
      },
    })
  }

  const handlePasswordToggle = () => {
    setShowPassword((prev) => !prev)
  }

  return (
    <div className="body">
      <div className="container">
        <div className="container-form">
          <div className="user">
            <i><UserLogin /></i>
          </div>
          <div className="form">
            <form onSubmit={handleSubmit}>
              <div className="input-icon instancia">
                <i className="int"><Identificacion /></i>
                <input
                  className="input"
                  type="text"
                  placeholder="Nombre de usuario"
                  value={cliente.login_user}
                  onChange={handleChange}
                  name="login_user"
                />
              </div>
              <div className="input-icon clave" style={{ position: 'relative' }}>
                <i className="cla"><Clave /></i>
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
                <button className="button" type="submit" disabled={isPending}>
                  Iniciar Sesión
                </button>
              </div>
              <div className='terms_conditions'>
                <a onClick={() => setShowTermsModal(true)}>
                  Términos y Condiciones
                </a>
              </div>
            </form>
          </div>
        </div>

        {isPending && (
          <div className="modal-login-loading">
            <ReloadIcon className="icon-loading" />
          </div>
        )}

        {/* Mostrar ModalTerms si openTerms es true */}
        {showTermsModal && (
          <ModalTerms onClose={() => setShowTermsModal(false)} />
        )}

        <div className="logo">
          <Image className="img" src={multishop} alt="logo multishop" priority />
        </div>
        <div className='terms_conditions'>
          <a>Version {codeVersion}</a>
        </div>
      </div>
    </div>
  )
}

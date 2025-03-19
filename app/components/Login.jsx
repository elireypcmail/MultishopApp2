import { useState } from 'react';
import Image from 'next/image';
import multishop from '@p/Logo Sistema Multishop Pequeno.png';
import { useRouter } from 'next/router';
import { setCookie } from '@g/cookies';
import { loginUser, verifyToken } from '@api/Post';
import { UserLogin, Identificacion, Clave, HidePassword, VisiblePassword, ReloadIcon } from '@c/Icons';
import toast, { Toaster } from 'react-hot-toast'

export default function Login() {
  const [cliente, setCliente] = useState({ login_user: '', clave: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const [modalState, setModalState] = useState({ open: false, message: '', status: '' });
  const { push } = useRouter();

  const notifyError   = (msg) => { toast.error(msg) }
  const notifySucces  = (msg) => { toast.success(msg) }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCliente({ ...cliente, [name]: value.toUpperCase() });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsButtonDisabled(true);
    setModalState({ open: true, message: 'Cargando...', status: 'loading' });
    
    try {
      const res = await loginUser(cliente);
      if (res?.tokenCode) {
        const tokenRes = await verifyToken(res.tokenCode)
        if (tokenRes.message === 'Suscripción activa') {
          setCookie('instancia', res.identificacion);
          localStorage.setItem('defaultGraphType', res.type_graph);
          localStorage.setItem('typeCompanies', res.type_comp);
          setModalState({ open: true, message: '¡Haz iniciado sesión!', status: 'success' });
          notifySucces('Haz iniciado sesión!')
          
          setTimeout(() => {
            push('/date').then(() => {
              setModalState({ open: false, message: '', status: '' });
              setIsButtonDisabled(false);
            });
          }, 500);
        } else if (tokenRes.message === 'El token ha expirado') {
          setModalState({ open: true, message: 'Su suscripción ha vencido. Por favor realice la renovación. Contáctenos', status: 'error' });
          notifyError('Su suscripción ha vencido. Por favor realice la renovación. Contáctenos')
        } else if (tokenRes.message.startsWith('Faltan ')) {
          setModalState({ open: true, message: tokenRes.message , status: 'error' });

          setCookie('instancia', res.identificacion);
          localStorage.setItem('defaultGraphType', res.type_graph);
          localStorage.setItem('typeCompanies', res.type_comp);
          notifyError(tokenRes.message)
          
          setTimeout(() => {
            push('/date').then(() => {
              setModalState({ open: false, message: '', status: '' });
              setIsButtonDisabled(false);
            });
          }, 1000);
        }
      }
    } catch (error) {
      setModalState({ open: true, message: error?.response?.data?.message || 'Error en la solicitud.', status: 'error' });
      notifyError(error?.response?.data?.message)
      console.error('Error en la solicitud:', error);
      setTimeout(() => {
        setModalState({ open: false, message: '', status: '' });
        setIsButtonDisabled(false);
      }, 5000);
    }
  };

  const handlePasswordToggle = () => {
    setShowPassword((prev) => !prev);
  };

  return (
    <div className="body">
      <Toaster position="top-right" reverseOrder={true} duration={5000} />
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
                <button className="button" type="submit" disabled={isButtonDisabled}>
                  Iniciar Sesión
                </button>
              </div>
            </form>
          </div>
        </div>
        
        {modalState.open && modalState.status === 'loading' && (
          <div className="modal-login-loading">
            <ReloadIcon className="icon-loading" />
          </div>
        )}
        
        <div className="logo">
          <Image className="img" src={multishop} alt="logo multishop" priority />
        </div>
      </div>
    </div>
  );
}

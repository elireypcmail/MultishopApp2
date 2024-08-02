import { useState }  from 'react'
import { useRouter } from 'next/router'
import { codeV }     from '@api/Post'
import { UserVerify, VerifyIcon } from "./Icons"

export default function Verify() {
  const [code, setCode]   = useState({ n1: '', n2: '', n3: '', n4: '' })
  const [error, setError] = useState('')
  const [openVerify, setOpenVerify] = useState(false)

  const { push } = useRouter()

  const handleChange = (e) => {
    const { name, value } = e.target
    setCode({ ...code, [name]: value })
  }

  const handleVerify = () => { setOpenVerify(!openVerify) }

  const handleSubmit = async (e) => {
    e.preventDefault()
    /*const fullCode = `${code.n1}${code.n2}${code.n3}${code.n4}`
     try {
      const res = await codeV({ code: fullCode })
      if (res.status === 200) {
        router.push('/success') // Redirige a la página de éxito
      }
    } catch (err) {
      console.error(err)
      setError('Código incorrecto o error en el servidor')
    } */
  }

  return (
      <div className="container-verify">
        <div className="verify-title">
          <div className="circle-verify">
            <UserVerify />
          </div>
          <div className="verify-text">
            Ingresa el código de
            <span>verificación</span>
          </div>
        </div>

        <div className="code-verify">
          <form className="form-code" onSubmit={handleSubmit}>
            <div className="inputs-code">
              <input type="number" className="number n1" name="n1" value={code.n1} onChange={handleChange} />
              <input type="number" className="number n2" name="n2" value={code.n2} onChange={handleChange} />
              <input type="number" className="number n3" name="n3" value={code.n3} onChange={handleChange} />
              <input type="number" className="number n4" name="n4" value={code.n4} onChange={handleChange} />
            </div>
            <div className="button-code">
              <button 
                className="btn-verify" 
                type="submit"
                onClick={handleVerify}
              >
                Verificar
              </button>
              {
                openVerify && (
                  <div className="modal-load">
                    <div className="modal-content-load">
                      <div className="load">
                        <div className="verify">
                          <VerifyIcon />
                        </div>
                        <div className="text-verify">
                          Verificado!
                        </div>
                        <span className='loader'>
                          Espera unos segundos
                          <span class="loading-ellipsis">
                            <i>.</i><i>.</i><i>.</i>
                          </span>
                        </span>
                      </div>
                    </div>
                  </div>
                )
              }
            </div>
            {error && <div className="error">{error}</div>}
          </form>
        </div>
      </div>
  )
}
import React from "react"
import { IoIosCloseCircle } from "react-icons/io"

const ModalTime = ({ onClose }) => {
  return (
    <div className="modal-terms">
      <div className="content-terms">
        <h1>Su sesión ha Expirado!</h1>
        
        <div className="content-terms-text">
          <div
            style={{ 
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <IoIosCloseCircle  
              style={{ 
                fontSize: '70px', 
                color: '#4487B2',
                textAlign: 'center',
                marginBottom: '15px',
              }}
            />
          </div>
          <p>Por favor vuelva a iniciar sesión</p>
        </div>

        <div className="terms-buttons">
          {/* <button onClick={onClose} className="button-terms">
            Aceptar
          </button> */}
        </div>
      </div>
    </div>
  )
}

export default ModalTime

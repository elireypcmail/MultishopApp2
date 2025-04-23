import React from "react"

const ModalTerms = ({ onClose }) => {
  return (
    <div className="modal-terms">
      <div className="content-terms">
        <h1>Términos y Condiciones</h1>
        <div className="content-terms-text">
          <div>
            <p>
              <strong>1. Aceptación de Términos:</strong>
              <br />
              El uso de la aplicación implica la aceptación de los términos a
              continuación descriptos. Si no está de acuerdo con estos términos,
              no debe usar la aplicación.
            </p>

            <br />

            <p>
              <strong>2. Consentimiento de Datos:</strong>
              <br />
              La aceptación de los términos implica que usted acepta y otorga su
              consentimiento explícito a que todos los datos contentivos en la
              base de datos de Multishop, perteneciente a su licencia de uso
              tanto de personas jurídicas como naturales, sean preprocesados y
              transmitidos a la nube con el fin de graficar datos y mostrar
              estadísticas en esta aplicación.
            </p>

            <br />

            <p>
              <strong>3. Cambios en la Información:</strong>
              <br />
              La información proporcionada por la aplicación puede estar sujeta
              a cambios y actualizaciones sin previo aviso, aceptando el uso y
              modalidad de gráficos y datos presentados por la misma.
            </p>

            <br />

            <p>
              <strong>4. Responsabilidad del Usuario:</strong>
              <br />
              Usted es responsable del uso que haga de la información obtenida a
              través de la aplicación.
            </p>

            <br />

            <p>
              <strong>5. Exoneración de Responsabilidad:</strong>
              <br />
              El uso de esta aplicación no acarreará ninguna responsabilidad
              penal, civil o mercantil para el propietario o programador del
              sistema, ni para ninguna de las personas encargadas de dar soporte
              a la misma, así como tampoco para la marca o el producto
              intelectual (programa denominado Multishop) o cualquiera de sus
              productos integrados, actuales o futuros.
            </p>

            <br />

            <p>
              <strong>6. Limitación de Responsabilidad:</strong>
              <ul>
                <li>
                  No nos hacemos responsables por pérdida de datos o
                  suplantación de identidad a la cual estén sometidos los
                  dispositivos a través de los cuales usted tenga acceso a esta
                  aplicación.
                </li>
                <li>
                  Cualquier daño, directo o indirecto, que pueda surgir del uso
                  de la aplicación o de la información contenida en ella.
                </li>
                <li>
                  Cualquier exactitud, completitud o actualización de la
                  información proporcionada por terceros, aun cuando el acceso a
                  dicha información se realice con su consentimiento.
                </li>
                <li>
                  Cualquier uso indebido que el usuario haga de la aplicación o
                  de la información obtenida a través de ella.
                </li>
                <li>
                  Limitaciones técnicas, errores o interrupciones en los
                  servicios proporcionados por terceros, incluso cuando el
                  acceso a estos haya sido autorizado por usted.
                </li>
              </ul>
            </p>

            <br />

            <p>
              <strong>7. Propiedad Intelectual:</strong>
              <br />
              Todos los derechos de propiedad intelectual relacionados con la
              aplicación y su contenido son propiedad de nuestra empresa. Queda
              prohibida la reproducción, distribución o uso no autorizado del
              contenido de la aplicación.
            </p>

            <br />

            <p>
              <strong>8. Legislación Aplicable:</strong>
              <br />
              Estos Términos de Uso y Condiciones se rigen por las leyes de la
              República Bolivariana de Venezuela. Cualquier disputa relacionada
              con estos términos será resuelta por los tribunales competentes en
              Venezuela.
            </p>

            <br />

            <p>
              <strong>9. Modificaciones de los Términos:</strong>
              <br />
              Nos reservamos el derecho de modificar estos Términos de Uso y
              Condiciones en cualquier momento. Las modificaciones serán
              efectivas a partir de su publicación en la aplicación. El uso
              continuado de la aplicación después de la publicación de las
              modificaciones constituye la aceptación de los nuevos términos.
            </p>

            <br />

            <p>
              <strong>10. Contacto:</strong>
              <br />
              Para cualquier consulta o inquietud sobre estos Términos de Uso y
              Condiciones, puede contactarnos a través de{" "}
              <a href="mailto:soportems78@gmail.com">soportems78@gmail.com</a>.
            </p>
          </div>
        </div>

        <div className="terms-buttons">
          <button onClick={onClose} className="button-terms">
            Aceptar
          </button>
          <button onClick={onClose} className="button-terms">
            Rechazar
          </button>
        </div>
      </div>
    </div>
  )
}

export default ModalTerms

import React from "react";
import { CloseModal, Options } from "./Icons";

const ModalSelect = ({ onClose, onSelectGraphType, onRequestToken }) => {
  return (
    <div className="modal-type fade-in">
      <div className="modal-content-type fade-in">
        <span className="close-button" onClick={onClose}>
          <CloseModal />
        </span>

        <h2 className="ti-graph">¿Qué deseas hacer?</h2>

        <ul className="li">
          <li className="separate" onClick={onSelectGraphType}>
            <div className="list">
              <div className="graph-icon">
                <Options />
              </div>
              <div className="gra-li">Seleccionar tipo de gráfico</div>
            </div>
          </li>

          <li className="separate" onClick={onRequestToken}>
            <div className="list">
              <div className="gra-li">Solicitar token</div>
            </div>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default ModalSelect;

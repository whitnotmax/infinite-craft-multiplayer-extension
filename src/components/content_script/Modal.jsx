import "./Modal.css";
import React, { useEffect } from "react";
const Modal = ({ children }) => {

    return (
        <div className="modal">
            <div className="overlay"></div>
            <div className="modal-content">
                {children}
            </div>
        </div>

    )
}

export default Modal;
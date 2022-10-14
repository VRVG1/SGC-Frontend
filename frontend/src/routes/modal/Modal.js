import React, { useEffect, useRef } from "react";
import './Modal.scss'
const Modal = props => {
    const modalRef = useRef();

    useEffect(() => {
        const clickOutsideContent = (e) => {
            if (e.target === modalRef.current) {
                props.setShow(false);
            }
        };
        // window.addEventListener('click', clickOutsideContent);
        // return () => {
        //     window.removeEventListener('click', clickOutsideContent);
        // };
    }, [props])

    return (
        <>
            <div ref={modalRef} className={`Modal ${props.show ? 'active' : ''}`}>
                <div className="content modal">
                    <div className="header modal">
                        <h3>{props.title}</h3>
                    </div>
                    <div className="header modal close"><i className='bx bx-x' onClick={() => props.setShow(false)} ></i></div>
                    <div className="body modal"> {props.children} </div>
                </div>

            </div>
        </>
    );
}

export default Modal
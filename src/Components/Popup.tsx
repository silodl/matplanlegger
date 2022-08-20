import React from 'react';
import './Popup.css';
import '../App.css';

type PopupProps = {
    children: React.ReactNode,
    close: Function,
}

export const Popup = (props: PopupProps) => {

    return(
        <>
        <div className="popupWrapper" onClick={() => props.close()}/>
        <div className="popup" id="popup">
            <div className="closeButton" onClick={() => props.close()}> X </div>
            {props.children}
        </div>
        </>
    )
}
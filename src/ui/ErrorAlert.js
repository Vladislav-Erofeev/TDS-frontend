import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from "react-redux";
import {Alert, Collapse} from "@mui/material";
import {setErrorAction} from "../redux/messageReducer";

const ErrorAlert = () => {
    const [show, setShow] = useState(false)
    const message = useSelector(state => state.messages.error)
    const dispatch = useDispatch()
    useEffect(() => {
        if (message !== null) {
            setShow(true)
            setTimeout(() => {
                setShow(false)
                setTimeout(() => {
                    dispatch(setErrorAction(null))
                }, 200)
            }, 2000)
        }
    }, [message])
    return (
        <Collapse style={{
            position: 'fixed',
            top: '5%',
            left: '50%',
            transform: 'translateX(-50%)',
            width: 'max-content',
            zIndex: 10
        }} in={show}
        >
            <Alert style={{
                backgroundColor: 'rgba(49,14,14,0.65)',
                color: 'white'
            }} severity={'error'} action={
                <img style={{
                    filter: 'invert(100%)',
                    cursor: 'pointer'
                }} src={'/icons/close.svg'} width={'30px'} onClick={() => {
                    setShow(false)
                }}/>
            }>{message}
            </Alert>
        </Collapse>
    );
};

export default ErrorAlert;
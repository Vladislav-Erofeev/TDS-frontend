import React, {useEffect, useState} from 'react';
import {Alert, Collapse} from "@mui/material";
import {useDispatch, useSelector} from "react-redux";
import {setSuccessAction} from "../redux/messageReducer";

const SuccessAlert = () => {
    const [show, setShow] = useState(false)
    const message = useSelector(state => state.messages.success)
    const dispatch = useDispatch()
    useEffect(() => {
        if (message !== null) {
            setShow(true)
            setTimeout(() => {
                setShow(false)
                setTimeout(() => {
                    dispatch(setSuccessAction(null))
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
                backgroundColor: 'rgba(25,138,17,0.65)',
                color: 'white'
            }} severity={'success'} action={
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

export default SuccessAlert;
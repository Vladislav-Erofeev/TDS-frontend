import React from 'react';
import {Backdrop} from "@mui/material";
import styles from './style/geocodingReportModal.module.css'

const GeocodingReportModal = ({open, url, setOpen}) => {
    return (
        <Backdrop sx={{
            zIndex: '1'
        }} open={open}>
            <div className={styles.main}>
                <button className={styles.close_btn} onClick={() => {
                    setOpen(false)
                }}>
                    <img src={'/icons/close.svg'} width={'25px'}/>
                </button>
                <iframe frameBorder={'0'} width={'100%'} height={'100%'}
                        style={{
                            width: '100%',
                            height: '100%'
                        }} src={`${process.env.REACT_APP_STATIC_URL}/${url}`}></iframe>
            </div>
        </Backdrop>
    );
};

export default GeocodingReportModal;
import React from 'react';
import {Backdrop} from "@mui/material";
import styles from './styles/selectCodesComponent.module.css'

const SelectCodesComponent = ({open, setOpen, codes, onSelect}) => {
    return (
        <Backdrop open={open}>
            <div className={styles.main}>
                <h1>Выберите код</h1>
                <button className={styles.close_btn} onClick={() => {
                    setOpen(false)
                }}>
                    <img src={'/icons/close.svg'} width={'25px'}/>
                </button>
                <div className={styles.list}>
                    {codes === undefined ? null :
                        codes.map(item => <div onClick={() => {
                            onSelect(item)
                            setOpen(false)
                        }} className={styles.code} key={item.id}>
                            <p>{item.code} - {item.name}</p>
                        </div>)
                    }
                </div>
            </div>
        </Backdrop>
    );
};

export default SelectCodesComponent;
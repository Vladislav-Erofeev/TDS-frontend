import React, {useEffect, useState} from 'react';
import {Backdrop} from "@mui/material";
import styles from './styles/selectLayerModal.module.css'
import {LayerService} from "../services/LayerService";

const SelectLayerModal = ({open,setLayer, setOpen}) => {
    const [layers, setLayers] = useState([])
    useEffect(() =>{
        let fetch = async () => {
            setLayers(await LayerService.getAll())
        }

        fetch()
    }, [])
    return (
        <Backdrop open={open} sx={{
            zIndex: 1
        }}>
            <div className={styles.main}>
                <button className={styles.close_btn} onClick={() => {
                    setOpen(false)
                }}>
                    <img src={'/icons/close.svg'} width={'25px'}/>
                </button>
                <h1>Выберите слой</h1>
                <div className={styles.layer_lsit}>
                    {layers.map(layer =>
                        <div className={styles.layer} onClick={() => {
                            setLayer(layer)
                            setOpen(false)
                        }}>
                            <p>{layer.name} - {layer.hname}</p>
                        </div>
                    )}
                </div>
            </div>
        </Backdrop>
    );
};

export default SelectLayerModal;
import React, {useEffect, useState} from 'react';
import {LayerService} from "../../services/LayerService";
import styles from './styles/layerSelection.module.css'
import {useDispatch} from "react-redux";
import {setErrorAction} from "../../redux/messageReducer";

const LayerSelection = ({setSelected}) => {
    const [layers, setLayers] = useState([])
    const dispatch = useDispatch()
    useEffect(() => {
        const fetch = async () => {
            try {
                setLayers(await LayerService.getAll())
            } catch (e) {
                dispatch(setErrorAction('Ошибка! Сервис временно недоступен'))
            }
        }
        fetch()
    }, [])

    return (
        <div className={styles.list}>
            {layers.map(item =>
                <div className={styles.layer} onClick={() => {
                    setSelected(item)
                }} key={item.id}>
                    <p>{item.name} - {item.hname}</p>
                    <p>{item.geometryType}</p>
                </div>
            )}
        </div>
    );
};

export default LayerSelection;
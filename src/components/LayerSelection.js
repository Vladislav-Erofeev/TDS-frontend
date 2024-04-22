import React, {useEffect, useState} from 'react';
import {LayerService} from "../services/LayerService";
import styles from './styles/layerSelection.module.css'

const LayerSelection = ({setSelected}) => {
    const [layers, setLayers] = useState([])
    useEffect(() => {
        const fetch = async () => {
            setLayers(await LayerService.getAll())
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
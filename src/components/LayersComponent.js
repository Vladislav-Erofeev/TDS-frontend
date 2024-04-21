import React, {useEffect, useState} from 'react';
import {LayerService} from "../services/LayerService";
import styles from './styles/layerComponent.module.css'
import AddLayerModal from "./AddLayerModal";
import {NavLink} from "react-router-dom";
import {hasRole} from "../data/functions";

const LayersComponent = () => {
    const [layers, setLayers] = useState([])
    const [openAddLayerModal, setOpenAddLayerModal] = useState(false)
    useEffect(() => {
        let fetch = async () => {
            setLayers(await LayerService.getAll())
        }

        fetch()
    }, [])

    const addLayerToArray = (layer) => {
        setLayers(array => {
            return [...array, layer]
        })
    }

    const deleteLayer = (id) => {
        LayerService.deleteLayer(id)
        setLayers(array => {
            let arr = [...array]
            arr.splice(arr.findIndex(i => i.id === id), 1)
            return arr
        })
    }
    return (
        <div>
            <div className={styles.list}>
                {
                    layers.map(item => <NavLink to={`layers/${item.id}`} key={item.id}
                                                className={styles.layer}>
                        <p>{item.name} - {item.hname}</p>
                        <p>{item.creationDate}</p>
                        <div>
                            <button onClick={(e) => {
                                e.preventDefault()
                                deleteLayer(item.id)
                            }}>
                                <img src={'/icons/remove.svg'} width={'20px'}/>
                            </button>
                        </div>
                    </NavLink>)
                }
            </div>
            {hasRole("ADMIN") ? <button className={styles.add_layer} onClick={() => {
                setOpenAddLayerModal(true)
            }}>
                <span><img src={'/icons/add.svg'} width={'20px'}/> Добавить слой</span>
            </button> : null}
            <AddLayerModal add={addLayerToArray} open={openAddLayerModal} close={setOpenAddLayerModal}/>
        </div>
    );
};

export default LayersComponent;
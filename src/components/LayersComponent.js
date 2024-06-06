import React, {useEffect, useState} from 'react';
import {LayerService} from "../services/LayerService";
import styles from './styles/layerComponent.module.css'
import AddLayerModal from "./AddLayerModal";
import {NavLink} from "react-router-dom";
import {hasRole} from "../data/functions";
import {useDispatch, useSelector} from "react-redux";
import {setErrorAction} from "../redux/messageReducer";

const LayersComponent = () => {
    const user = useSelector(state => state.user)
    const [layers, setLayers] = useState([])
    const [openAddLayerModal, setOpenAddLayerModal] = useState(false)
    const dispatch = useDispatch()
    useEffect(() => {
        let fetch = async () => {
            try {
                setLayers(await LayerService.getAll())
            } catch (e) {
                dispatch(setErrorAction('Ошибка! Сервис временно недоступен'))
            }
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
                { layers.length === 0 ? <h2 style={{textAlign: 'center'}}>Список пуст</h2> :
                    layers.map(item => <NavLink to={`layers/${item.id}`} key={item.id}
                                                className={styles.layer}>
                        <p>{item.name} - {item.hname}</p>
                        <p>{item.creationDate}</p>
                        <div>
                            {hasRole('ADMIN') ?
                                <button onClick={(e) => {
                                    e.preventDefault()
                                    deleteLayer(item.id)
                                }}>
                                    <img src={'/icons/remove.svg'} width={'20px'}/>
                                </button>
                                :null}

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
import React, {useEffect, useState} from 'react';
import styles from './styles/searchFilterComponent.module.css'
import {LayerService} from "../services/LayerService";

const SearchFilterComponent = ({selectedCodes, setSelectedCodes}) => {
    const [open, setOpen] = useState()
    const [layers, setLayers] = useState([])
    const [codes, setCodes] = useState([])
    const [selectedLayerId, setSelectedLayerId] = useState(null)

    useEffect(() => {
        const fetchLayers = async () => {
            setLayers(await LayerService.getAll())
        }

        fetchLayers()
    }, [])

    const fetchCodes = async (id) => {
        setCodes((await LayerService.getLayerById(id)).codes)
    }

    const selectCode = (id) => {
        setSelectedCodes(codes => {
            if (codes.indexOf(id) >= 0) {
                let newArr = [...codes]
                newArr.splice(codes.indexOf(id), 1)
                return newArr
            } else {
                return [...codes, id]
            }
        })
    }

    return (
        <div>
            <div className={styles.btn}>
                <div className={selectedCodes.length === 0 ? styles.hide_counter : styles.counter}>
                    {selectedCodes.length > 99 ? '99+' : selectedCodes.length}
                </div>
                <button className={open ? styles.active_btn : styles.open_btn} onClick={() => {
                    if (open) {
                        setOpen(false)
                        setCodes([])
                        setSelectedLayerId(null)
                    } else {
                        setOpen(true)
                    }
                }}>
                    <img src={'/icons/filter.svg'} width={'25px'}/>
                </button>
            </div>
            <div className={open ? styles.filter_window : styles.hide}>
                <div className={styles.layers_select}>
                    {layers.map(item => <p
                        className={selectedLayerId === item.id ? styles.selected : null}
                        key={item.id}
                        onClick={() => {
                            setSelectedLayerId(item.id)
                            fetchCodes(item.id)
                        }}>{item.name}</p>)}
                    <p onClick={() =>{
                        setSelectedCodes([])
                    }}>Сбросить всё</p>
                </div>
                <div className={styles.divider}/>
                {codes.length === 0 ? null :
                    <div className={styles.layers_select}>
                        {codes.map(item => <p className={selectedCodes.indexOf(item.id) >= 0 ? styles.selected : null}
                                              key={item.id} onClick={() => {
                            selectCode(item.id)
                        }}>{item.code} - {item.name}</p>)}
                    </div>
                }
            </div>
        </div>
    );
};

export default SearchFilterComponent;
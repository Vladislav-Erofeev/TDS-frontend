import React, {useEffect, useState} from 'react';
import {useParams} from "react-router";
import {LayerService} from "../services/LayerService";
import {CircularProgress} from "@mui/material";
import styles from './styles/layerPage.module.css'
import AddCodeModal from "../components/AddCodeModal";

const LayerPage = () => {
    const {id} = useParams()
    const [layer, setLayer] = useState(null)
    const [openCodeModal, setOpenCodeModal] = useState(false)
    useEffect(() => {
        const fetch = async () => {
            setLayer(await LayerService.getLayerById(id))
        }
        fetch()
    }, [])

    const addCode = (code) => {
        setLayer(layer => {
            return {...layer, codes: [...layer.codes, code]}
        })
    }
    return (
        <>
            {layer === null ? <CircularProgress/> :
                <div className={styles.main}>
                    <div>
                        <h1>Слой: {layer.name}</h1>
                        <div>
                            <p>Расшифровка названия:</p>
                            <p>{layer.hname}</p>
                        </div>
                        <div>
                            <p>Тип геометрии: </p>
                            <p>{layer.geometryType}</p>
                        </div>
                        <div>
                            <p>Описание: </p>
                            <p>{layer.description}</p>
                        </div>
                        <div>
                            <p>Дата создания: </p>
                            <p>{layer.creationDate}</p>
                        </div>
                    </div>

                    <div>
                        <h1>Кодовый состав</h1>
                        <div className={styles.codes_list}>
                            {layer.codes.map(code =>
                                <div className={styles.code} key={code.id}>
                                    <p>{code.code} - {code.name}</p>
                                    <p>{code.creationDate}</p>
                                    <button style={{
                                        background: 'none',
                                        border: 'none'
                                    }}>
                                        <img src={'/icons/remove.svg'} width={'20px'}/>
                                    </button>
                                </div>)}
                        </div>
                        <button className={styles.add_code} onClick={() => {
                            setOpenCodeModal(true)
                        }}>
                            <span><img src={'/icons/add.svg'} width={'20px'}/> Добавить код</span>
                        </button>
                    </div>
                </div>
            }
        <AddCodeModal add={addCode} layer={layer} open={openCodeModal} setOpen={setOpenCodeModal}/>
        </>
    );
};

export default LayerPage;
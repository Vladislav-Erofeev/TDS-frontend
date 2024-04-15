import React, {useEffect, useState} from 'react';
import {useParams} from "react-router";
import {LayerService} from "../services/LayerService";
import {Breadcrumbs, CircularProgress, Link, TextField} from "@mui/material";
import styles from './styles/layerPage.module.css'
import AddCodeModal from "../components/AddCodeModal";
import {Link as RouterLink,} from 'react-router-dom';

const LayerPage = () => {
    const {id} = useParams()
    const [layer, setLayer] = useState(null)
    const [openCodeModal, setOpenCodeModal] = useState(false)
    const [editMode, setEditMode] = useState(false)
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

    const saveChanges = () => {
        const push = async () => {
            let data = {...layer, codes: null, attributes: null}
            LayerService.patchLayer(layer.id, data)
        }
        push()
    }
    return (
        <>

            {layer === null ? <CircularProgress/> :
                <div className={styles.main}>
                    <Breadcrumbs aria-label="breadcrumb">
                        <Link underline="hover" color="inherit" component={RouterLink} to={'/admin'}>Главная</Link>
                        <Link underline="hover" color="inherit" component={RouterLink} to={'/admin/classifier'}>Слои</Link>
                        <Link underline="hover" component={RouterLink} to={`/admin/classifier/layers/${layer.id}`}>{layer.name}</Link>
                    </Breadcrumbs>
                    {editMode ? <TextField label={'Название'}
                                           value={layer.name}
                                           onChange={(e) => {
                                               setLayer({...layer, name: e.target.value})
                                           }}/> :
                        <h1>Слой: {layer.name}</h1>}
                    <div className={styles.info}>
                        <div>
                            <p>Расшифровка названия:</p>
                            {editMode ? <TextField value={layer.hname} onChange={(e) => {
                                    setLayer({...layer, hname: e.target.value})
                                }}/> :
                                <p>{layer.hname}</p>}
                        </div>
                        <div>
                            <p>Тип геометрии: </p>
                            {editMode ? <TextField SelectProps={{native: true}}
                                                   select value={layer.geometryType}
                                                   onChange={(e) => {
                                                       setLayer({...layer, geometryType: e.target.value})
                                                   }}>
                                    <option key={'POLYGON'} value={'POLYGON'}>POLYGON</option>
                                    <option key={'POINT'} value={'POINT'}>POINT</option>
                                    <option key={'LINE'} value={'LINE'}>LINE</option>
                                </TextField> :
                                <p>{layer.geometryType}</p>}
                        </div>
                        <div>
                            <p>Описание: </p>
                            {editMode ? <TextField value={layer.description} onChange={(e) => {
                                    setLayer({...layer, description: e.target.value})
                                }}/> :
                                <p>{layer.description}</p>}
                        </div>
                        <div>
                            <p>Дата создания: </p>
                            <p>{layer.creationDate}</p>
                        </div>
                    </div>
                    <button className={styles.edit_btn} onClick={() => {
                        if (editMode)
                            saveChanges()
                        setEditMode(!editMode)
                    }}>
                        {editMode ? 'сохранить' : 'редактировать'}
                    </button>

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
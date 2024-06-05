import React, {useEffect, useState} from 'react';
import {useParams} from "react-router";
import {LayerService} from "../services/LayerService";
import {Breadcrumbs, CircularProgress, Link, TextField} from "@mui/material";
import styles from './styles/layerPage.module.css'
import AddCodeModal from "../components/AddCodeModal";
import {Link as RouterLink,} from 'react-router-dom';
import CodeComponent from "../components/CodeComponent";
import {CodeService} from "../services/CodeService";
import SelectAttributesModal from "../components/SelectAttributesModal";
import {hasRole} from "../data/functions";
import {useSelector} from "react-redux";
import {AttributeService} from "../services/AttributeService";

const LayerPage = () => {
    const user = useSelector(state => state.user)
    const {id} = useParams()
    const [layer, setLayer] = useState(null)
    const [openCodeModal, setOpenCodeModal] = useState(false)
    const [editMode, setEditMode] = useState(false)
    const [openAddAttributeModal, setOpenAddAttributeModal] = useState(false)
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
            let data = {...layer, codes: null}
            LayerService.patchLayer(layer.id, data)
        }
        push()
    }

    const removeCode = (id) => {
        let push = async () => {
            CodeService.deleteCode(id)
        }

        push()
        setLayer(layer => {
            let newLayer = {...layer}
            newLayer.codes.splice(newLayer.codes.indexOf(c => c.id === id), 1)
            return newLayer
        })
    }

    const saveSelectedLayers = (selected) => {
        let newLayer = {...layer, attributes: selected}
        setLayer(newLayer)

        const push = async () => {
            await LayerService.patchLayer(layer.id, {...newLayer, codes: null})
        }

        push()
    }

    const removeAttribute = (item) => {
        const push =  async () => {
            await AttributeService.removeAttribute(item.id)
        }
        push()
        setLayer(layer => {
            let arr = [...layer.attributes]
            arr.splice(arr.findIndex(attr => item.id === attr.id), 1)
            return {...layer, attributes: arr}
        })
    }
    return (
        <>

            {layer === null ? <CircularProgress sx={{
                position: 'absolute',
                left: '50%',
                transform: 'translateX(-50%)'
            }}/> : <>
                <div className={styles.main}>
                    <Breadcrumbs aria-label="breadcrumb">
                        <Link underline="hover" color="inherit" component={RouterLink} to={'/'}>Главная</Link>
                        <Link underline="hover" color="inherit" component={RouterLink}
                              to={'/classifier'}>Слои</Link>
                        <Link underline="hover" component={RouterLink}
                              to={`/classifier/layers/${layer.id}`}>{layer.name}</Link>
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
                    {hasRole("ADMIN") ? <button className={styles.edit_btn} onClick={() => {
                        if (editMode)
                            saveChanges()
                        setEditMode(!editMode)
                    }}>
                        {editMode ? 'сохранить' : 'редактировать'}
                    </button> : null}
                    <div>
                        <h1>Кодовый состав</h1>
                        <div className={styles.codes_list}>
                            {layer.codes.length === 0 ?
                                <h2 className={styles.empty_list}>Список пуст</h2>
                                :
                                layer.codes.map(code => <CodeComponent key={code.id} remove={removeCode} code={code}/>)}
                        </div>
                        {hasRole("ADMIN") ? <button className={styles.add_code} onClick={() => {
                            setOpenCodeModal(true)
                        }}>
                            <span><img src={'/icons/add.svg'} width={'20px'}/> Добавить код</span>
                        </button> : null}
                    </div>
                    <div>
                        <h1>Атрибуты слоя</h1>
                        <div className={styles.codes_list}>
                            {layer.attributes.length === 0 ? <h2 style={{textAlign: 'center'}}>Список пуст</h2> :
                                layer.attributes.map(item => <div key={item.id} className={styles.attribute_item}>
                                <p>{item.name} - {item.hname} {item.required ? '*' : null}</p>
                                <p>{item.dataType}</p>
                                <p>{item.creationDate}</p>
                                    {
                                        hasRole('ADMIN') ?
                                            <button className={styles.remove_btn} onClick={() => {
                                                removeAttribute(item)
                                            }}>
                                                <img src={'/icons/remove.svg'} width={'20px'}/>
                                            </button>
                                            : null
                                    }
                            </div>)}
                        </div>
                        {hasRole("ADMIN") ? <button className={styles.add_code} onClick={() => {
                            setOpenAddAttributeModal(true)
                        }}>
                            <span><img src={'/icons/add.svg'} width={'20px'}/> Добавить атрибут</span>
                        </button> : null}
                    </div>
                </div>
                <AddCodeModal add={addCode} layer={layer} open={openCodeModal} setOpen={setOpenCodeModal}/>
                <SelectAttributesModal selected={layer.attributes} callback={saveSelectedLayers}
                                       open={openAddAttributeModal}
                                       setOpen={setOpenAddAttributeModal}/>
            </>
            }
        </>
    )

};

export default LayerPage;
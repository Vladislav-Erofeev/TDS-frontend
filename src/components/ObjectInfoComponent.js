import React, {useState} from 'react';
import styles from './styles/objectInfoComponent.module.css'
import LayerSelection from "./LayerSelection";
import {CircularProgress, TextField} from "@mui/material";
import {LayerService} from "../services/LayerService";
import SelectCodesComponent from "./SelectCodesComponent";

const nullObjects = {
    code: null,
    attributes: {}
}
const ObjectInfoComponent = () => {
    const [expanded, setExpanded] = useState(false)
    const [selectedLayer, setSelectedLayer] = useState(null)
    const [object, setObject] = useState(nullObjects)
    const [openSelectCodes, setOpenSelectCodes] = useState(false)
    const [isLoading, setIsLoading] = useState(true)

    const setLayer = (item) => {
        const fetch = async () => {
            let res = await LayerService.getLayerById(item.id)
            setSelectedLayer(res)
            setIsLoading(false)
        }
        setSelectedLayer(item)
        setIsLoading(true)
        fetch()
    }

    const setCode = (code) => {
        setObject({...object, code: code})
    }

    const handleChange = (name, value) => {
        let obj = {...object}
        obj.attributes[name] = value
        setObject(obj)
    }
    return (
        <>
            <div className={styles.main} style={
                expanded ? {left: '0px'} : {left: '-470px'}
            }>
                <button className={styles.expand_btn} onClick={() => {
                    setExpanded(!expanded)
                }}>
                    <img src={'/icons/expand.svg'} style={
                        expanded ? {transform: 'rotate(180deg)'} : {}
                    } width={'20px'}/>
                </button>
                {selectedLayer === null ? <div>
                    <h1>Выберите слой</h1>
                    <LayerSelection setSelected={setLayer}/>
                </div> : <div className={styles.object_data}>
                    <button onClick={() => {
                        setSelectedLayer(null)
                        setObject(nullObjects)
                    }} className={styles.back_btn}>
                        <img src={'/icons/back_arrow.svg'} width={'20px'}/>
                        назад
                    </button>
                    <h1>Введите данные</h1>
                    <h3>Слой: {selectedLayer.name} - {selectedLayer.hname}</h3>
                    <h3>Код: {object.code === null ? <button className={styles.select_code} onClick={() => {
                        setOpenSelectCodes(true)
                    }}>Выбрать код</button> : `${object.code.code} - ${object.code.name}`}</h3>
                    {isLoading ? <CircularProgress sx={{
                        margin: '20px auto'
                    }}/> : <div className={styles.attributes}>
                        {selectedLayer.attributes.map(attribute =>
                            <TextField fullWidth
                                       key={attribute.id}
                                       value={object[attribute.name]}
                                       onChange={(e) => {
                                           handleChange(attribute.name, e.target.value)
                                       }}
                                       label={attribute.name}
                                       helperText={attribute.description}/>)}
                    </div>}
                    <button className={styles.save_btn} onClick={() => {
                        console.log(object)
                    }}>
                        Сохранить
                    </button>
                    <SelectCodesComponent onSelect={setCode}
                                          codes={selectedLayer.codes}
                                          setOpen={setOpenSelectCodes}
                                          open={openSelectCodes}/>
                </div>}

            </div>
        </>
    );
};

export default ObjectInfoComponent;
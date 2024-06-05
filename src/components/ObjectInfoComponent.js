import React, {useEffect, useRef, useState} from 'react';
import styles from './styles/objectInfoComponent.module.css'
import LayerSelection from "./LayerSelection";
import {Checkbox, CircularProgress, FormControlLabel, TextField} from "@mui/material";
import {LayerService} from "../services/LayerService";
import SelectCodesComponent from "./SelectCodesComponent";
import {GeodataService} from "../services/GeodataService";
import VectorSource from "ol/source/Vector";
import VectorLayer from "ol/layer/Vector";
import {Fill, Stroke, Style} from "ol/style";
import Draw from 'ol/interaction/Draw.js'
import {GeoJSON} from "ol/format";
import {useDispatch} from "react-redux";
import {setErrorAction, setSuccessAction} from "../redux/messageReducer";

const nullObjects = {
    code: null,
    feature: null,
    name: '',
    addrCountry: '',
    addrCity: '',
    addrStreet: '',
    addrHousenumber: '',
    properties: {}
}
const ObjectInfoComponent = ({map, geoLayer}) => {
    const [expanded, setExpanded] = useState(false)
    const [selectedLayer, setSelectedLayer] = useState(null)
    const [object, setObject] = useState(nullObjects)
    const [openSelectCodes, setOpenSelectCodes] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const source = useRef()
    const drawRef = useRef()
    const [errors, setErrors] = useState({})
    const [isPushing, setIsPushing] = useState(false)
    const dispatch = useDispatch()

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
        obj.properties[name] = value
        setObject(obj)
    }

    const save = () => {
        let push = async () => {
            let hasErrors = false
            if (object.code === null) {
                dispatch(setErrorAction('Ошибка! Вы не выбрали код'))
                setIsPushing(false)
                return
            } else if (object.feature === null) {
                dispatch(setErrorAction('Ошибка! Геометрия не может быть пустой'))
                setIsPushing(false)
                return
            }
            selectedLayer.attributes.forEach((attribute) => {
                if (!object.properties[attribute.name]) {
                    if (attribute.required) {
                        hasErrors = true
                        setErrors(errors => {
                            let err = {...errors}
                            err[attribute.name] = 'Поле не может быть пустым'
                            return err
                        })
                    }
                    return;
                }
                    return;
                if (attribute.dataType === 'STRING')
                    return
                let value;
                switch (attribute.dataType) {
                    case 'INTEGER':
                        value = parseInt(object.properties[attribute.name])
                        break
                    case 'DOUBLE':
                        value = parseFloat(object.properties[attribute.name])
                        break
                    default:
                        return;
                }
                if (isNaN(value)) {
                    hasErrors = true
                    setErrors(errors => {
                        let err = {...errors}
                        err[attribute.name] = `Неверный тип данных. Тип данных должен быть: ${attribute.dataType}`
                        return err
                    })
                } else {
                    setErrors(errors => {
                        let err = {...errors}
                        err[attribute.name] = null
                        return err
                    })
                    object.properties[attribute.name] = value
                }
            })
            if (!hasErrors) {
                let res = await GeodataService.save(object)
                let writer = new GeoJSON()
                let f = writer.readFeature(res, {dataProjection: 'EPSG:4326', featureProjection: 'EPSG:3857'})
                f.setId(res.properties.id)
                geoLayer.getSource().addFeature(f)
                setObject(nullObjects)
                setSelectedLayer(null)
                dispatch(setSuccessAction('Успех! Объект успешно сохранён'))
            } else {
                dispatch(setErrorAction('Ошибка! Неверные данные'))
            }
            setIsPushing(false)
        }
        setIsPushing(true)
        push()
    }

    const addDraw = () => {
        if (drawRef.current != null)
            map.removeInteraction(drawRef.current)
        let type = () => {
            switch (selectedLayer.geometryType) {
                case "POLYGON":
                    return 'Polygon'
                case 'LINE':
                    return 'LineString'
            }
        }
        let draw = new Draw({
            source: source.current,
            type: type()
        })
        draw.on("drawend", (e) => {
            map.removeInteraction(draw)
            drawRef.current = null
            let writer = new GeoJSON()
            let feature = writer.writeFeature(e.feature, {dataProjection: 'EPSG:4326', featureProjection: 'EPSG:3857'})
            setObject(object => ({...object, feature: JSON.parse(feature)}))
        })
        map.addInteraction(draw)
        drawRef.current = draw
    }

    const removeDraw = () => {
        if (map !== null) {
            source.current.clear()
            map.removeInteraction(drawRef.current)
        }
        drawRef.current = null
    }

    useEffect(() => {
        if (map === null)
            return
        const geoSource = new VectorSource()
        const layer = new VectorLayer({
            source: geoSource,
            style: new Style({
                fill: new Fill({
                    color: 'rgba(255,255,255,0.49)'
                }),
                stroke: new Stroke({
                    color: '#3a88c5',
                    width: 3
                })
            })
        })
        source.current = geoSource
        map.addLayer(layer)
        return () => {
            removeDraw()
            map.removeLayer(layer)
        }
    }, [map])

    useEffect(() => {
        if (selectedLayer !== null)
            addDraw()
        else
            removeDraw()
    }, [selectedLayer])
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
                        setErrors({})
                    }} className={styles.back_btn}>
                        <img src={'/icons/back_arrow.svg'} width={'20px'}/>
                        назад
                    </button>
                    <h1>Введите данные</h1>
                    <h3>Слой: {selectedLayer.name} - {selectedLayer.hname}</h3>
                    <h3>Код: {object.code === null ? <button className={styles.select_code} onClick={() => {
                        setOpenSelectCodes(true)
                    }}>Выбрать код</button> : `${object.code.code} - ${object.code.name}`}</h3>
                    <h3>Геометрия: {object.feature === null ? 'Не задана' :
                        <button className={styles.remove_feature} onClick={() => {
                            source.current.clear()
                            addDraw()
                            setObject({...object, feature: null})
                        }}>
                            Удалить
                        </button>}</h3>
                    {isLoading ? <CircularProgress sx={{
                        margin: '20px auto'
                    }}/> : <div className={styles.attributes}>
                        <TextField fullWidth label={'Имя'} value={object.name}
                                   onChange={(e) => {
                                       setObject({...object, name: e.target.value})
                                   }}/>
                        <TextField fullWidth label={'Страна'} value={object.addrCountry}
                                   onChange={(e) => {
                                       setObject({...object, addrCountry: e.target.value})
                                   }}/>
                        <TextField fullWidth label={'Город'} value={object.addrCity}
                                   onChange={(e) => {
                                       setObject({...object, addrCity: e.target.value})
                                   }}/>
                        <TextField fullWidth label={'Улица'} value={object.addrStreet}
                                   onChange={(e) => {
                                       setObject({...object, addrStreet: e.target.value})
                                   }}/>
                        <TextField fullWidth label={'Номер дома'} value={object.addrHousenumber}
                                   onChange={(e) => {
                                       setObject({...object, addrHousenumber: e.target.value})
                                   }}/>
                        {selectedLayer.attributes.map(attribute => attribute.dataType === 'BOOLEAN' ?
                            <FormControlLabel control={<Checkbox onChange={(e) => {
                                handleChange(attribute.name, e.target.checked)
                            }}/>} label={attribute.name}/> :
                            <TextField fullWidth
                                       required={attribute.required}
                                       error={errors[attribute.name] !== null && errors[attribute.name] !== undefined}
                                       key={attribute.id}
                                       value={object[attribute.name]}
                                       onChange={(e) => {
                                           let rep = {...errors}
                                           rep[attribute.name] = null
                                           setErrors(rep)
                                           handleChange(attribute.name, e.target.value)
                                       }}
                                       label={attribute.name}
                                       helperText={errors[attribute.name] !== null && errors[attribute.name] !== undefined
                                           ? errors[attribute.name] : attribute.description}/>)
                        }
                    </div>}
                    {isPushing ? <CircularProgress sx={{
                            margin: 'auto'
                        }}/> :
                        <button className={styles.save_btn} onClick={() => {
                            save()
                        }}>
                            Сохранить
                        </button>
                    }
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
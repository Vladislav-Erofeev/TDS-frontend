import React, {useEffect, useRef, useState} from 'react';
import styles from './styles/objectInfoComponent.module.css'
import LayerSelection from "./LayerSelection";
import {CircularProgress, TextField} from "@mui/material";
import {LayerService} from "../services/LayerService";
import SelectCodesComponent from "./SelectCodesComponent";
import {GeodataService} from "../services/GeodataService";
import VectorSource from "ol/source/Vector";
import VectorLayer from "ol/layer/Vector";
import {Fill, Stroke, Style} from "ol/style";
import Draw from 'ol/interaction/Draw.js'
import {GeoJSON} from "ol/format";

const nullObjects = {
    code: null,
    feature: null,
    properties: {}
}
const ObjectInfoComponent = ({map}) => {
    const [expanded, setExpanded] = useState(false)
    const [selectedLayer, setSelectedLayer] = useState(null)
    const [object, setObject] = useState(nullObjects)
    const [openSelectCodes, setOpenSelectCodes] = useState(false)
    const [isLoading, setIsLoading] = useState(true)
    const source = useRef()
    const drawRef = useRef()
    const [errors, setErrors] = useState({})

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
            selectedLayer.attributes.forEach((attribute) => {
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
                }
                if (isNaN(value)) {
                    hasErrors = true
                    setErrors(errors => {
                        let err = {...errors}
                        err[attribute.name] = 'Неправильный тип данных'
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
            if (!hasErrors)
                await GeodataService.save(object)
        }
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
            setObject({...object, feature: JSON.parse(feature)})
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
                        {selectedLayer.attributes.map(attribute =>
                            <TextField fullWidth
                                       error={errors[attribute.name] !== null && errors[attribute.name] !== undefined}
                                       key={attribute.id}
                                       value={object[attribute.name]}
                                       onChange={(e) => {
                                           handleChange(attribute.name, e.target.value)
                                       }}
                                       label={attribute.name}
                                       helperText={errors[attribute.name] !== null && errors[attribute.name] !== undefined
                                           ? errors[attribute.name] : attribute.description}/>)}
                    </div>}
                    <button className={styles.save_btn} onClick={() => {
                        save()
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
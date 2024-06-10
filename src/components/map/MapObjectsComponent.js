import React, {useEffect, useRef, useState} from 'react';
import {GeodataService} from "../../services/GeodataService";
import {GeoJSON} from "ol/format";
import VectorSource from "ol/source/Vector";
import VectorLayer from "ol/layer/Vector";
import {Fill, Stroke, Style} from "ol/style";
import {Select} from "ol/interaction";
import styles from './styles/mapObjectsComponents.module.css'
import {CircularProgress} from "@mui/material";
import {hasRole} from "../../data/functions";
import {NavLink, useSearchParams} from "react-router-dom";
import {useDispatch} from "react-redux";
import {setErrorAction, setSuccessAction} from "../../redux/messageReducer";
import {CodeService} from "../../services/CodeService";

const nullObject = {
    code: '',
    creationDate: '',
    checked: false,
    properties: {}
}

const nullCode = {
    id: '',
    code: '',
    name: ''
}
const MapObjectsComponent = ({map, geoLayer, setGeoLayer}) => {
    const selectRef = useRef()
    const [open, setOpen] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [objectCode, setObjectCode] = useState(nullCode)
    const [searchParams, setSearchParams] = useSearchParams()
    const [isCodeLoading, setIsCodeLoading] = useState(false)
    const [selectedObject, setSelectedObject] = useState(nullObject)
    const dispatch = useDispatch()

    const fetchObject = (id) => {
        let fetch = async () => {
            try {
                let object = await GeodataService.getById(id)
                setSelectedObject(object)
                setIsLoading(false)
                setIsCodeLoading(true)
                try {
                    setObjectCode(await CodeService.getById(object.code))
                } catch (e) {
                    setObjectCode({name: 'Сервис временно недоступен', code: ''})
                }
                setIsCodeLoading(false)
            } catch (e) {
                dispatch(setErrorAction("Ошибка! Сервис временно недоступен"))
            }
        }
        setIsLoading(true)
        let feture = geoLayer.getSource().getFeatureById(id)
        if (feture === null)
            setSearchParams({})
        map.getView().fit(feture.getGeometry(), {
            duration: 500,
            padding: [0, 50, 0, 500]
        })
        selectRef.current.getFeatures().clear()
        selectRef.current.getFeatures().push(feture)
        fetch()
    }

    useEffect(() => {
        if (map == null)
            return
        let fetch = async () => {
            let data = []
            try {
                data = await GeodataService.getAll()
            } catch (e) {
                dispatch(setErrorAction("Ошибка! Сервис временно недоступен"))
            }
            let source = new VectorSource()
            let writer = new GeoJSON()
            data.forEach((feature) => {
                let f = writer.readFeature(feature, {dataProjection: 'EPSG:4326', featureProjection: 'EPSG:3857'})
                f.setId(feature.properties.id)
                source.addFeature(f)
            })
            let layer = new VectorLayer({
                source: source,
                style: new Style({
                    stroke: new Stroke({
                        color: '#1c8ee9',
                        width: 3
                    }),
                    fill: new Fill({
                        color: 'rgba(192,192,192,0.53)'
                    })
                })
            })
            setGeoLayer(layer)
            map.addLayer(layer)
            const selected = new Style({
                stroke: new Stroke({
                    color: '#ef5c5c',
                    width: 3
                }),
                fill: new Fill({
                    color: 'rgba(243,173,173,0.53)'
                })
            });
            const select = new Select({
                style: selected,
            })
            selectRef.current = select
            map.addInteraction(select)
            select.on("select", (e) => {
                if (e.selected[0] && e.selected[0].get('id') !== undefined) {
                    setSearchParams({object: e.selected[0].get('id')})
                } else {
                    setSearchParams({})
                }
            })
        }
        fetch()

        return () => {
            map.removeLayer(geoLayer)
            map.removeInteraction(selectRef.current)
        }
    }, [map])

    const remove = (id) => {
        let push = async () => {
            await GeodataService.deleteById(id)
        }
        geoLayer.getSource().removeFeature(geoLayer.getSource().getFeatureById(id))
        setSelectedObject(nullObject)
        setOpen(false)
        setSearchParams({})
        dispatch(setSuccessAction('Успех! Объект успешно удалён'))
        push()
    }

    const checkObject = () => {
        let push = async () => {
            await GeodataService.setCheckedById(selectedObject.id)
            dispatch(setSuccessAction('Успех! Объект успешно заверен'))
        }
        push()
        setSelectedObject({...selectedObject, checked: true})
    }

    useEffect(() => {
        if (geoLayer === null || map == null)
            return
        if (searchParams.has('object')) {
            fetchObject(searchParams.get('object'))
            setOpen(true)
        } else {
            setOpen(false)
            setSelectedObject(nullObject)
        }
    }, [searchParams, geoLayer])

    return (
        <div style={open ? {left: '0'} : {left: '-100%'}} className={styles.main}>
            <h1>Информация</h1>
            {isLoading ? <CircularProgress sx={{
                marginTop: '20px'
            }}/> : <div className={styles.object_info}>
                <h3>Код: {isCodeLoading ? <CircularProgress sx={{
                    marginLeft: '10px'
                }} /> : `${objectCode.code} - ${objectCode.name}`}</h3>
                <h3>Дата создания: {selectedObject.creationDate}</h3>
                <h3 style={selectedObject.checked ? {color: '#2cbb2c'} : {
                    color: '#e33737'
                }}>{selectedObject.checked ? 'Объект проверен' : "Объект ещё не проверен"}</h3>
                <div className={styles.props_list}>
                    <div className={styles.properties}>
                        <p>Имя: </p>
                        <p>{selectedObject.name}</p>
                    </div>
                    <div className={styles.properties}>
                        <p>Адрес: </p>
                        <p>{selectedObject.addrCountry}, {selectedObject.addrCity} {selectedObject.addrStreet ? `, ${selectedObject.addrStreet}` : ''}
                            {selectedObject.addrHousenumber ? `, ${selectedObject.addrHousenumber}` : ''}</p>
                    </div>
                    {
                        Object.keys(selectedObject.properties).map(key => <div key={key}
                                                                               className={styles.properties}>
                            <p>{key}: </p>
                            <p>{selectedObject.properties[key]}</p>
                        </div>)
                    }
                </div>
                {hasRole('ADMIN', 'MODERATOR') && !selectedObject.checked ?
                    <button className={styles.verify} onClick={() => {
                        checkObject()
                    }}>Заверить</button> : null}
                {
                    hasRole('ADMIN', 'USER', 'MODERATOR') ? <button className={styles.delete} onClick={() => {
                        remove(selectedObject.id)
                    }}>Удалить</button> : <div className={styles.non_auth_btn}>
                        <NavLink className={styles.login_btn} to={'/login'}>Войти</NavLink>
                        <NavLink className={styles.register_btn} to={'/register'}>Зарегистрироваться</NavLink>
                    </div>}
            </div>}
        </div>
    );
};

export default MapObjectsComponent;
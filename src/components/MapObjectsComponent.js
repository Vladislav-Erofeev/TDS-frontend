import React, {useEffect, useRef, useState} from 'react';
import {GeodataService} from "../services/GeodataService";
import {GeoJSON} from "ol/format";
import VectorSource from "ol/source/Vector";
import VectorLayer from "ol/layer/Vector";
import {Fill, Stroke, Style} from "ol/style";
import {Select} from "ol/interaction";
import styles from './styles/mapObjectsComponents.module.css'
import {CircularProgress} from "@mui/material";
import {hasRole} from "../data/functions";

const nullObject = {
    codeId: '',
    creationDate: '',
    checked: false,
    properties: {}
}
const MapObjectsComponent = ({map}) => {
    const geoLayer = useRef()
    const selectRef = useRef()
    const [open, setOpen] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [selectedObject, setSelectedObject] = useState(nullObject)

    const fetchObject = (id) => {
        let fetch = async () => {
            setSelectedObject(await GeodataService.getById(id))
            setIsLoading(false)
        }
        setIsLoading(true)
        fetch()
    }

    useEffect(() => {
        if (map == null)
            return
        let fetch = async () => {
            let data = await GeodataService.getAll()
            let source = new VectorSource()
            let writer = new GeoJSON()
            data.forEach((feature) => {
                let f = writer.readFeature(feature, {dataProjection: 'EPSG:4326', featureProjection: 'EPSG:3857'})
                f.setId(feature.properties.id)
                source.addFeature(f)
            })
            geoLayer.current = new VectorLayer({
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
            map.addLayer(geoLayer.current)
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
                style: selected
            })
            selectRef.current = select
            map.addInteraction(select)
            select.on("select", (e) => {
                if (e.selected[0] && e.selected[0].get('id') !== undefined) {
                    fetchObject(e.selected[0].get('id'))
                    setOpen(true)
                } else {
                    setOpen(false)
                    setSelectedObject(nullObject)
                }
            })
        }
        fetch()

        return () => {
            map.removeLayer(geoLayer.current)
            map.removeInteraction(selectRef.current)
        }
    }, [map])

    const remove = (id) => {
        let push = async () => {
            await GeodataService.deleteById(id)
        }
        geoLayer.current.getSource().removeFeature(geoLayer.current.getSource().getFeatureById(id))
        setSelectedObject(nullObject)
        setOpen(false)
        push()
    }

    const checkObject = () => {
        let push = async () => {
            await GeodataService.setCheckedById(selectedObject.id)
        }

        push()
        setSelectedObject({...selectedObject, checked: true})
    }

    return (
        <div style={open ? {left: '0'} : {left: '-100%'}} className={styles.main}>
            <h1>Информация</h1>
            {isLoading ? <CircularProgress sx={{
                marginTop: '20px'
            }}/> : <div className={styles.object_info}>
                <h3>Код: {selectedObject.codeId}</h3>
                <h3>Дата создания: {selectedObject.creationDate}</h3>
                <h3 style={selectedObject.checked ? {color: '#2cbb2c'} : {
                    color: '#e33737'
                }}>{selectedObject.checked ? 'Объект проверен' : "Объект ещё не проверен"}</h3>
                <div className={styles.props_list}>
                    {
                        Object.keys(selectedObject.properties).map(key => <div key={key}
                                                                               className={styles.properties}>
                            <p>{key}: </p>
                            <p>{selectedObject.properties[key]}</p>
                        </div>)
                    }
                </div>
                {hasRole('ADMIN') && !selectedObject.checked ?
                    <button className={styles.verify} onClick={() => {
                        checkObject()
                    }}>Заверить</button> : null}
                {
                    hasRole('ADMIN', 'USER') ? <button className={styles.delete} onClick={() => {
                        remove(selectedObject.id)
                    }}>Удалить</button> : null}
            </div>}
        </div>
    );
};

export default MapObjectsComponent;
import React, {useEffect, useState} from 'react';
import styles from './styles/searchComponent.module.css'
import {CircularProgress} from "@mui/material";
import {SearchService} from "../services/SearchService";
import {fromLonLat} from "ol/proj";
import VectorSource from "ol/source/Vector";
import VectorLayer from "ol/layer/Vector";
import {Fill, Icon, Stroke, Style} from "ol/style";
import CircleStyle from "ol/style/Circle";
import {Feature} from "ol";
import {Point} from "ol/geom";

const SearchComponent = ({map}) => {
    const [result, setResult] = useState([])
    const [query, setQuery] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [source, setSource] = useState(null)
    useEffect(() => {
        if (map === null)
            return
        const geoSource = new VectorSource()
        const layer = new VectorLayer({
            source: geoSource,
            style: [new Style({
                image: new Icon({
                    src: '/icons/marker.png',
                    anchor: [0.5, 1],
                    rotation: 0,
                    anchorXUnits: 'fraction',
                    anchorYUnits: 'fraction',
                    width: '60',
                    height: '60',
                }),
                zIndex: 11
            }), new Style({
                image: new CircleStyle({
                    radius: 5,
                    fill: new Fill({
                        color: '#3a89c7'
                    }),
                    stroke: new Stroke({
                        color: 'white',
                        width: 2
                    })
                }),
                zIndex: 12
            })]

        })
        map.addLayer(layer)
        setSource(geoSource)
    }, [map])
    useEffect(() => {
        let fetch = async () => {
            let res = await SearchService.search(query)
            setResult(res.features)
            setIsLoading(false)
        }
        if (query.length === 0) {
            if (source !== null)
                source.clear()
            return
        }
        setIsLoading(true)
        fetch()
    }, [query])

    const addToMap = (item) => {
        source.clear()
        let coords = fromLonLat(item.geometry.coordinates)
        source.addFeature(new Feature({
            geometry: new Point(coords)
        }))
        map.getView().animate({
            center: coords,
            duration: 500
        })
    }
    return (
        <div className={styles.search}>
            <input type={"text"} value={query} onChange={(e) => {
                setQuery(e.target.value)
            }} placeholder={'поиск...'} className={query.length === 0 ? styles.empty_search : styles.search_bar}/>
            <div className={styles.result} style={
                query.length === 0 ? {display: 'none'} : null
            }>
                {isLoading ? <CircularProgress/> : result.length === 0 ? <p>Ничего не найдено</p> :
                    result.map(item => <button
                        onClick={() => {
                            addToMap(item)
                        }} key={item.properties.osm_id}>
                        <p>{item.properties.display_name}</p>
                    </button>)
                }
            </div>
        </div>
    );
};

export default SearchComponent;
import React, {useEffect, useState} from 'react';
import styles from './styles/searchComponent.module.css'
import {CircularProgress} from "@mui/material";
import {SearchService} from "../services/SearchService";
import VectorSource from "ol/source/Vector";
import VectorLayer from "ol/layer/Vector";
import {Fill, Icon, Stroke, Style} from "ol/style";
import CircleStyle from "ol/style/Circle";
import {useSearchParams} from "react-router-dom";
import SearchFilterComponent from "./SearchFilterComponent";

const SearchComponent = ({map}) => {
    const [result, setResult] = useState([])
    const [query, setQuery] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [source, setSource] = useState(null)
    const [searchParams, setSearchParams] = useSearchParams()
    const [selectedCodes, setSelectedCodes] = useState([])
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
            let res = []
            if (selectedCodes.length === 0)
                res = await SearchService.search(query)
            else
                res = await SearchService.filterSearch(query, selectedCodes)
            setResult(res)
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
        setSearchParams({object: item.id})
    }
    return (
        <div className={styles.search}>
            <div className={styles.bar}>
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
                            }} key={item.id}>
                            <p>{item.name}, {item.addr_country}, {item.addr_city},
                                {item.addr_street}, {item.addr_housenumber}</p>
                        </button>)
                    }
                </div>
            </div>
            <SearchFilterComponent selectedCodes={selectedCodes} setSelectedCodes={setSelectedCodes}/>
        </div>
    );
};

export default SearchComponent;
import React, {useEffect, useRef, useState} from 'react';
import styles from './styles/mapComponent.module.css'
import TileLayer from "ol/layer/Tile";
import {XYZ} from "ol/source";
import {View, Map} from "ol";
import {defaults, DragRotate, MouseWheelZoom} from "ol/interaction";
import {platformModifierKeyOnly} from "ol/events/condition";


const MapComponent = ({setMap}) => {
    const mapDiv = useRef()
    const mapRef = useRef()
    const [rotation, setRotation] = useState(0)

    const zoomInRef = useRef()
    const zoomOutRef = useRef()

    useEffect(() => {
        if (mapRef.current != null)
            return

        const mapElem = new Map({
            target: mapDiv.current,
            layers: [new TileLayer({
                source: new XYZ({
                    url: 'https://mt1.google.com/vt/lyrs=s&x={x}&y={y}&z={z}'
                })
            })
            ],
            view: new View({
                center: [4187526, 7514066],
                zoom: 14,
                minZoom: 3,
                maxZoom: 22,
                rotation: 0
            }),
            interactions: defaults({altShiftDragRotate: false, mouseWheelZoom: false}).extend([
                new MouseWheelZoom({
                    duration: 400,
                    maxDelta: 1,
                }),
                new DragRotate({
                    condition: platformModifierKeyOnly,
                })
            ]),
            controls: []
        })

        // анимации приближения и отдаления
        zoomInRef.current.addEventListener('click', () => {
            mapElem.getView().animate({
                zoom: mapElem.getView().getZoom() + 1,
                duration: 400
            })
        })

        mapElem.getView().on("change:rotation", (e) => {
            setRotation(e.target.getRotation())
        })

        zoomOutRef.current.addEventListener('click', () => {
            mapElem.getView().animate({
                zoom: mapElem.getView().getZoom() - 1,
                duration: 400
            })
        })


        mapRef.current = mapElem
        setMap(mapElem)
    }, [])

    const compassClick = () => {
        mapRef.current.getView().animate({
            rotation: 0,
            duration: 300
        })
    }
    return (
        <div ref={mapDiv} className={styles.map}>
            <div className={styles.map_controls}>
                <button ref={zoomInRef}>+</button>
                <button ref={zoomOutRef}>-</button>
                <button onClick={compassClick}><img style={{
                    rotate: `${rotation}rad`
                }} src={'/icons/compass1.png'} width={'30px'}/></button>
            </div>
        </div>
    );
};

export default MapComponent;
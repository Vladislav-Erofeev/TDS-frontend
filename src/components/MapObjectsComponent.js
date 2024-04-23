import React, {useEffect, useRef} from 'react';
import {GeodataService} from "../services/GeodataService";
import {GeoJSON} from "ol/format";
import VectorSource from "ol/source/Vector";
import VectorLayer from "ol/layer/Vector";

const MapObjectsComponent = ({map}) => {
    const geoLayer = useRef()
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
                source: source
            })
            map.addLayer(geoLayer.current)
        }
        fetch()

        return () => {
            map.removeLayer(geoLayer.current)
        }
    }, [map])

    return (
        <div>
            
        </div>
    );
};

export default MapObjectsComponent;
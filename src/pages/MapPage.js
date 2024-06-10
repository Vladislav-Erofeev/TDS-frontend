import React, {useState} from 'react';
import MapComponent from "../components/map/MapComponent";
import SearchComponent from "../components/map/SearchComponent";
import ObjectInfoComponent from "../components/map/ObjectInfoComponent";
import MapObjectsComponent from "../components/map/MapObjectsComponent";
import {hasRole} from "../data/functions";
import {useSelector} from "react-redux";

const MapPage = () => {
    const [map, setMap] = useState(null)
    const [geoLayer, setGeoLayer] = useState(null)
    const user = useSelector(state => state.user)
    return (
        <>
            <MapComponent setMap={setMap}/>
            <MapObjectsComponent map={map}
                                 geoLayer={geoLayer}
                                 setGeoLayer={setGeoLayer}/>
            <SearchComponent map={map}/>
            {hasRole('USER', 'ADMIN') ? <ObjectInfoComponent geoLayer={geoLayer} map={map}/> : null}
        </>
    );
};

export default MapPage;
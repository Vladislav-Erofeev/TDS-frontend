import React, {useState} from 'react';
import MapComponent from "../components/MapComponent";
import SearchComponent from "../components/SearchComponent";
import ObjectInfoComponent from "../components/ObjectInfoComponent";
import MapObjectsComponent from "../components/MapObjectsComponent";
import {hasRole} from "../data/functions";

const MapPage = () => {
    const [map, setMap] = useState(null)
    return (
        <>
            <MapComponent setMap={setMap}/>
            <MapObjectsComponent map={map}/>
            <SearchComponent map={map}/>
            {hasRole('USER', 'ADMIN') ? <ObjectInfoComponent map={map}/> : null}
        </>
    );
};

export default MapPage;
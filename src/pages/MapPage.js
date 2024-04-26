import React, {useState} from 'react';
import MapComponent from "../components/MapComponent";
import SearchComponent from "../components/SearchComponent";
import ObjectInfoComponent from "../components/ObjectInfoComponent";
import MapObjectsComponent from "../components/MapObjectsComponent";
import {hasRole} from "../data/functions";
import {useSelector} from "react-redux";

const MapPage = () => {
    const [map, setMap] = useState(null)
    const user = useSelector(state => state.user)
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
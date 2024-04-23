import React, {useState} from 'react';
import MapComponent from "../components/MapComponent";
import SearchComponent from "../components/SearchComponent";
import ObjectInfoComponent from "../components/ObjectInfoComponent";
import MapObjectsComponent from "../components/MapObjectsComponent";

const MapPage = () => {
    const [map, setMap] = useState(null)
    return (
        <>
            <MapComponent setMap={setMap} />
            <MapObjectsComponent map={map} />
            <SearchComponent map={map} />
            <ObjectInfoComponent map={map} />
        </>
    );
};

export default MapPage;
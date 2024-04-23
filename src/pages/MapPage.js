import React, {useState} from 'react';
import MapComponent from "../components/MapComponent";
import SearchComponent from "../components/SearchComponent";
import ObjectInfoComponent from "../components/ObjectInfoComponent";

const MapPage = () => {
    const [map, setMap] = useState(null)
    return (
        <>
            <MapComponent setMap={setMap} />
            <SearchComponent map={map} />
            <ObjectInfoComponent map={map} />
        </>
    );
};

export default MapPage;
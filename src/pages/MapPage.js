import React, {useState} from 'react';
import MapComponent from "../components/MapComponent";
import SearchComponent from "../components/SearchComponent";

const MapPage = () => {
    const [map, setMap] = useState(null)
    return (
        <>
            <MapComponent setMap={setMap} />
            <SearchComponent map={map} />
        </>
    );
};

export default MapPage;
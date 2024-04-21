import React, {useState} from 'react';
import MapComponent from "../components/MapComponent";

const MapPage = () => {
    const [map, setMap] = useState(null)
    return (
        <>
            <MapComponent setMap={setMap} />
        </>
    );
};

export default MapPage;
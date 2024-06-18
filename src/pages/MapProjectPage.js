import React, {useState} from 'react';
import MapComponent from "../components/map/MapComponent";
import SearchComponent from "../components/map/SearchComponent";
import OuterChatComponent from "../components/projects/OuterChatComponent";
import ActiveUserComponent from "../components/projects/ActiveUserComponent";

const MapProjectPage = () => {
    const [map, setMap] = useState(null)
    return (
        <div>
            <MapComponent setMap={setMap} />
            <SearchComponent map={map}/>
            <OuterChatComponent />
            <ActiveUserComponent />
        </div>
    );
};

export default MapProjectPage;
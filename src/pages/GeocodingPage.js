import React, {useEffect, useState} from 'react';
import {GeocodingService} from "../services/GeocodingService";
import ReportItem from "../components/geocoding/ReportItem";

const GeocodingPage = () => {
    const [geocodings, setGeocodings] = useState([])
    const [open, setOpen] = useState(false)

    useEffect(() => {
        let fetch = async () => {
            setGeocodings(await GeocodingService.getAll())
        }
        fetch()
    }, [])
    return (
        <>
            <div>
                <div style={{
                    width: '80%',
                    margin: '45px auto'
                }}>
                    <h1 style={{
                    }}>Геокодирование</h1>
                    <p style={{
                        marginTop: '10px'
                    }}>Здесь вы можете просматривать классификатор и изменять его</p>
                </div>
                <div style={{
                    display: 'flex',
                    marginTop: '20px',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '10px'
                }}>
                    {geocodings.map(item => <ReportItem item={item}/>)}
                </div>
            </div>
        </>
    );
};

export default GeocodingPage;
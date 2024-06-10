import React, {useEffect, useState} from 'react';
import {GeocodingService} from "../services/GeocodingService";
import ReportItem from "../components/geocoding/ReportItem";
import styles from './styles/geocodingPage.module.css'
import LoadFileModal from "../components/geocoding/LoadFileModal";
import {fetchEventSource} from "@microsoft/fetch-event-source";
import {TokenService} from "../services/TokenService";

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
                    <h1 style={{}}>Геокодирование</h1>
                    <p style={{
                        marginTop: '10px'
                    }}>Здесь вы можете просматривать классификатор и изменять его</p>
                </div>
                <div style={{
                    display: 'flex',
                    marginTop: '20px',
                    flexDirection: 'column',
                    gap: '10px',
                    margin: 'auto',
                    width: '80%'
                }}>
                    {geocodings.length === 0 ? <h2 style={{
                        textAlign: 'center'
                    }}>Список пуст</h2> : geocodings.map(item => <ReportItem key={item.id} item={item}/>)}
                    <button onClick={() => {
                        setOpen(true)
                    }} className={styles.load_file}>
                        <span><img src={'/icons/add.svg'} width={'20px'}/> Загрузить</span>
                    </button>
                </div>
            </div>
            <LoadFileModal setGeocodings={setGeocodings} open={open} setOpen={setOpen}/>
        </>
    );
};

export default GeocodingPage;
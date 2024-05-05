import React, {useEffect, useState} from 'react';
import {GeodataService} from "../services/GeodataService";
import styles from "./styles/objectsPage.module.css";
import {CircularProgress} from "@mui/material";
import {NavLink} from "react-router-dom";

const UncheckedPage = () => {
    const [objects, setObjects] = useState([])
    const [isLoading, setIsLoading] = useState(false)
    useEffect(() => {
        let fetch = async () => {
            setObjects(await GeodataService.getAllUncheckedObjects())
            setIsLoading(false)
        }
        setIsLoading(true)
        fetch()
    }, [])
    return (
        <div className={styles.main}>
            <h1>Список объектов на проверку</h1>
            <p className={styles.description}>На данной странице вы можете посмотреть
                весь список добавленных вами объектов</p>
            <div className={styles.list}>
                {isLoading ? <CircularProgress/> : objects.length === 0 ? <h3>Список пуст</h3> : null}
                {objects.map(item => <div key={item.id}>
                    <p>{item.id}</p>
                    <p>{item.creationDate}</p>
                    <NavLink to={'/profile'}>Пользователь</NavLink>
                    <NavLink to={`/map?object=${item.id}`}>перейти</NavLink>
                </div>)}
            </div>
        </div>
    );
};

export default UncheckedPage;
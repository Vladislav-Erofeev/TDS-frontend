import React, {useEffect, useState} from 'react';
import {GeodataService} from "../services/GeodataService";
import styles from './styles/objectsPage.module.css'

const ObjectsPage = () => {
    const [objects, setObjects] = useState([])
    useEffect(() => {
        let fetch = async () => {
            console.log(await GeodataService.getAllUserObjects())
        }
        fetch()
    }, [])
    return (
        <div className={styles.main}>
            <h1>Добавленные объекты</h1>
            <p className={styles.description}>На данной странице вы можете посмотреть
                весь список добавленных вами объектов</p>
            <div className={styles.list}>
                {objects.map(item => <div key={item.id}>
                </div>)}
            </div>
        </div>
    );
};

export default ObjectsPage;
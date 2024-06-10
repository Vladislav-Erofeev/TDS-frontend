import React, {useEffect, useState} from 'react';
import {GeodataService} from "../services/GeodataService";
import styles from './styles/objectsPage.module.css'
import {NavLink} from "react-router-dom";
import {CircularProgress, Tab, Tabs} from "@mui/material";
import {hasRole} from "../data/functions";
import {useNavigate} from "react-router";
import TabComponent from "../components/TabComponent";
import UncheckedComponent from "../components/UncheckedComponent";
import {useSelector} from "react-redux";

const ObjectsPage = () => {
    const user = useSelector(state => state.user)
    const [objects, setObjects] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const navigate = useNavigate()
    const [tab, setTab] = useState(0)
    useEffect(() => {
        let fetch = async () => {
            setObjects(await GeodataService.getAllUserObjects())
            setIsLoading(false)
        }
        if (!hasRole('ADMIN', 'USER', 'MODERATOR'))
            navigate('/login')
        setIsLoading(true)
        fetch()
    }, [])
    return (
        <div className={styles.main}>
            <h1>Добавленные объекты</h1>
            <p className={styles.description}>На данной странице вы можете посмотреть
                весь список добавленных вами объектов</p>
            {hasRole('ADMIN', 'MODERATOR') ? <Tabs value={tab} onChange={(e, v) => {
                    setTab(v)
                }} sx={{
                    marginTop: '30px'
                }}>
                    <Tab label={'Список объектов'}/>
                    <Tab label={'На проверку'}/>
                </Tabs>
                : null}
            <TabComponent value={0} currentValue={tab} component={
                <div className={styles.list}>
                    {isLoading ? <CircularProgress/> : objects.length === 0 ? <h3>Список пуст</h3> : null}
                    {objects.map(item => <div key={item.id}>
                        <p>{item.id}</p>
                        <p>{item.creationDate}</p>
                        <p style={item.checked ? {
                            color: '#028a0c'
                        } : {
                            color: '#b20b0b'
                        }}>{item.checked ? 'Проверен' : 'Не проверен'}</p>
                        <NavLink to={`/map?object=${item.id}`}>перейти</NavLink>
                    </div>)}
                </div>
            }/>
            <TabComponent value={1} currentValue={tab} component={<UncheckedComponent/>}/>
        </div>
    );
};

export default ObjectsPage;
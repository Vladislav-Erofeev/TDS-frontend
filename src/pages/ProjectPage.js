import React, {useEffect, useState} from 'react';
import {useParams} from "react-router";
import {ProjectsService} from "../services/ProjectsService";
import {getTimeWithTz} from "../data/functions";
import styles from'./styles/projectPage.module.css'
import {Tab, Tabs} from "@mui/material";
import {NavLink, useSearchParams} from "react-router-dom";
import TabComponent from "../components/TabComponent";
import ChatComponent from "../components/projects/ChatComponent";
import UsersComponent from "../components/projects/UsersComponent";

const ProjectPage = () => {
    const {id} = useParams()
    const [tab, setTab] = useState(0)
    const [searchParams, setSearchParams] = useSearchParams()
    const [project, setProject] = useState({
        name: '',
        createdAt: '',
        modifiedAt: ''
    })
    useEffect(() => {
        let fetch = async () => {
            setProject(await ProjectsService.getById(id))
            if (searchParams.has('tab')) {
                if (!isNaN(parseInt(searchParams.get('tab'))))
                    setTab(parseInt(searchParams.get('tab')))
            }
        }
        fetch()
    }, [])

    return (
        <div className={styles.main}>
            <NavLink to={'/projects'} className={styles.back_link}><img src={'/icons/back_arrow.svg'} width={'20px'}/>
                к проектам</NavLink>
            <h1 style={{
                marginTop: '10px'
            }}>Проект: {project.name}</h1>
            <p style={{
                marginTop: '10px'
            }}>Создан: {getTimeWithTz(project.createdAt)}</p>
            <p style={{
                marginTop: '20px'
            }}>{project.comment}</p>
            <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                marginTop: '20px'
            }}>
                <img src={'/icons/group.svg'} width={'25px'}/>
                <p>{project.personsCount}</p>
            </div>
            <Tabs value={tab} onChange={(e, v) => {
                setTab(v)
                setSearchParams({tab: v})
            }}>
                <Tab label={'Активность'}/>
                <Tab label={'Пользователи'}/>
                <Tab label={'Чат'}/>
                <Tab label={'Комментарии'}/>
            </Tabs>

            <TabComponent value={1} currentValue={tab} component={<UsersComponent projectId={id}/>}/>
            <TabComponent value={2} currentValue={tab} component={<ChatComponent projectId={id} />} />
        </div>
    );
};

export default ProjectPage;
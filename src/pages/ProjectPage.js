import React, {useEffect, useState} from 'react';
import {useParams} from "react-router";
import {ProjectsService} from "../services/ProjectsService";
import {getTimeWithTz} from "../data/functions";
import styles from'./styles/projectPage.module.css'
import {Tab, Tabs} from "@mui/material";

const ProjectPage = () => {
    const {id} = useParams()
    const [project, setProject] = useState({
        name: '',
        createdAt: '',
        modifiedAt: ''
    })
    useEffect(() => {
        let fetch = async () => {
            setProject(await ProjectsService.getById(id))
        }
        fetch()
    })
    return (
        <div className={styles.main}>
            <h1>Проект: {project.name}</h1>
            <p style={{
                marginTop: '10px'
            }}>Создан: {getTimeWithTz(project.createdAt)}</p>
            <p style={{
                marginTop: '20px'
            }}>{project.comment}</p>
            <Tabs>
                <Tab label={'Активность'}/>
                <Tab label={'Пользователи'}/>
            </Tabs>
        </div>
    );
};

export default ProjectPage;
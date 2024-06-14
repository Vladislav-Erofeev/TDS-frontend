import React, {useEffect, useState} from 'react';
import {getTimeWithTz, hasRole, transliterate} from "../data/functions";
import {ProjectsService} from "../services/ProjectsService";
import {NavLink} from "react-router-dom";
import styles from './styles/projectsPage.module.css'
import ProjectItem from "../components/projects/ProjectItem";
import AddProjectModal from "../components/projects/AddProjectModal";

const ProjectsPage = () => {
    const [projects, setProjects] = useState([])
    const [openAddProjectModal, setOpenAddProjectModal] = useState(false)
    useEffect(() => {
        let fetch = async () => {
            setProjects(await ProjectsService.getAll())
        }
        fetch()
    }, [])
    return (
        <div className={styles.main}>
            <h1>Проекты</h1>
            <p style={{
                marginTop: '10px'
            }}>Здесь располагаются ваши проекты для совместной работы с другими пользователями</p>
            <div className={styles.list}>
                {projects.map(item => <ProjectItem setProjects={setProjects} key={item.id} item={item} /> )}
                <button className={styles.add_layer} onClick={() => {
                    setOpenAddProjectModal(true)
                }}>
                    <span><img src={'/icons/add.svg'} width={'20px'}/> Добавить проект</span>
                </button>
            </div>
            <AddProjectModal open={openAddProjectModal} setOpen={setOpenAddProjectModal} />
            {/*TODO сделать редактирование проекта*/}
        </div>
    );
};

export default ProjectsPage;
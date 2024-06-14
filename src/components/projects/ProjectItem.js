import React, {useState} from 'react';
import {getTimeWithTz, transliterate} from "../../data/functions";
import styles from "../../pages/styles/projectsPage.module.css";
import {NavLink} from "react-router-dom";
import {Button, Dialog, DialogActions, DialogContent, DialogTitle} from "@mui/material";
import {ProjectsService} from "../../services/ProjectsService";

const ProjectItem = ({item, setProjects}) => {
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false)
    const deleteProject = () => {
        const push = async () => {
            await ProjectsService.deleteById(item.id)
            setProjects(projects => {
                let arr = [...projects]
                arr.splice(arr.findIndex(proj => proj.id === item.id), 1)
                return arr
            })
            setOpenDeleteDialog(false)
        }
        push()
    }
    return (
        <>
            <NavLink to={`${item.id}/${transliterate(item.name)}`} className={styles.project}>
                <h4>{item.name}</h4>
                <p style={{
                    color: "#696969"
                }}>{getTimeWithTz(item.modifiedAt)}</p>
                <div className={styles.project_action}>
                    <button>
                        <img src={'/icons/edit.svg'} width={'25px'}/>
                    </button>
                    <button onClick={(e) => {
                        e.preventDefault()
                        setOpenDeleteDialog(true)
                    }}>
                        <img src={'/icons/remove.svg'} width={'25px'}/>
                    </button>
                </div>
            </NavLink>
            <Dialog open={openDeleteDialog}>
                <DialogTitle>
                    Удаление проекта
                </DialogTitle>
                <DialogContent>
                    Вы действительно собираетесь удалить проект? Данное действие отменить невозможно
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => {
                        setOpenDeleteDialog(false)
                    }}>
                        Отменить
                    </Button>
                    <Button onClick={() => {
                        deleteProject()
                    }} sx={{
                        color: 'red'
                    }}>
                        Удалить
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

export default ProjectItem;
import React, {useState} from 'react';
import {Backdrop, CircularProgress, TextField} from "@mui/material";
import styles from './styles/addProjectModal.module.css'
import {ProjectsService} from "../../services/ProjectsService";
import {useNavigate} from "react-router";
import {transliterate} from "../../data/functions";

const nullProject = {
    name: '',
    comment: ''
}
const AddProjectModal = ({open, setOpen}) => {
    const [newProject, setNewProject] = useState(nullProject)
    const [errors, setErrors] = useState({
        name: ''
    })
    const [isLoading, setIsLoading] = useState(false)
    const navigate = useNavigate()

    const save = () => {
        let push = async () => {
            let res = await ProjectsService.save(newProject)
            setIsLoading(false)
            navigate(`${res.id}/${transliterate(res.name)}`)
        }

        if (newProject.name === '') {
            setErrors({...errors, name: 'Поле не может быть пустым'})
            return
        } else {
            setErrors({...errors, name: ''})
        }

        setIsLoading(true)
        push()
    }
    return (
        <Backdrop open={open}>
            <div className={styles.main}>
                <button className={styles.close_btn} onClick={() => {
                    setNewProject(nullProject)
                    setOpen(false)
                }}>
                    <img src={'/icons/close.svg'} width={'25px'}/>
                </button>
                <h1>Новый проект</h1>
                <TextField label={'имя'} required value={newProject.name} onChange={(e) => {
                    setNewProject({...newProject, name: e.target.value})
                }} error={errors.name !== ''} helperText={errors.name}/>
                <TextField label={'комментарий'} value={newProject.comment} onChange={(e) => {
                    setNewProject({...newProject, comment: e.target.value})
                }}/>
                {isLoading ? <CircularProgress/> :
                    <button className={styles.save_btn} onClick={() => {
                        save()
                    }}>сохранить</button>
                }
            </div>
        </Backdrop>
    );
};

export default AddProjectModal;
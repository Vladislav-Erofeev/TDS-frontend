import React, {useState} from 'react';
import {Avatar, Menu, MenuItem} from "@mui/material";
import {chatStringAvatar} from "../../data/functions";
import styles from './styles/userItem.module.css'
import {ProjectsService} from "../../services/ProjectsService";
import {useDispatch} from "react-redux";
import {AxiosError} from "axios";
import {setErrorAction} from "../../redux/messageReducer";

const projectRoleDecoding = {
    'OWNER': 'Владелец',
    'ADMIN': 'Администратор',
    'USER': ''
}
const UserItem = ({user, self, projectId, deleteCallback, setRoleCallback}) => {
    const [menuAnchor, setMenuAnchor] = useState(null)
    const dispatch = useDispatch()
    const openMenu = Boolean(menuAnchor)

    const handleOpen = (e) => {
        setMenuAnchor(e.target)
    }

    const handleClose = () => {
        setMenuAnchor(null)
    }

    const kickPerson = async () => {
        setMenuAnchor(null)
        try {
            await ProjectsService.deletePersonProject(user.id, projectId)
            deleteCallback(user.id)
        } catch (e) {
            switch (e.response.status) {
                case 403:
                    dispatch(setErrorAction('Ошибка! Отказано в доступе'))
                    break
                default:
                    dispatch(setErrorAction('Ошибка! Внутренняя ошибка'))
            }
        }
    }

    const setRole = async () => {
        const newRole = user.projectRole === 'ADMIN' ? 'USER' : 'ADMIN'
        try {
            await ProjectsService.setNewRoleToPerson(user.id, projectId, newRole)
            setRoleCallback(user.id, newRole)
        } catch (e) {
            switch (e.response.status) {
                case 403:
                    dispatch(setErrorAction('Ошибка! Отказано в доступе'))
                    break
                default:
                    dispatch(setErrorAction('Ошибка! Внутренняя ошибка'))
            }
        }
    }
    return (
        <div className={styles.list_item} style={self ? {
            backgroundColor: '#b1d0f1'
        } : {}}>
            <div className={styles.base_info}>
                <Avatar {...chatStringAvatar(user.name + " " + user.surname, '60px', '12pt')}/>
                <div>
                    <p className={styles.name}>{user.name} {user.surname}</p>
                    <p className={styles.role}>{projectRoleDecoding[user.projectRole]}</p>
                </div>
            </div>
            <p>{user.email}</p>
            <p>{user.phone ? user.phone : 'Не указан'}</p>
            <button onClick={handleOpen} className={styles.actions}>
                <img width={'25px'} src={'/icons/3844442-dot-menu-more-vertical_110310.svg'}/>
            </button>
            <Menu open={openMenu} onClose={handleClose} anchorEl={menuAnchor}>
                {user.projectRole === 'ADMIN' ? <MenuItem onClick={setRole}>Убрать администратора</MenuItem> :
                    <MenuItem onClick={setRole}>Назначить администратором</MenuItem>}
                <MenuItem sx={{
                    color: 'red'
                }} onClick={kickPerson}>Исключить</MenuItem>
                {/*TODO назначить действия на кнопки*/}
            </Menu>
        </div>
    );
};

export default UserItem;
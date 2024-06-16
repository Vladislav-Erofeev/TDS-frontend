import React, {useState} from 'react';
import {Avatar, Menu, MenuItem} from "@mui/material";
import {chatStringAvatar} from "../../data/functions";
import styles from './styles/userItem.module.css'

const projectRoleDecoding = {
    'OWNER': 'Владелец',
    'ADMIN': 'Администратор',
    'USER': ''
}
const UserItem = ({user, self}) => {
    const [menuAnchor, setMenuAnchor] = useState(null)
    const openMenu = Boolean(menuAnchor)

    const handleOpen = (e) => {
        setMenuAnchor(e.target)
    }

    const handleClose = () => {
        setMenuAnchor(null)
    }
    return (
        <div className={styles.list_item} style={self ? {
            backgroundColor: '#b1d0f1'
        } : {} }>
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
                <MenuItem>Назначить администратором</MenuItem>
                <MenuItem>Исключить</MenuItem>
                {/*TODO назначить действия на кнопки*/}
            </Menu>
        </div>
    );
};

export default UserItem;
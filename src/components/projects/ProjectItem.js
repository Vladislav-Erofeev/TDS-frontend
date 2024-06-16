import React, {useState} from 'react';
import {generateHash, getTimeWithTz, transliterate} from "../../data/functions";
import styles from "./styles/projectItem.module.css"
import {NavLink} from "react-router-dom";
import {Backdrop, Button, Dialog, DialogActions, DialogContent, DialogTitle, Menu, MenuItem} from "@mui/material";
import {ProjectsService} from "../../services/ProjectsService";
import InviteLinkModal from "./InviteLinkModal";

const ProjectItem = ({item, setProjects}) => {
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false)
    const [anchorEl, setAnchorEl] = useState(null)
    const openMenu = Boolean(anchorEl)
    const [inviteLink, setInviteLink] = useState(null)

    const handleOpen = (e) => {
        setAnchorEl(e.target)
    }

    const handleClose = () => {
        setAnchorEl(null)
    }
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

    const generateInviteLink = () => {
        const push = async () => {
            setInviteLink(await ProjectsService.generateInviteToken(item.id))
        }
        push()
    }
    return (
        <>
            <div className={styles.project}>
                <img src={`/images/project${generateHash(item.name) % 5}.jpg`} width={'100%'}/>
                <div>
                    <h2>{item.name}</h2>
                    <p style={{
                        color: "#696969",
                        fontSize: '10pt'
                    }}>{getTimeWithTz(item.modifiedAt)}</p>
                </div>
                <p>{item.comment}</p>
                <div className={styles.project_actions}>
                    <NavLink className={styles.link} to={`${item.id}/${transliterate(item.name)}`}>Перейти</NavLink>
                    <button onClick={handleOpen}>
                        <img src={'/icons/3844442-dot-menu-more-vertical_110310.svg'} width={'20px'}/>
                    </button>
                </div>
            </div>
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
            <Menu open={openMenu} anchorEl={anchorEl} onClose={handleClose}>
                <MenuItem onClick={() => {
                    generateInviteLink()
                    handleClose()
                }}>поделиться</MenuItem>
                <MenuItem>редактировать</MenuItem>
                <MenuItem sx={{
                    color: 'red'
                }} onClick={() => {
                    setOpenDeleteDialog(true)
                    handleClose()
                }}>удалить</MenuItem>
            </Menu>
            <InviteLinkModal inviteLink={inviteLink} setInviteLink={setInviteLink} />
        </>
    );
};

export default ProjectItem;
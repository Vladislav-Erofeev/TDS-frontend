import React, {useEffect, useState} from 'react';
import {useNavigate, useParams} from "react-router";
import {ProjectsService} from "../services/ProjectsService";
import {getTimeWithTz} from "../data/functions";
import styles from './styles/projectPage.module.css'
import {Tab, Tabs} from "@mui/material";
import {NavLink, useSearchParams} from "react-router-dom";
import TabComponent from "../components/TabComponent";
import ChatComponent from "../components/projects/ChatComponent";
import UsersComponent from "../components/projects/UsersComponent";
import {useSelector} from "react-redux";
import InviteLinkModal from "../components/projects/InviteLinkModal";

const ProjectPage = () => {
    const navigate = useNavigate()
    const user = useSelector(state => state.user)
    const {id} = useParams()
    const [tab, setTab] = useState(0)
    const [searchParams, setSearchParams] = useSearchParams()
    const [project, setProject] = useState({
        name: '',
        createdAt: '',
        modifiedAt: ''
    })
    const [inviteLink, setInviteLink] = useState(null)
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

    const leaveProject = async () => {
        await ProjectsService.deletePersonProject(user.id, id)
        navigate('/projects')
    }

    const generateInviteLink = () => {
        const push = async () => {
            setInviteLink(await ProjectsService.generateInviteToken(id))
        }
        push()
    }

    return (
        <div className={styles.main}>
            <NavLink to={'/projects'} className={styles.back_link}><img src={'/icons/back_arrow.svg'} width={'20px'}/>
                к проектам</NavLink>
            <div className={styles.title}>
                <h1>Проект: {project.name}</h1>
                <button onClick={generateInviteLink}>
                    <img src={'/icons/share.svg'} width={'30px'}/>
                </button>
            </div>
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
                <button onClick={leaveProject} className={styles.leave_btn}>покинуть</button>
                <img src={'/icons/group.svg'} width={'25px'}/>
                <p>{project.personsCount}</p>
            </div>
            <div className={styles.navigation}>
                <Tabs value={tab} onChange={(e, v) => {
                    setTab(v)
                    setSearchParams({tab: v})
                }}>
                    <Tab label={'Активность'}/>
                    <Tab label={'Пользователи'}/>
                    <Tab label={'Чат'}/>
                    <Tab label={'Комментарии'}/>
                </Tabs>
                <NavLink className={styles.to_map_btn} to={'map'}>На карту</NavLink>
            </div>

            <TabComponent value={1} currentValue={tab} component={<UsersComponent projectId={id}/>}/>
            <TabComponent value={2} currentValue={tab} component={<div style={{
                height: '63vh',
                width: '100%',
                margin: 'auto'
            }}>
                <ChatComponent projectId={id}/>
            </div>}/>
            <InviteLinkModal inviteLink={inviteLink} setInviteLink={setInviteLink}/>
        </div>
    );
};

export default ProjectPage;
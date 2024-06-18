import React, {useEffect, useRef, useState} from 'react';
import {useParams} from "react-router";
import {useSelector} from "react-redux";
import styles from './styles/activeUserComponent.module.css'
import {ProjectsService} from "../../services/ProjectsService";
import {ProfileService} from "../../services/ProfileService";
import {Avatar} from "@mui/material";
import {chatStringAvatar, stringToColor} from "../../data/functions";

const projectRoleDecoding = {
    'OWNER': 'Владелец',
    'ADMIN': 'Администратор',
    'USER': ''
}

const ActiveUserComponent = () => {
    const {id} = useParams()
    const user = useSelector(state => state.user)
    const [mousePositions, setMousePositions] = useState([])
    const stompClientRef = useRef()
    const [users, setUsers] = useState([])
    let lastMousePosition = {
        x: 0,
        y: 0
    }
    const [expanded, setExpanded] = useState(false)

    const openStompConnection = (personId) => {
        const Stomp = require("stompjs");
        let Sockjs = require("sockjs-client");
        Sockjs = new Sockjs(`${process.env.REACT_APP_PROJECTS_WS}/ws`);
        let client = Stomp.over(Sockjs);
        stompClientRef.current = client
        client.connect({}, () => {
            client.send(`/app/user_events/${id}`, {}, JSON.stringify({
                type: 'CONNECT',
                personId: user.id
            }))

            client.subscribe(`/broker/user_events/${id}`, (e) => {
                handleMessage(JSON.parse(e.body))
            })
        }, () => {
        })
    }

    const fetchUsers = async () => {
        let res = await ProjectsService.getAllPersonsInProject(id)
        let arr = []
        for (let item of res) {
            let person = await ProfileService.getProfileById(item.personId)
            person['projectRole'] = item.role
            person['status'] = item.personId === user.id ? 'В сети' : 'Не в сети'
            arr.push(person)
        }
        setUsers(arr)
    }

    useEffect(() => {
        if (stompClientRef.current || !user.id)
            return
        openStompConnection()
        fetchUsers()
        window.addEventListener('mousemove', handleMouseMove)
        let i = setInterval(() => {
            sendMousePosition(lastMousePosition)
        }, [500])

        return () => {
            clearInterval(i)
            stompClientRef.current.send(`/app/user_events/${id}`, {}, JSON.stringify({
                type: 'DISCONNECT',
                personId: user.id
            }))
            window.removeEventListener('mousemove', handleMouseMove)
            stompClientRef.current.disconnect()
        }
    }, [user])

    const handleMessage = (msg) => {
        switch (msg.type) {
            case 'CONNECT': {
                setUsers(users => {
                    let arr = [...users]
                    let ind = arr.findIndex(item => item.id === msg.personId)
                    let person = arr[ind]
                    person['status'] = 'В сети'
                    arr.splice(ind, 1)
                    arr.unshift(person)
                    return arr
                })
                return
            }
            case 'DISCONNECT': {
                setUsers(users => {
                    let arr = [...users]
                    let ind = arr.findIndex(item => item.id === msg.personId)
                    let person = arr[ind]
                    person['status'] = 'Не в сети'
                    arr.splice(ind, 1)
                    arr.push(person)
                    return arr
                })
                return
            }
            case 'MOUSE_MOVE': {
                setMousePositions(mousePositions => {
                    if (user.id === msg.personId)
                        return mousePositions
                    let ind = mousePositions.findIndex(item => item.personId === msg.personId)
                    let arr = [...mousePositions]
                    console.log(ind)
                    if (ind >= 0) {
                        arr.splice(ind, 1)
                    }
                    return [{
                        personId: msg.personId,
                        x: msg.x,
                        y: msg.y
                    }, ...arr]
                })
                return;
            }
        }
    }

    const handleMouseMove = (e) => {
        lastMousePosition = {
            x: e.x,
            y: e.y
        }
    }

    const sendMousePosition = (position) => {
        stompClientRef.current.send(`/app/user_events/${id}`, {}, JSON.stringify({
            type: 'MOUSE_MOVE',
            personId: user.id,
            x: position.x,
            y: position.y
        }))
    }

    const getUserName = (personId) => {
        let usr = users.find(item => item.id === personId)
        return usr ? usr.name + ' ' + usr.surname : ''
    }

    return (
        <>
        <div className={styles.main} style={expanded ? {right: '0', zIndex: '1'} : {right: '-520px'}}>
            <button className={styles.expand_btn} onClick={() => {
                setExpanded(!expanded)
            }}>
                <img src={'/icons/group.svg'} width={'30px'}/>
            </button>
            <h1 style={{
                marginTop: '20px',
                textAlign: 'center',
                color: '#1c8ee9'
            }}>Пользователи</h1>
            <div className={styles.list}>
                {users.map(item => <div className={styles.user_item} style={item.status === 'В сети' ? {
                    borderColor: '#70bdfa'
                } : null} key={item.id}>
                    <div>
                        <Avatar {...chatStringAvatar(item.name + " " + item.surname, '60px', '12pt')} />
                        <div>
                            <p className={styles.username}>{item.name} {item.surname}</p>
                            <p>{projectRoleDecoding[item.projectRole]}</p>
                        </div>
                    </div>
                    <p>{item.email}</p>
                    <p style={item.status === 'В сети' ? {
                        color: 'green'
                    } : null}>{item.status}</p>
                </div>)}
            </div>
        </div>
            {mousePositions.map(item => <div key={item.personId} className={styles.mouse} style={{
                left: item.x + 'px',
                top: item.y + 'px',
            }}>
                <div className={styles.pointer}>
                    <img src={'/icons/cursor.png'} width={'20px'}/>
                </div>
                <p style={{
                    backgroundColor: stringToColor(getUserName(item.personId))
                }}>{getUserName(item.personId)}</p>
            </div>)}
        </>
    );
};

export default ActiveUserComponent;
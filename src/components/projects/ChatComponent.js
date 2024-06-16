import React, {useEffect, useRef, useState} from 'react';
import {Menu, MenuItem, TextField} from "@mui/material";
import styles from './styles/chatComponent.module.css'
import MessageComponent from "./MessageComponent";
import {useSelector} from "react-redux";
import {ProjectsService} from "../../services/ProjectsService";
import {ProfileService} from "../../services/ProfileService";

const ChatComponent = ({projectId}) => {
    const user = useSelector(state => state.user)
    const [messages, setMessages] = useState([])
    const [users, setUsers] = useState({})
    const chatAreaRef = useRef()
    const [newMessage, setNewMessage] = useState({
        personId: user.id,
        projectId: projectId,
        content: ''
    })
    const stompRef = useRef()
    const [anchorMsg, setAnchorMsg] = useState({
        anchor: null,
        id: '',
        content: ''
    })

    const openMessageMenu = Boolean(anchorMsg.anchor)
    const [editMsg, setEditMsg] = useState(false)

    function handleMessage(message) {
        switch (message.type) {
            case 'SEND':
                setMessages(messages => [...messages, message.message])
                return
            case 'DELETE':
                setMessages(messages => {
                    let arr = [...messages]
                    arr.splice(arr.findIndex(item => item.id === message.message.id), 1)
                    return arr
                })
                return;
            case 'EDIT':
                setMessages(messages => {
                    let arr = [...messages]
                    arr.splice(arr.findIndex(item => item.id === message.message.id), 1, message.message)
                    return arr
                })
                return;
        }
    }

    useEffect(() => {
        if (stompRef.current != null)
            return
        const Stomp = require("stompjs");
        let Sockjs = require("sockjs-client");
        Sockjs = new Sockjs(`${process.env.REACT_APP_PROJECTS_WS}/ws`);
        let client = Stomp.over(Sockjs);
        stompRef.current = client
        client.connect({}, () => {
            client.subscribe(`/messages/${projectId}`, (e) => {
                handleMessage(JSON.parse(e.body))
            })
        }, () => {
        })
        fetchMessages()
        fetchPersons()
    }, [])

    const sendMessage = (message) => {
        stompRef.current.send(`/app/chat/${projectId}`, {}, JSON.stringify({
            type: 'SEND',
            message: message
        }))
    }

    const sendDeleteEvent = (id) => {
        stompRef.current.send(`/app/chat/${projectId}`, {}, JSON.stringify({
            type: 'DELETE',
            message: {
                id: id
            }
        }))
    }

    const sendEditEvent = (id, message) => {
        stompRef.current.send(`/app/chat/${projectId}`, {}, JSON.stringify({
            type: 'EDIT',
            message: {...message, id: id}
        }))
    }

    useEffect(() => {
        chatAreaRef.current.scrollTo(0, chatAreaRef.current.scrollHeight)
    }, [messages])

    const fetchMessages = async () => {
        setMessages((await ProjectsService.fetchMessages(projectId)).map(msg => msg.message))
    }

    const fetchPersons = async () => {
        let persons = await ProjectsService.getAllPersonsInProject(projectId)
        let users = {}
        for (let item of persons) {
            let person = await ProfileService.getProfileById(item.personId)
            person['projectRole'] = item.role
            users[item.personId] = person
        }
        setUsers(users)
    }

    const pushMessage = (editMsg, message) => {
        if (editMsg) {
            sendEditEvent(anchorMsg.id, message)
        } else {
            sendMessage(message)
        }
        setNewMessage({
            personId: user.id,
            projectId: projectId,
            content: ''
        })
        setEditMsg(false)
    }
    return (
        <div className={styles.chat}>
            <div ref={chatAreaRef} className={styles.chat_area}>
                {
                    messages.map(item =>
                        <MessageComponent key={item.id} item={item} sender={users[item.personId]}
                                          rightClickCallback={setAnchorMsg}
                                          self={item.personId === user.id}/>
                    )
                }
                <Menu open={openMessageMenu} onClose={() => {
                    setAnchorMsg({
                        anchor: null,
                        id: '',
                        content: ''
                    })
                    setEditMsg(false)
                }} anchorEl={anchorMsg.anchor}>
                    <MenuItem onClick={() => {
                        setNewMessage({...newMessage, content: anchorMsg.content})
                        setEditMsg(true)
                        setAnchorMsg({...anchorMsg, anchor: null})
                    }}>Редактировать</MenuItem>
                    <MenuItem onClick={() => {
                        sendDeleteEvent(anchorMsg.id)
                        setAnchorMsg({
                            anchor: null,
                            id: '',
                            content: ''
                        })
                    }}>Удалить</MenuItem>
                </Menu>
            </div>
            <div className={styles.message_area} onKeyDown={(e) => {
                if (e.key === 'Enter') {
                    pushMessage(editMsg, newMessage)
                }
            }}>
                {/*TODO запретить отправку пустого сообщения*/}
                <TextField value={newMessage.content} onChange={(e) => {
                    setNewMessage({...newMessage, content: e.target.value })
                }} placeholder={'Введите сообщение'} fullWidth/>
                <button className={styles.send_btn} onClick={() => {
                    pushMessage(editMsg, newMessage)
                }}>
                    <img src={'/icons/send.svg'} width={'25px'}/>
                </button>
            </div>
        </div>
    );
};

export default ChatComponent;
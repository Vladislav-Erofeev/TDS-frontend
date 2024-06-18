import React, {useEffect, useRef, useState} from 'react';
import {CircularProgress, Menu, MenuItem, TextField} from "@mui/material";
import styles from './styles/chatComponent.module.css'
import MessageComponent from "./MessageComponent";
import {useSelector} from "react-redux";
import {ProjectsService} from "../../services/ProjectsService";
import {ProfileService} from "../../services/ProfileService";
import ChatNotificationComponent from "./ChatNotificationComponent";

const ChatComponent = ({projectId}) => {
    const user = useSelector(state => state.user)
    const [endOfChat, setEndOfChat] = useState(false)
    const [messages, setMessages] = useState([])
    const [users, setUsers] = useState({})
    const chatAreaRef = useRef()
    const [newMessage, setNewMessage] = useState({
        personId: user.id,
        projectId: projectId,
        messageType: 'USER_MESSAGE',
        content: ''
    })
    const stompRef = useRef()
    const [anchorMsg, setAnchorMsg] = useState({
        anchor: null,
        id: '',
        content: ''
    })

    const openMessageMenu = Boolean(anchorMsg.anchor)
    const [page, setPage] = useState(0)
    const [editMsg, setEditMsg] = useState(false)
    const [lastScrollHeight, setLastScrollHeight] = useState(0)
    const [unvisibleCounter, setUnvisibleCounter] = useState(0)

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
            client.subscribe(`/broker/chat/${projectId}`, (e) => {
                handleMessage(JSON.parse(e.body))
            })
        }, () => {
        })
        fetchMessages()
        fetchPersons()
        return () => {
            client.disconnect()
        }
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
        if (chatAreaRef.current.scrollTop === 0)
            chatAreaRef.current.scrollTo(0, chatAreaRef.current.scrollHeight - lastScrollHeight)
        else if (chatAreaRef.current.scrollTop + chatAreaRef.current.clientHeight + 100 > chatAreaRef.current.scrollHeight)
            chatAreaRef.current.scrollTo(0, chatAreaRef.current.scrollHeight)
        else
            setUnvisibleCounter(c => c + 1)
    }, [messages])

    const fetchMessages = async () => {
        setMessages((await ProjectsService.fetchMessages(projectId)).map(msg => msg.message).reverse())
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
            chatAreaRef.current.scrollTo(0, chatAreaRef.current.scrollHeight)
            sendMessage(message)
        }
        setNewMessage({
            personId: user.id,
            projectId: projectId,
            content: ''
        })
        setEditMsg(false)
    }

    const fetchPersonById = async (id) => {
        let persons = {...users}
        persons[id] = await ProfileService.getProfileById(id)
        setUsers(persons)
    }

    const loadMoreMessages = async () => {
        if (endOfChat)
            return
        let res = await ProjectsService.fetchMessages(projectId, page + 1)
        if (res.length === 0 && page !== 0)
            setEndOfChat(true)
        setMessages(messages => {
            return [...res.reverse().map(msg => msg.message), ...messages]
        })
        setPage(page => page + 1)
    }

    return (
        <div className={styles.chat}>
            <div ref={chatAreaRef} className={styles.chat_area} onScroll={(e) => {
                if (e.target.scrollTop === 0) {
                    setLastScrollHeight(e.target.scrollHeight)
                    loadMoreMessages()
                }
            }}>
                {messages.length === 0 ? <h1 style={{
                    margin: 'auto',
                    color: '#1c8ee9'
                }}>Начните общение прямо сейчас</h1> : null}
                {chatAreaRef.current && !endOfChat && messages.length > 0 && chatAreaRef.current.scrollHeight > chatAreaRef.current.clientHeight  ?
                    <CircularProgress sx={{margin: 'auto'}}/> : null}
                {
                    messages.map(item =>
                        item.messageType === "USER_MESSAGE" ?
                            <MessageComponent key={item.id} item={item} sender={users[item.personId]}
                                              rightClickCallback={setAnchorMsg}
                                              self={item.personId === user.id}/>
                            : <ChatNotificationComponent fetchUser={fetchPersonById} item={item}
                                                         key={item.id}
                                                         name={users[item.personId]}/>
                    )
                }
                {unvisibleCounter > 0 ? <button className={styles.down_btn} onClick={() => {
                    chatAreaRef.current.scrollTo(0, chatAreaRef.current.scrollHeight)
                    setUnvisibleCounter(0)
                }}>
                    <p className={styles.unvisible_counter}>{unvisibleCounter}</p>
                    <img src={'/icons/-expand-more_89793.svg'} width={'35px'}/>
                </button> : null}
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
                    setNewMessage({...newMessage, content: e.target.value})
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
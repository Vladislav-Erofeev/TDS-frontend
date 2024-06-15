import React, {useEffect, useRef, useState} from 'react';
import {TextField} from "@mui/material";
import styles from './styles/chatComponent.module.css'
import MessageComponent from "./MessageComponent";
import {useSelector} from "react-redux";
import {ProjectsService} from "../../services/ProjectsService";
import {ProfileService} from "../../services/ProfileService";

const ChatComponent = ({projectId}) => {
    const [messages, setMessages] = useState([])
    const [users, setUsers] = useState({})
    const chatAreaRef = useRef()
    const [typeText, setTypeText] = useState('')
    const user = useSelector(state => state.user)
    const stompRef = useRef()

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
                setMessages(messages => [...messages, JSON.parse(e.body)])
            })
        }, () => {
        })
        fetchMessages()
        fetchPersons()
    }, [])

    const sendMessage = (personId, text) => {
        stompRef.current.send(`/app/chat/${projectId}`, {}, JSON.stringify({
            personId: personId,
            projectId: projectId,
            content: text
        }))
    }

    useEffect(() => {
        chatAreaRef.current.scrollTo(0, chatAreaRef.current.scrollHeight)
    }, [messages])

    const fetchMessages = async () => {
        setMessages(await ProjectsService.fetchMessages(projectId))
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
    return (
        <div className={styles.chat}>
            <div ref={chatAreaRef} className={styles.chat_area}>
                {
                    messages.map(item =>
                        <MessageComponent key={item.id} item={item} sender={users[item.personId]}
                                          self={item.personId === user.id}/>
                    )
                }
            </div>
            <div className={styles.message_area} onKeyDown={(e) => {
                if (e.key === 'Enter') {
                    sendMessage(user.id, typeText)
                    setTypeText('')
                }
            }}>
                <TextField value={typeText} onChange={(e) => {
                    setTypeText(e.target.value)
                }} placeholder={'Введите сообщение'} fullWidth/>
                <button className={styles.send_btn} onClick={() => {
                    sendMessage(user.id, typeText)
                    setTypeText('')
                }}>
                    <img src={'/icons/send.svg'} width={'25px'}/>
                </button>
            </div>
        </div>
    );
};

export default ChatComponent;
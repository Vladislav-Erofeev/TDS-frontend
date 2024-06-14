import React, {useState} from 'react';
import {TextField} from "@mui/material";
import styles from './styles/chatComponent.module.css'
import MessageComponent from "./MessageComponent";

const ChatComponent = () => {
    const [messages, setMessages] = useState([])
    return (
        <div>
            <div className={styles.chat_area}>
                <MessageComponent />
            </div>
            <div className={styles.message_area}>
                <TextField placeholder={'Введите сообщение'} fullWidth/>
                <button className={styles.send_btn}>
                    <img src={'/icons/send.svg'} width={'25px'}/>
                </button>
            </div>
        </div>
    );
};

export default ChatComponent;
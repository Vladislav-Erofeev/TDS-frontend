import React from 'react';
import {Avatar} from "@mui/material";
import styles from './styles/messageComponent.module.css'
import {getTimeWithTz} from "../../data/functions";

const MessageComponent = ({self, item}) => {
    return (
        self ? <div className={styles.self_message}>
                <div className={styles.content}>
                    <p className={styles.message_content}>{item.content}</p>
                    <p className={styles.send_time}>{getTimeWithTz(item.sendTime, "HH:mm")}</p>
                </div>
            </div> :
            <div className={styles.message}>
                <Avatar/>
                <div className={styles.content}>
                    <p>{item.personId}</p>
                    <p className={styles.message_content}>{item.content}</p>
                    <p className={styles.send_time}>{getTimeWithTz(item.sendTime, "HH:mm")}</p>
                </div>
            </div>
    );
};

export default MessageComponent;
import React from 'react';
import {Avatar} from "@mui/material";
import styles from './styles/messageComponent.module.css'
import {chatStringAvatar, getTimeWithTz, stringAvatar} from "../../data/functions";

const MessageComponent = ({self, item, sender, rightClickCallback}) => {
    const handleOpen = (e) => {
        e.preventDefault()
        rightClickCallback({
            anchor: e.target,
            id: item.id,
            content: item.content
        })
    }

    return (
        self ? <div className={styles.self_message} onContextMenu={handleOpen}>
                <div className={styles.content}>
                    <p className={styles.message_content}>{item.content}</p>
                    <p className={styles.send_time}>{item.edited ? 'изменено ' : ''}
                        {getTimeWithTz(item.sendTime, "HH:mm")}</p>
                </div>
            </div> :
            <div className={styles.message}>
                {sender ?
                    <Avatar {...chatStringAvatar(sender.name + " " + sender.surname)}/>
                    : <Avatar/>}
                <div className={styles.content}>
                    <div className={styles.sender_data}>
                        <p>{sender ? sender.name + " " + sender.surname : null}</p>
                        {sender ?
                            <p>{sender.projectRole === 'OWNER' ? 'Владелец' :
                                sender.projectRole === 'ADMIN' ? 'Администратор' : null}</p>
                            :
                            null
                        }
                    </div>
                    <p className={styles.message_content}>{item.content}</p>
                    <p className={styles.send_time}>{item.edited ? 'изменено ' : ''}
                        {getTimeWithTz(item.sendTime, "HH:mm")}</p>
                </div>
            </div>
    );
};

export default MessageComponent;
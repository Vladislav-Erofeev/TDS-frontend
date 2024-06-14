import React from 'react';
import {Avatar} from "@mui/material";
import styles from './styles/messageComponent.module.css'

const MessageComponent = () => {
    return (
        <div className={styles.message}>
            <Avatar/>
            <p className={styles.content}>my very very very very very very very very very long message</p>
        </div>
    );
};

export default MessageComponent;
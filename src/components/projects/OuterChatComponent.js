import React, {useState} from 'react';
import {useParams} from "react-router";
import styles from './styles/outerChatComponent.module.css'
import ChatComponent from "./ChatComponent";

const OuterChatComponent = () => {
    const {id} = useParams()
    const [expanded, setExpanded] = useState(false)
    return (
        <div className={styles.main} style={expanded ? {
            right: '0'
        } : {
            right: '-510px'
        }}>
            <button className={styles.open_btn} onClick={() => {
                setExpanded(!expanded)
            }}>
                <img src={'/icons/chat.svg'} width={'30px'}/>
            </button>
            <ChatComponent projectId={id} />
        </div>
    );
};

export default OuterChatComponent;
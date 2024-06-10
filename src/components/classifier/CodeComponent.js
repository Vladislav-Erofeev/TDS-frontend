import React, {useState} from 'react';
import styles from './styles/codeComponent.module.css'
import {useSelector} from "react-redux";
import {hasRole} from "../../data/functions";

const CodeComponent = ({code, remove}) => {
    const user = useSelector(state => state.user)
    return (
        <div className={styles.code}>
            <p>{code.code} - {code.name}</p>
            <p>{code.creationDate}</p>
            {hasRole('ADMIN') ?
                <button style={{
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer'
                }} onClick={() => {
                    remove(code.id)
                }}>
                    <img src={'/icons/remove.svg'} width={'20px'}/>
                </button>
            : null}
        </div>
    );
};

export default CodeComponent;
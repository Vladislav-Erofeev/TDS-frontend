import React from 'react';
import styles from './styles/codeComponent.module.css'

const CodeComponent = ({code, remove}) => {
    return (
        <div className={styles.code}>
            <p>{code.code} - {code.name}</p>
            <p>{code.creationDate}</p>
            <button style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer'
            }} onClick={() => {
                remove(code.id)
            }}>
                <img src={'/icons/remove.svg'} width={'20px'}/>
            </button>
        </div>
    );
};

export default CodeComponent;
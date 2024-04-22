import React, {useState} from 'react';
import styles from './styles/objectInfoComponent.module.css'
import LayerSelection from "./LayerSelection";

const ObjectInfoComponent = () => {
    const [expanded, setExpanded] = useState(true)
    return (
        <>
            {/*<button className={styles.expand_btn} style={*/}
            {/*    expended ? {left: '480px'} : {left: '1%'}*/}
            {/*} onClick={() => {*/}
            {/*    setExpanded(!expended)*/}
            {/*}}>*/}
            {/*    <img src={expended ? '/icons/hide.svg' : '/icons/show.svg'} width={'30px'}/>*/}
            {/*</button>*/}
            <div className={styles.main} style={
                expanded ? {left: '0px'} : {left: '-470px'}
            }>
                <button className={styles.expand_btn} onClick={() => {
                    setExpanded(!expanded)
                }}>
                    <img src={'/icons/expand.svg'} width={'20px'}/>
                </button>
                <h1>Выберите слой</h1>
                <LayerSelection/>
            </div>
        </>
    );
};

export default ObjectInfoComponent;
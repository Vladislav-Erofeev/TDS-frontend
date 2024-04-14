import React, {useState} from 'react';
import styles from './styles/classifierPage.module.css'
import {Tab, Tabs} from "@mui/material";
import TabComponent from "../components/TabComponent";
import LayersComponent from "../components/LayersComponent";

const ClassifierPage = () => {
    const [tab, setTab] = useState(0)
    return (
        <div className={styles.main}>
            <h1>Классификатор</h1>
            <p>Здесь вы можете просматривать классификатор и изменять его</p>
            <Tabs value={tab} onChange={(e, v) => {
                setTab(v)
            }}>
                <Tab label={'Слои'} />
                <Tab label={'Атрибуты'} />
                <Tab label={'Коды'} />
            </Tabs>
            <TabComponent value={0} currentValue={tab} component={<LayersComponent />}/>
        </div>
    );
};

export default ClassifierPage;
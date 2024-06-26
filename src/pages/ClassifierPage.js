import React, {useState} from 'react';
import styles from './styles/classifierPage.module.css'
import {Tab, Tabs} from "@mui/material";
import TabComponent from "../components/TabComponent";
import LayersComponent from "../components/LayersComponent";
import CodesTabComponent from "../components/CodesTabComponent";
import AttributesTabComponent from "../components/AttributesTabComponent";

const ClassifierPage = () => {
    const [tab, setTab] = useState(0)
    return (
        <div className={styles.main}>
            <h1>Классификатор</h1>
            <p style={{
                marginTop: '10px'
            }}>Здесь вы можете просматривать классификатор и изменять его</p>
            <Tabs value={tab} onChange={(e, v) => {
                setTab(v)
            }} sx={{
                marginTop: '30px'
            }}>
                <Tab label={'Слои'}/>
                <Tab label={'Атрибуты'}/>
                <Tab label={'Коды'}/>
            </Tabs>
            <TabComponent value={0} currentValue={tab} component={<LayersComponent/>}/>
            <TabComponent value={1} currentValue={tab} component={<AttributesTabComponent/>}/>
            <TabComponent value={2} currentValue={tab} component={<CodesTabComponent/>}/>
        </div>
    );
};

export default ClassifierPage;
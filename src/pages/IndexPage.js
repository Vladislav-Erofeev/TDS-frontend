import React from 'react';
import styles from './styles/indexPage.module.css'
import {NavLink} from "react-router-dom";
import {Divider} from "@mui/material";

const IndexPage = () => {
    return (
        <div>
            <div className={styles.head_block}>
                <div className={styles.title}>
                    <h1>TDS - Terrain Digitilizing System</h1>
                    <p>Получите доступ ко всему миру в своём компьютере</p>
                    <NavLink to={'/map'}>Начать работу</NavLink>
                </div>
                <img src={'/images/image58.png'} width={'500px'}/>
            </div>

            <h1 className={styles.head_title}>Наши возможности</h1>
            <Divider sx={{
                width: '100px',
                margin: 'auto',
                backgroundColor: 'black',
                height: '2px'
            }} />
            <div className={styles.card_list}>
                <div className={styles.card_main}>
                    <img src={'/images/image2.png'} width={'350px'}/>
                    <div className={styles.card_description}>
                        <h2>Базовая карта</h2>
                        <p>Вам доступен просмотр базовой карты</p>
                    </div>
                </div>
                <div className={styles.card_main}>
                    <img src={'/images/image4.png'} width={'350px'}/>
                    <div className={styles.card_description}>
                        <h2>Геопространственный поиск</h2>
                        <p>Вы можете пользоваться геокодированными поиском объектов по адресу</p>
                    </div>
                </div>
                {/*<div className={styles.card_main}>*/}
                {/*    <img src={'/images/image3.png'} width={'350px'}/>*/}
                {/*    <div className={styles.card_description}>*/}
                {/*        <h2>Тайловое покрытие</h2>*/}
                {/*        <p>Описание</p>*/}
                {/*    </div>*/}
                {/*</div>*/}
            </div>

            <h1 style={{
                marginTop: '160px'
            }} className={styles.head_title}>Добавляйте свои данные</h1>
            <Divider sx={{
                width: '100px',
                margin: 'auto',
                backgroundColor: 'black',
                height: '2px'
            }} />
            <p className={styles.title_descr}>Добавляйте свои геоданные в понятной и удобной для обработки структуре</p>
            <img src={'/images/example.png'} className={styles.image} width={'80%'}/>
            <footer className={styles.footer}>
                <p>© TDS 2024. Все права защищены</p>
                <p>+7 (999) 999-99-99</p>
                <div>
                    <ul>
                        <li><NavLink to={'/'}>Главная</NavLink></li>
                        <li><NavLink to={'/map'}>Карта</NavLink></li>
                        <li><NavLink to={'/classifier'}>Классификатор</NavLink></li>
                        <li><NavLink to={'/profile'}>Профиль</NavLink></li>
                    </ul>
                </div>
                <div className={styles.links}>
                    <a><img src={'/images/vk.png'} width={'35px'}/></a>
                    <a><img src={'/images/github.png'} width={'35px'}/></a>
                    <a><img src={'/images/tg.png'} width={'35px'}/></a>
                </div>
            </footer>
        </div>
    );
};

export default IndexPage;
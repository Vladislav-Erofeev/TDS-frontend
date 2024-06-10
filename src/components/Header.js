import React from 'react';
import {Outlet} from "react-router";
import {NavLink} from "react-router-dom";
import styles from './styles/header.module.css'
import {hasRole} from "../data/functions";
import {useSelector} from "react-redux";

const Header = () => {
    const user = useSelector(state => state.user)
    return (
        <>
            <header className={styles.header}>
                <NavLink to={'/'}>
                    <h1>
                        <img src={'/icons/logo.svg'} width={'40px'}/>
                        TDS
                    </h1>
                </NavLink>
                <nav>
                    <ul>
                        <li><NavLink to={'map'}>карта</NavLink></li>
                        <li className={styles.expanded}>
                            <p className={styles.expanded_btn}>продукты<img src={'/icons/-expand-more_89793.svg'}
                                                                            width={'20px'}/></p>
                            <ul className={styles.expanded_links}>
                                <li><NavLink to={'classifier'}>
                                    <img src={'/icons/book.svg'} width={'30px'}/>
                                    <div>
                                        <p>классификатор</p>
                                        <p>классификация объектов</p>
                                    </div>
                                </NavLink></li>
                                <li><NavLink to={'objects'}>
                                    <img src={'/icons/globe.svg'} width={'30px'}/>
                                    <div>
                                        <p>Объекты</p>
                                        <p>Список геоданных</p>
                                    </div>
                                </NavLink></li>
                                <li><NavLink to={'geocoding'}>
                                    <img src={'/icons/map_pin.svg'} width={'30px'}/>
                                    <div>
                                        <p>Геокодер</p>
                                        <p>Адресный поиск</p>
                                    </div>
                                </NavLink></li>
                                <li><NavLink to={'load'}>
                                    <img src={'/icons/download.svg'} width={'30px'}/>
                                    <div>
                                        <p>Загрузка</p>
                                        <p>Загрузить геоданные</p>
                                    </div>
                                </NavLink></li>
                            </ul>
                        </li>
                    </ul>
                </nav>
                {
                    hasRole('ADMIN', 'USER', 'MODERATOR') ? <NavLink className={styles.profile} to={'/profile'}>
                        Профиль
                    </NavLink> : <div className={styles.enter_btns}>
                        <NavLink to={'/register'}>Регистрация</NavLink>
                        <NavLink className={styles.profile} to={'/login'}>
                            Войти
                        </NavLink>
                    </div>
                }

            </header>
            <Outlet/>
        </>
    );
};

export default Header;
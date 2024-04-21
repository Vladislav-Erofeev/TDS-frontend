import React from 'react';
import {Outlet} from "react-router";
import {NavLink} from "react-router-dom";
import styles from './styles/header.module.css'

const Header = () => {
    return (
        <>
            <header className={styles.header}>
                <h1>
                    <img src={'/icons/logo.svg'} width={'40px'}/>
                    TDS
                </h1>
                <nav>
                    <ul>
                        <li><NavLink to={'/map'}>карта</NavLink></li>
                        <li><NavLink to={'/objects'}>объекты</NavLink></li>
                        <li><NavLink to={'/classifier'}>классификатор</NavLink></li>
                    </ul>
                </nav>
                <NavLink className={styles.profile} to={'/profile'}>
                    Профиль
                </NavLink>
            </header>
            <Outlet/>
        </>
    );
};

export default Header;
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
                        <li><NavLink to={'objects'}>объекты</NavLink></li>
                        <li><NavLink to={'classifier'}>классификатор</NavLink></li>
                    </ul>
                </nav>
                {
                    hasRole('ADMIN', 'USER') ? <NavLink className={styles.profile} to={'/profile'}>
                        Профиль
                    </NavLink> : <NavLink className={styles.profile} to={'/login'}>
                        Войти
                    </NavLink>
                }

            </header>
            <Outlet/>
        </>
    );
};

export default Header;
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
                        {hasRole("ADMIN", 'MODERATOR') ?
                            <li><NavLink to={'unchecked'}>На проверку</NavLink></li>
                            : null}
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
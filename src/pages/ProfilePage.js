import React, {useEffect} from 'react';
import {useSelector} from "react-redux";
import {Avatar, CircularProgress} from "@mui/material";
import {useNavigate} from "react-router";
import {store} from "../redux/store";
import {TokenService} from "../services/TokenService";
import {stringAvatar} from "../data/functions";
import styles from './styles/profilePage.module.css'

const ProfilePage = () => {
    const user = useSelector(state => state.user)
    const userLoading = useSelector(state => state.loading)
    const navigate = useNavigate()
    useEffect(() => {
        if (!userLoading && !user)
            navigate('/login')
    }, [userLoading])
    return (
        <div>
            {
                userLoading ? <CircularProgress sx={{
                    margin: '30px auto'
                }}/> : <div>
                    <h1 className={styles.title}>Профиль</h1>
                    <div className={styles.user_data}>
                        <div className={styles.avatar}>
                            <Avatar {...stringAvatar(`${user.name} ${user.surname}`)} />
                            <button className={styles.logout} onClick={() => {
                                TokenService.logout()
                            }}>выйти
                            </button>
                        </div>
                        <div>
                            <h1>{user.surname} {user.name}</h1>
                            <div className={styles.info}>
                                <div>
                                    <p>Почта: </p>
                                    <p>{user.email}</p>
                                </div>
                                <div>
                                    <p>Номер телефона: </p>
                                    <p>{user.phone ? user.phone : 'Не указано'}</p>
                                </div>
                                <div>
                                    <p>Адрес: </p>
                                    <p>{user.addr ? user.addr : 'Не указано'}</p>
                                </div>
                                <div>
                                    <p>Дата рождения: </p>
                                    <p>{user.birthDate ? user.birthDate : 'Не указано'}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            }

        </div>
    );
};

export default ProfilePage;
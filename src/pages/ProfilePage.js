import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from "react-redux";
import {Avatar, CircularProgress, TextField} from "@mui/material";
import {useNavigate} from "react-router";
import {store} from "../redux/store";
import {TokenService} from "../services/TokenService";
import {stringAvatar} from "../data/functions";
import styles from './styles/profilePage.module.css'
import ProfileLineChart from "../ui/ProfileLineChart";
import {setUserAction} from "../redux/userReducer";
import {ProfileService} from "../services/ProfileService";

const ProfilePage = () => {
    const user = useSelector(state => state.user)
    const userLoading = useSelector(state => state.loading)
    const dispatch = useDispatch()
    const [errors, setErrors] = useState({
        name: '',
        surname: '',
        phone: ''
    })
    const [editMode, setEditMode] = useState(false)
    const [newUser, setNewUser] = useState()
    const navigate = useNavigate()
    useEffect(() => {
        if (!userLoading && !user)
            navigate('/login')
        setNewUser(user)
    }, [userLoading])

    const save = () => {
        ProfileService.editProfile(newUser)
        dispatch(setUserAction(newUser))
    }

    const isDataCorrect = () => {
        let isCorrect = true
        let report = {...errors}
        if (newUser.phone !== null && isNaN(parseInt(newUser.phone))) {
            isCorrect = false
            report.phone = 'Неверный формат данных'
        } else {
            report.phone = ''
        }

        if (newUser.surname === '') {
            isCorrect = false
            report.surname = 'Поле не может быть пустым'
        } else {
            report.surname = ''
        }

        if (newUser.name === '') {
            isCorrect = false
            report.name = 'Поле не может быть пустым'
        } else {
            report.name = ''
        }

        setErrors(report)
        return isCorrect
    }
    return (
        <div>
            {
                userLoading ? <CircularProgress sx={{
                    margin: '30px auto',
                    display: 'block'
                }}/> : <div>
                    <h1 className={styles.title}>Профиль</h1>
                    <div className={styles.user_data}>
                        <div className={styles.avatar}>
                            <Avatar {...stringAvatar(`${user.name} ${user.surname}`)} />
                            {editMode ?
                                <button onClick={() => {
                                    if (isDataCorrect()) {
                                        save()
                                        setEditMode(false)
                                    }
                                }} className={styles.edit_btn}>сохранить</button>
                                :
                                <button onClick={() => {
                                    setEditMode(true)
                                }} className={styles.edit_btn}>
                                    редактировать
                                </button>
                            }
                            <button className={styles.logout} onClick={() => {
                                TokenService.logout()
                            }}>выйти
                            </button>
                        </div>
                        <div>
                            {!editMode ?
                                <h1>{user.surname} {user.name} {user.lastname}</h1> : null}
                            <div className={styles.info}>
                                <div>
                                    <p>Почта: </p>
                                    <p>{user.email}</p>
                                </div>
                                {editMode ?
                                    <>
                                        <div>
                                            <p>Имя*:</p>
                                            <TextField value={newUser.name}
                                                       error={errors.name !== ''}
                                                       helperText={errors.name}
                                                       onChange={(e) => {
                                                           setNewUser({...newUser, name: e.target.value})
                                                       }}/>
                                        </div>
                                        <div>
                                            <p>Фамилия*:</p>
                                            <TextField value={newUser.surname}
                                                       error={errors.surname !== ''}
                                                       helperText={errors.surname}
                                                       onChange={(e) => {
                                                           setNewUser({...newUser, surname: e.target.value})
                                                       }}/>
                                        </div>
                                        <div>
                                            <p>Отчество:</p>
                                            <TextField value={newUser.lastname} onChange={(e) => {
                                                setNewUser({...newUser, lastname: e.target.value})
                                            }}/>
                                        </div>
                                    </>
                                    : null}
                                <div>
                                    <p>Номер телефона: </p>
                                    {editMode ? <TextField
                                            value={newUser.phone}
                                            error={errors.phone !== ''}
                                            helperText={errors.phone}
                                            onChange={(e) => {
                                                setNewUser({...newUser, phone: e.target.value})
                                            }}/> :
                                        <p>{user.phone ? user.phone : 'Не указано'}</p>}
                                </div>
                                <div>
                                    <p>Адрес: </p>
                                    {editMode ? <TextField
                                            value={newUser.addr}
                                            onChange={(e) => {
                                                setNewUser({...newUser, addr: e.target.value})
                                            }}/> :
                                        <p>{user.addr ? user.addr : 'Не указано'}</p>}
                                </div>
                                <div>
                                    <p>Дата рождения: </p>
                                    {editMode ? <TextField
                                            value={newUser.birthDate}
                                            onChange={(e) => {
                                                setNewUser({...newUser, birthDate: e.target.value})
                                            }}
                                            placeholder={'дд.мм.гггг'}
                                        /> :
                                        <p>{user.birthDate ? user.birthDate : 'Не указано'}</p>}
                                </div>
                                <div>
                                    <p>Роль: </p>
                                    <p>{user.role}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <h1 style={{
                        textAlign: 'center',
                    }}>Активность пользователя</h1>
                    <ProfileLineChart/>

                </div>
            }

        </div>
    );
};

export default ProfilePage;
import React, {useState} from 'react';
import {NavLink} from "react-router-dom";
import styles from './styles/registerPage.module.css'
import {CircularProgress, TextField} from "@mui/material";
import {ProfileService} from "../services/ProfileService";
import {useNavigate} from "react-router";


const nullUser = {
    name: '',
    surname: '',
    lastname: '',
    email: '',
    password: '',
    phone: '',
    addr: '',
    birthDate: ''
}
const RegisterPage = () => {
    const [user, setUser] = useState(nullUser)
    const navigate = useNavigate()
    const [isLoading, setIsLoading] = useState(false)
    const register = () => {
        let push = async () => {
            user.phone = parseInt(user.phone)
            await ProfileService.register(user)
            setIsLoading(false)
            navigate('/login')
        }
        setIsLoading(true)
        push()
    }
    return (
        <div className={styles.back}>
            <div className={styles.container}>
                <NavLink to={'/map'} className={styles.back_btn}>назад</NavLink>
                <h1>Регистрация</h1>
                <div className={styles.inputs}>
                    <TextField value={user.name}
                               onChange={(e) => {
                                   setUser({...user, name: e.target.value})
                               }}
                               fullWidth
                               label={'Имя'}/>
                    <TextField
                        value={user.surname}
                        onChange={(e) => {
                            setUser({...user, surname: e.target.value})
                        }}
                        fullWidth
                        label={'Фамилия'}/>
                    <TextField value={user.lastname}
                               onChange={(e) => {
                                   setUser({...user, lastname: e.target.value})
                               }} fullWidth label={'Отчество'}/>
                    <TextField value={user.addr}
                               onChange={(e) => {
                                   setUser({...user, addr: e.target.value})
                               }} fullWidth label={'Адрес'}/>
                    <TextField value={user.birthDate}
                               onChange={(e) => {
                                   setUser({...user, birthDate: e.target.value})
                               }} fullWidth placeholder={'дд.мм.гггг'} label={'Дата рождения'}/>
                    <TextField value={user.email}
                               onChange={(e) => {
                                   setUser({...user, email: e.target.value})
                               }} fullWidth label={'Почта'}/>
                    <TextField value={user.phone}
                               onChange={(e) => {
                                   setUser({...user, phone: e.target.value})
                               }} fullWidth label={'Номер телефона'}/>
                    <TextField value={user.password}
                               type={'password'}
                               onChange={(e) => {
                                   setUser({...user, password: e.target.value})
                               }} fullWidth label={'Пароль'}/>
                </div>
                {isLoading ? <CircularProgress sx={{
                        margin: '20px auto'
                    }}/> :
                    <button className={styles.register} onClick={() => {
                        register()
                    }}>
                        Зарегистрироваться
                    </button>
                }
            </div>
        </div>
    );
};

export default RegisterPage;
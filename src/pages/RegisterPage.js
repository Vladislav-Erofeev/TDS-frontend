import React, {useState} from 'react';
import {NavLink} from "react-router-dom";
import styles from './styles/registerPage.module.css'
import {CircularProgress, TextField} from "@mui/material";
import {ProfileService} from "../services/ProfileService";
import {useNavigate} from "react-router";
import {isDateCorrect, isEmailCorrect} from "../data/functions";
import {useDispatch} from "react-redux";
import {setErrorAction} from "../redux/messageReducer";
import axios from "axios";


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
    const dispatch = useDispatch()
    const [errors, setErrors] = useState({
        password: '',
        phone: '',
        name: '',
        surname: '',
        email: '',
        birthDate: ''
    })
    const [isLoading, setIsLoading] = useState(false)
    const register = () => {
        let push = async () => {
            user.phone = user.phone !== '' ? parseInt(user.phone) : ''
            try {
                await ProfileService.register(user)
                navigate('/login')
            } catch (e) {
                switch (e.code) {
                    case axios.AxiosError.ERR_BAD_REQUEST:
                        setErrors({...errors, email: 'Пользователь с таким email уже существует'})
                        break
                    case axios.AxiosError.ERR_NETWORK:
                        dispatch(setErrorAction("Упс! Сетевая ошибка"))
                        break
                    default:
                        dispatch(setErrorAction("Упс! Произошла ошибка не сервере"))
                        break
                }
            }
            setIsLoading(false)
        }
        setIsLoading(true)
        push()
    }

    const isDataCorrect = () => {
        let report = {...errors}
        let hasErrors = false
        if (user.phone !== '' && isNaN(parseInt(user.phone))) {
            report.phone = 'Неверный формат данных'
            hasErrors = true
        } else {
            report.phone = ''
        }
        if (user.email === '') {
            report.email = 'Поле не может быть пустым'
            hasErrors = true
        } else if (!isEmailCorrect(user.email)) {
            report.email = 'Почта должна быть валидной'
            hasErrors = true
        } else {
            report.email = ''
        }
        if (user.password === '') {
            report.password = 'Поле не может быть пустым'
            hasErrors = true
        } else if (user.password.length < 6) {
            report.password = 'Длина пароля должна быть более 6 символов'
            hasErrors = true
        } else {
            report.password = ''
        }
        if (user.name === '') {
            report.name = 'Поле не может быть пустым'
            hasErrors = true
        } else {
            report.name = ''
        }
        if (user.surname === '') {
            report.surname = 'Поле не может быть пустым'
            hasErrors = true
        } else {
            report.surname = ''
        }

        if (user.birthDate !== '' && !isDateCorrect(user.birthDate)) {
            hasErrors = true
            report.birthDate = "Неверный формат даты. Дата должна быть в формате: дд.мм.гггг"
        } else {
            report.birthDate = ""
        }
        setErrors(report)

        return !hasErrors
    }
    return (
        <div className={styles.back}>
            <div className={styles.container}>
                <NavLink to={'/map'} className={styles.back_btn}>назад</NavLink>
                <h1>Регистрация</h1>
                <div className={styles.inputs}>
                    <TextField value={user.name}
                               helperText={errors.name}
                               error={errors.name !== ''}
                               onChange={(e) => {
                                   setErrors({...errors, name: ''})
                                   setUser({...user, name: e.target.value})
                               }}
                               fullWidth
                               required
                               label={'Имя'}/>
                    <TextField
                        value={user.surname}
                        helperText={errors.surname}
                        error={errors.surname !== ''}
                        onChange={(e) => {
                            setErrors({...errors, surname: ''})
                            setUser({...user, surname: e.target.value})
                        }}
                        fullWidth
                        required
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
                               helperText={errors.birthDate}
                               error={errors.birthDate !== ''}
                               onChange={(e) => {
                                   setErrors({...errors, birthDate: ''})
                                   setUser({...user, birthDate: e.target.value})
                               }} fullWidth placeholder={'дд.мм.гггг'} label={'Дата рождения'}/>
                    <TextField value={user.email}
                               helperText={errors.email}
                               error={errors.email !== ''}
                               required
                               onChange={(e) => {
                                   setErrors({...errors, email: ''})
                                   setUser({...user, email: e.target.value})
                               }} fullWidth label={'Почта'}/>
                    <TextField value={user.phone}
                               helperText={errors.phone}
                               error={errors.phone !== ''}
                               onChange={(e) => {
                                   setUser({...user, phone: e.target.value})
                               }} fullWidth label={'Номер телефона'}/>
                    <TextField value={user.password}
                               type={'password'}
                               required
                               helperText={errors.password}
                               error={errors.password !== ''}
                               onChange={(e) => {
                                   setErrors({...errors, password: ''})
                                   setUser({...user, password: e.target.value})
                               }} fullWidth label={'Пароль'}/>
                </div>
                {isLoading ? <CircularProgress sx={{
                        margin: '20px auto'
                    }}/> :
                    <button className={styles.register} onClick={() => {
                        if (isDataCorrect())
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
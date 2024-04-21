import React, {useEffect} from 'react';
import {useDispatch} from "react-redux";
import {useNavigate} from "react-router";
import {TokenService} from "../services/TokenService";
import {setUserAction} from "../redux/userReducer";
import {ProfileService} from "../services/ProfileService";

const LoginPage = () => {
    const dispatch = useDispatch()
    const queryParams = new URLSearchParams(window.location.search)
    const navigate = useNavigate()

    useEffect(() => {
        if (!queryParams.has('code')) {
            window.location.replace(`${process.env.REACT_APP_SSO_URL}/oauth2/authorize?client_id=${process.env.REACT_APP_CLIENT_ID}&response_type=code`)
        }
        let fetch = async () => {
            try {
                await TokenService.login(queryParams.get('code'))
                dispatch(setUserAction(await ProfileService.getProfile()))
                navigate('/profile')
            } catch (e) {
                navigate('/')
            }
        }
        fetch()
    }, [])

    return (
        <div>
            <h1>Redirecting...</h1>
        </div>
    );
};

export default LoginPage;
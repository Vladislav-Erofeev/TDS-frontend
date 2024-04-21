import React, {useEffect} from 'react';
import {useSelector} from "react-redux";
import {CircularProgress} from "@mui/material";
import {useNavigate} from "react-router";
import {store} from "../redux/store";
import {TokenService} from "../services/TokenService";

const ProfilePage = () => {
    const user = useSelector(state => state.user)
    const userLoading = useSelector(state => state.loading)
    const navigate = useNavigate()
    useEffect(() => {
        if (!userLoading && !user)
            navigate('/login')
        console.log(user)
    }, [userLoading])
    return (
        <div>
            {
                userLoading ? <CircularProgress sx={{
                    margin: '30px auto'
                }} /> : <div onClick={() => {
                    TokenService.logout()
                }}>
                    <button>выйти</button>
                    <h1>{user.surname} {user.name}</h1>
                </div>
            }
            
        </div>
    );
};

export default ProfilePage;
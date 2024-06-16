import React, {useEffect, useState} from 'react';
import {ProjectsService} from "../../services/ProjectsService";
import {ProfileService} from "../../services/ProfileService";
import {CircularProgress} from "@mui/material";
import styles from './styles/userComponent.module.css'
import UserItem from "./UserItem";
import {useSelector} from "react-redux";

const UsersComponent = ({projectId}) => {
    const user = useSelector(state => state.user)
    const [users, setUsers] = useState([])
    const [isLoading, setIsLoading] = useState(false)
    useEffect(() => {
        const fetch = async () => {
            let persons = await ProjectsService.getAllPersonsInProject(projectId)
            let res = []
            for (let item of persons) {
                let person = await ProfileService.getProfileById(item.personId)
                person['projectRole'] = item.role
                res.push(person)
            }
            setUsers(res)
            setIsLoading(false)
        }

        setIsLoading(true)
        fetch()
    }, [])
    return (
        <div className={styles.main}>
            <div className={styles.list_header}>
                <p>Пользователь:</p>
                <p>Почта:</p>
                <p>Телефон:</p>
            </div>
            {isLoading ? <CircularProgress sx={{
                    margin: 'auto'
                }}/> :
                <>
                    {
                        users.map(item => <UserItem projectId={projectId} key={item.id}
                                                    self={user.id === item.id} user={item}/>)
                    }
                </>
            }
        </div>
    );
};

export default UsersComponent;
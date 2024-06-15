import React, {useEffect} from 'react';
import {useNavigate} from "react-router";
import {ProjectsService} from "../services/ProjectsService";
import {transliterate} from "../data/functions";

const InvitePage = () => {
    const params = new URLSearchParams(window.location.search)
    const navigate = useNavigate()
    useEffect(() => {
        let fetch = async () => {
            let res = await ProjectsService.accessInvite(params.get('token'))
            navigate(`/projects/${res.id}/${transliterate(res.name)}`)
        }

        fetch()
    }, [])
    return (
        <div>
            <h1>Redirecting...</h1>
        </div>
    );
};

export default InvitePage;
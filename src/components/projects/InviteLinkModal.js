import React, {useState} from 'react';
import {Dialog, DialogContent, DialogTitle} from "@mui/material";

const InviteLinkModal = ({inviteLink, setInviteLink}) => {
    const [copied, setCopied] = useState(false)
    const openInviteLink = Boolean(inviteLink)
    return (
        <Dialog open={openInviteLink} onClose={() => {
            setInviteLink(null)
            setCopied(false)
        }}>
            <DialogTitle>
                Ссылка для приглашения
            </DialogTitle>
            <DialogContent sx={{
                display: 'flex',
                gap: '30px',
                alignItems: 'center'
            }}>
                <p>http://localhost:3000/invite?token={inviteLink}</p>
                {copied ? <img src={'/icons/success.svg'} width={'20px'} /> :
                    <button style={{
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer'
                    }} onClick={() => {
                        navigator.clipboard.writeText(`http://localhost:3000/invite?token=${inviteLink}`)
                            .then(() => {
                                setCopied(true)
                            })
                    }}>
                        <img src={'/icons/copy.svg'} width={'20px'}/>
                    </button>
                }
            </DialogContent>
        </Dialog>
    );
};

export default InviteLinkModal;
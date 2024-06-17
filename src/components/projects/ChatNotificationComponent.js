import React from 'react';

const ChatNotificationComponent = ({item, name, fetchUser}) => {
    if (name === undefined)
        fetchUser(item.personId)

    return (
        <div style={{
            backgroundColor: 'rgba(180,180,180,0.66)',
            width: 'max-content',
            margin: '0 auto',
            padding: '5px 15px',
            borderRadius: '5px',
            fontSize: '11pt'
        }}>
            {item.content === 'ADD_USER' ?
                <p>{name ? name.name + ' ' + name.surname : null} присоединился к проекту</p>
                : item.content === 'REMOVE_USER' ? <p>{name ? name.name + ' ' + name.surname : null} покинул проект</p>
            : <p>{name ? name.name + ' ' + name.surname : null} исключён</p>}
        </div>
    );
};

export default ChatNotificationComponent;
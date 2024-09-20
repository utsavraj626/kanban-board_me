// components/TicketCard.js
import React from 'react';
import '../styles/TicketCard.css';

const TicketCard = ({ ticket, users }) => {
    
    return (
        <div className={`ticket-card priority-${ticket.priority}`}>
            <h4>{ticket.title}</h4>
            <br/>
            <p>Status: {ticket.status}</p>
            <br/>
            <p>User: {users?.find(user => user.id === ticket.userId)?.name ||'Unknown User'}</p>
            <p>Priority: {ticket.priority}</p>
        </div>
    );
};

export default TicketCard;

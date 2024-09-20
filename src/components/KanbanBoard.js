// components/KanbanBoard.js
import React, { useState, useEffect } from 'react';
import { fetchTickets } from '../utils/api';
import { saveViewState, loadViewState } from '../utils/localStorage';
import TicketCard from './TicketCard';
import GroupSelector from './GroupSelector';
import SortOptions from './SortOptions';
import '../styles/KanbanBoard.css';

const KanbanBoard = () => {
    const [tickets, setTickets] = useState([]);  // Initialize as an empty array
    const [users, setUsers] = useState([]);  // Initialize as an empty array
    const [grouping, setGrouping] = useState('status');
    const [sorting, setSorting] = useState(null);

    useEffect(() => {
        const storedViewState = loadViewState();
        if (storedViewState) {
            setGrouping(storedViewState.grouping);
            setSorting(storedViewState.sorting);
        }
        fetchTickets().then(data => {
            if (Array.isArray(data.tickets)) {
                setTickets(data.tickets);
            } else {
                console.error('Expected array but got:', data);
                setTickets([]);  // Fallback to an empty array if data is not in the correct format
            }
            if (Array.isArray(data.users)) {
                setUsers(data.users);
            } else {
                console.error('Expected array but got:', data);
                setUsers([]);  // Fallback to an empty array if data is not in the correct format
            }
        });
    }, []);

    useEffect(() => {
        saveViewState({ grouping, sorting });
    }, [grouping, sorting]);

    // Function to group tickets based on the user's selection
    const groupedTickets = () => {
        if (!Array.isArray(tickets)) return []; // Safeguard against non-array data

        if (grouping === 'status') {
            return groupBy(tickets, 'status');
        } else if (grouping === 'user') {
            return groupBy(tickets, ticket => {
                const user = users.find(user => user.id === ticket.userId);
                return user ? user.name : 'Unknown User'; // Use user's name or fallback
            });
        } else if (grouping === 'priority') {
            return groupBy(tickets, 'priority');
        }

        return [];
    };

    // Helper function to group tickets by a specific field
    const groupBy = (items, field) => {
        const grouped = {};
        items.forEach(item => {
            const key = typeof field === 'function' ? field(item) : item[field] || 'Unknown';
            if (!grouped[key]) {
                grouped[key] = [];
            }
            grouped[key].push(item);
        });
        return Object.keys(grouped).map(key => ({ name: key, tickets: grouped[key] }));
    };

    // Function to sort tickets based on the user's selection
    const sortedTickets = (group) => {
        if (!sorting) return group.tickets;
        
        return [...group.tickets].sort((a, b) => {
            if (sorting === 'priority') {
                return b.priority - a.priority; // Descending order for priority
            } else if (sorting === 'title') {
                return a.title.localeCompare(b.title); // Ascending order for title
            }
            return 0;
        });
    };

    return (
        <div className="kanban-board">
            <GroupSelector grouping={grouping} setGrouping={setGrouping} />
            <SortOptions sorting={sorting} setSorting={setSorting} />
            <div className="kanban-columns">
                {groupedTickets().map((group) => (
                    <div className="kanban-column" key={group.name}>
                        <h3>{group.name}</h3>
                        {sortedTickets(group).map(ticket => (
                            <TicketCard key={ticket.id} ticket={ticket} users={users} />
                        ))}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default KanbanBoard;

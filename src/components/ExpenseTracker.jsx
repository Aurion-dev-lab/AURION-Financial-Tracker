import React, { useState } from 'react';

const ExpenseTracker = ({ data, onAdd, onRemove, onUpdate, foundersNames = [] }) => {
    const [newName, setNewName] = useState(foundersNames.length > 0 ? foundersNames[0] : '');
    const [workName, setWorkName] = useState('');
    const [newAmount, setNewAmount] = useState('');
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

    const addExpense = () => {
        if (!newName || !newAmount || !workName) {
            alert("Please fill in Partner, Expense Name, and Amount.");
            return;
        }
        const newEntry = {
            partnerName: newName,
            workName: workName,
            amount: parseFloat(newAmount),
            date: date || new Date().toLocaleDateString(),
            status: 'Pending'
        };
        onAdd(newEntry);
        setNewAmount('');
        setWorkName('');
    };

    const toggleStatus = (item) => {
        const newStatus = item.status === 'Completed' ? 'Pending' : 'Completed';
        onUpdate(item.id, { status: newStatus });
    };

    return (
        <div className="glass-card">
            <h3>Expense Breakdown</h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-dim)', marginBottom: '1.5rem' }}>
                Track independent partner expenses with specific dates and descriptions.
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '1rem', marginBottom: '2rem', padding: '1.25rem', background: 'rgba(255,255,255,0.03)', borderRadius: '12px', border: '1px solid var(--glass-border)' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <label style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>Select Partner</label>
                    <select value={newName} onChange={(e) => setNewName(e.target.value)}>
                        {foundersNames.map(name => (
                            <option key={name} value={name}>{name}</option>
                        ))}
                    </select>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <label style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>Work Name</label>
                    <input
                        placeholder="E.g. Travel"
                        value={workName}
                        onChange={e => setWorkName(e.target.value)}
                    />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <label style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>Amount (Rs.)</label>
                    <input
                        placeholder="Amount"
                        type="number"
                        value={newAmount}
                        onChange={(e) => setNewAmount(e.target.value)}
                    />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <label style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>Date</label>
                    <input
                        type="date"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                    />
                </div>
                <div style={{ display: 'flex', alignItems: 'flex-end' }}>
                    <button onClick={addExpense} className="btn-primary" style={{ width: '100%', height: '42px' }}>Add Expense</button>
                </div>
            </div>

            <div className="table-container">
                <table>
                    <thead>
                        <tr>
                            <th>Date</th>
                            <th>Partner</th>
                            <th>Expense Name</th>
                            <th>Amount (Rs.)</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.map(item => (
                            <tr key={item.id}>
                                <td>{item.date}</td>
                                <td style={{ fontWeight: '500' }}>{item.partnerName}</td>
                                <td style={{ color: 'var(--light-blue)' }}>{item.workName}</td>
                                <td>Rs. {item.amount.toLocaleString()}</td>
                                <td>
                                    <span
                                        onClick={() => toggleStatus(item)}
                                        style={{
                                            padding: '0.25rem 0.6rem',
                                            borderRadius: '20px',
                                            fontSize: '0.7rem',
                                            fontWeight: '600',
                                            cursor: 'pointer',
                                            transition: '0.2s',
                                            background: item.status === 'Completed' ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.2)',
                                            color: item.status === 'Completed' ? '#10B981' : '#EF4444',
                                            border: `1px solid ${item.status === 'Completed' ? 'rgba(16, 185, 129, 0.3)' : 'rgba(239, 68, 68, 0.3)'}`
                                        }}
                                    >
                                        {item.status || 'Pending'}
                                    </span>
                                </td>
                                <td>
                                    <button onClick={() => onRemove(item.id)} className="btn-delete">Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ExpenseTracker;

import React, { useState } from 'react';

const CostTracker = ({ data, onAdd, onRemove, projectNames }) => {
    const [formData, setFormData] = useState({
        projectName: projectNames[0] || '',
        category: '',
        date: '',
        amount: ''
    });

    const handleAdd = () => {
        if (!formData.projectName || !formData.amount) return;
        const newItem = {
            ...formData,
            amount: parseFloat(formData.amount),
            date: formData.date || new Date().toLocaleDateString(),
            status: false
        };
        onAdd(newItem);
        setFormData({ ...formData, category: '', date: '', amount: '' });
    };

    return (
        <div className="glass-card">
            <h3>Project Cost Tracking</h3>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '1rem', margin: '1.5rem 0', padding: '1.25rem', background: 'rgba(255,255,255,0.03)', borderRadius: '12px', border: '1px solid var(--glass-border)' }}>
                <select value={formData.projectName} onChange={e => setFormData({ ...formData, projectName: e.target.value })}>
                    <option value="" disabled>Select Project</option>
                    {projectNames.map(name => <option key={name} value={name}>{name}</option>)}
                </select>
                <input placeholder="Category" value={formData.category} onChange={e => setFormData({ ...formData, category: e.target.value })} />
                <input placeholder="Date" type="date" value={formData.date} onChange={e => setFormData({ ...formData, date: e.target.value })} />
                <input placeholder="Amount (Rs.)" type="number" value={formData.amount} onChange={e => setFormData({ ...formData, amount: e.target.value })} />
                <button onClick={handleAdd} className="btn-primary" style={{ padding: '0.5rem' }}>Add Cost</button>
            </div>

            <div className="table-container">
                <table>
                    <thead>
                        <tr>
                            <th>Project</th>
                            <th>Category</th>
                            <th>Date</th>
                            <th>Amount (Rs.)</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.map(item => (
                            <tr key={item.id}>
                                <td>{item.projectName}</td>
                                <td>{item.category}</td>
                                <td>{item.date}</td>
                                <td>{item.amount.toLocaleString()}</td>
                                <td>
                                    <span style={{
                                        padding: '0.25rem 0.5rem',
                                        borderRadius: '4px',
                                        fontSize: '0.75rem',
                                        background: item.status ? '#10B981' : '#EF4444'
                                    }}>
                                        {item.status ? 'Approved' : 'Pending'}
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

export default CostTracker;

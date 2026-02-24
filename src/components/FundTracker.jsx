import React, { useState } from 'react';

const FundTracker = ({ data, onAdd, onRemove, costs }) => {
    const [formData, setFormData] = useState({
        date: '',
        name: '',
        revenue: ''
    });

    const getProjectCost = (projectName) => {
        return costs.filter(c => c.projectName === projectName).reduce((sum, c) => sum + (parseFloat(c.amount) || 0), 0);
    };

    const calculateDist = (profit, percent) => (profit * percent) / 100;

    const handleAdd = () => {
        if (!formData.name || !formData.revenue) return;
        const newItem = {
            ...formData,
            revenue: parseFloat(formData.revenue),
            date: formData.date || new Date().toLocaleDateString()
        };
        onAdd(newItem);
        setFormData({ date: '', name: '', revenue: '' });
    };

    return (
        <div className="glass-card">
            <h3>Project Funds Management</h3>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '1rem', margin: '1.5rem 0', padding: '1.25rem', background: 'rgba(255,255,255,0.03)', borderRadius: '12px', border: '1px solid var(--glass-border)' }}>
                <input placeholder="Date" type="date" value={formData.date} onChange={e => setFormData({ ...formData, date: e.target.value })} />
                <input placeholder="Project Name" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} />
                <input placeholder="Revenue (Rs.)" type="number" value={formData.revenue} onChange={e => setFormData({ ...formData, revenue: e.target.value })} />
                <button onClick={handleAdd} className="btn-primary" style={{ padding: '0.5rem' }}>Add Project</button>
            </div>

            <div className="table-container">
                <table>
                    <thead>
                        <tr>
                            <th>Date</th>
                            <th>Project Name</th>
                            <th>Revenue (Rs.)</th>
                            <th>Cost (Rs.)</th>
                            <th>Profit (Rs.)</th>
                            <th>Work (45%)</th>
                            <th>Founders (5%)</th>
                            <th>Reserve (40%)</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.map(item => {
                            const cost = getProjectCost(item.name);
                            const profit = item.revenue - cost;
                            return (
                                <tr key={item.id}>
                                    <td>{item.date}</td>
                                    <td>{item.name}</td>
                                    <td>{item.revenue.toLocaleString()}</td>
                                    <td style={{ color: 'var(--text-dim)' }}>{cost.toLocaleString()}</td>
                                    <td style={{ fontWeight: 'bold' }}>{profit.toLocaleString()}</td>
                                    <td>{calculateDist(profit, 45).toLocaleString()}</td>
                                    <td>{calculateDist(profit, 5).toLocaleString()}</td>
                                    <td>{calculateDist(profit, 40).toLocaleString()}</td>
                                    <td>
                                        <button onClick={() => onRemove(item.id)} className="btn-delete">Delete</button>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default FundTracker;

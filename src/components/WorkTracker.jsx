import React, { useState } from 'react';

const WorkTracker = ({ data, onAdd, onRemove, projectNames, foundersNames }) => {
    const [selectedProject, setSelectedProject] = useState(projectNames[0] || '');
    const [selectedFounder, setSelectedFounder] = useState(foundersNames[0] || '');
    const [percentage, setPercentage] = useState('');

    const handleAdd = () => {
        if (!selectedProject || !selectedFounder || !percentage) {
            alert("Please fill in all fields (Project, Partner, and Percentage).");
            return;
        }

        const numPercent = parseFloat(percentage);
        if (isNaN(numPercent) || numPercent <= 0 || numPercent > 100) {
            alert("Please enter a valid percentage between 1 and 100.");
            return;
        }

        const newItem = {
            projectName: selectedProject,
            founderName: selectedFounder,
            percentage: numPercent,
            date: new Date().toLocaleDateString()
        };
        onAdd(newItem);
        setPercentage('');
    };

    return (
        <div className="glass-card">
            <h3>Work Attribution (45% Pool)</h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-dim)', marginBottom: '1.5rem' }}>
                Assign partners to projects and specify their **contribution percentage**.
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', margin: '1.5rem 0', padding: '1.25rem', background: 'rgba(255,255,255,0.03)', borderRadius: '12px', border: '1px solid var(--glass-border)' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <label style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>Select Project</label>
                    <select value={selectedProject} onChange={e => setSelectedProject(e.target.value)}>
                        <option value="" disabled>Select Project</option>
                        {projectNames.map(name => <option key={name} value={name}>{name}</option>)}
                    </select>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <label style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>Select Partner</label>
                    <select value={selectedFounder} onChange={e => setSelectedFounder(e.target.value)}>
                        {foundersNames.map(name => <option key={name} value={name}>{name}</option>)}
                    </select>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <label style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>Contribution %</label>
                    <input
                        type="number"
                        placeholder="E.g. 50"
                        value={percentage}
                        onChange={e => setPercentage(e.target.value)}
                    />
                </div>
                <div style={{ display: 'flex', alignItems: 'flex-end' }}>
                    <button onClick={handleAdd} className="btn-primary" style={{ width: '100%', height: '42px' }}>Assign Work</button>
                </div>
            </div>

            <div className="table-container">
                <table>
                    <thead>
                        <tr>
                            <th>Project Name</th>
                            <th>Partner</th>
                            <th>Contribution %</th>
                            <th>Date</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.map(item => (
                            <tr key={item.id}>
                                <td>{item.projectName}</td>
                                <td style={{ fontWeight: '500' }}>{item.founderName}</td>
                                <td style={{ color: 'var(--primary-red)', fontWeight: 'bold' }}>{item.percentage}%</td>
                                <td>{item.date}</td>
                                <td>
                                    <button onClick={() => onRemove(item.id)} className="btn-delete">Remove</button>
                                </td>
                            </tr>
                        ))}
                        {data.length === 0 && (
                            <tr>
                                <td colSpan="5" style={{ textAlign: 'center', color: 'var(--text-dim)', padding: '2rem' }}>No work attributions found.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default WorkTracker;

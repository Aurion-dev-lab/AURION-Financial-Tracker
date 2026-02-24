import React from 'react';

const FounderTracker = ({ funds, costs, foundersNames, workAttributions = [], expenses = [] }) => {
    const getProjectCost = (projectName) => {
        return costs.filter(c => c.projectName === projectName).reduce((sum, c) => sum + (parseFloat(c.amount) || 0), 0);
    };

    const getAttributionsForProject = (projectName) => {
        return workAttributions.filter(wa => wa.projectName === projectName);
    };

    // Calculate Grand Totals for each partner
    const grandTotals = foundersNames.map(name => {
        let totalProjectShare = 0;

        funds.forEach(project => {
            const cost = getProjectCost(project.name);
            const profit = project.revenue - cost;

            // 5% Fixed
            const fixedShare = (profit * 0.05) / foundersNames.length;

            // 45% Work
            const workPool = profit * 0.45;
            const partnerAttrs = workAttributions.filter(wa => wa.projectName === project.name && wa.founderName === name);
            const totalWorkPercent = partnerAttrs.reduce((sum, a) => sum + (a.percentage || 0), 0);
            const workShare = (workPool * (totalWorkPercent / 100));

            totalProjectShare += (fixedShare + workShare);
        });

        const totalExpenses = expenses.filter(e => e.partnerName === name).reduce((sum, e) => sum + (parseFloat(e.amount) || 0), 0);

        return {
            name,
            totalProjectShare,
            totalExpenses,
            grandTotal: totalProjectShare + totalExpenses
        };
    });

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>

            {/* Grand Total Summary */}
            <div className="glass-card" style={{ border: '1px solid var(--primary-red)', background: 'rgba(230, 57, 70, 0.02)' }}>
                <h3 style={{ marginBottom: '1rem', color: 'var(--primary-red)' }}>💰 Grand Total Summary</h3>
                <div className="table-container">
                    <table>
                        <thead>
                            <tr>
                                <th>Partner Name</th>
                                <th>Project Shares</th>
                                <th>Expenses</th>
                                <th style={{ color: 'var(--primary-red)' }}>Grand Total (Rs.)</th>
                            </tr>
                        </thead>
                        <tbody>
                            {grandTotals.map(item => (
                                <tr key={item.name}>
                                    <td style={{ fontWeight: 'bold' }}>{item.name}</td>
                                    <td>Rs. {item.totalProjectShare.toLocaleString(undefined, { maximumFractionDigits: 0 })}</td>
                                    <td style={{ color: 'var(--light-blue)' }}>Rs. {item.totalExpenses.toLocaleString(undefined, { maximumFractionDigits: 0 })}</td>
                                    <td style={{ fontWeight: '800', fontSize: '1.1rem', color: 'white' }}>Rs. {item.grandTotal.toLocaleString(undefined, { maximumFractionDigits: 0 })}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <div style={{ height: '1px', background: 'var(--glass-border)', margin: '1rem 0' }}></div>

            {/* Individual Project Cards */}
            {funds.map(project => {
                const cost = getProjectCost(project.name);
                const profit = project.revenue - cost;
                const fixedPool = profit * 0.05;
                const individualFixedShare = fixedPool / foundersNames.length;
                const workPool = profit * 0.45;
                const attributions = getAttributionsForProject(project.name);

                return (
                    <div key={project.id} className="glass-card">
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                            <h3 style={{ margin: 0 }}>{project.name}</h3>
                            <div style={{ display: 'flex', gap: '0.75rem' }}>
                                <div style={{ fontSize: '0.7rem', padding: '0.2rem 0.5rem', borderRadius: '4px', background: 'rgba(255,255,255,0.05)', color: 'var(--text-dim)' }}>
                                    Profit: Rs. {profit.toLocaleString()}
                                </div>
                            </div>
                        </div>

                        <div className="table-container">
                            <table>
                                <thead>
                                    <tr>
                                        <th>Partner Name</th>
                                        <th>Contribution (%)</th>
                                        <th>Fixed (5%)</th>
                                        <th>Work (45%)</th>
                                        <th>Subtotal</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {foundersNames.map(name => {
                                        const partnerAttributions = attributions.filter(a => a.founderName === name);
                                        const totalPercentage = partnerAttributions.reduce((sum, a) => sum + (a.percentage || 0), 0);
                                        const individualWorkShare = (workPool * (totalPercentage / 100));
                                        const total = individualFixedShare + individualWorkShare;

                                        return (
                                            <tr key={`${project.id}-${name}`}>
                                                <td>{name}</td>
                                                <td>
                                                    {totalPercentage > 0 ? (
                                                        <span style={{ color: '#10B981', fontWeight: 'bold' }}>{totalPercentage}%</span>
                                                    ) : (
                                                        <span style={{ color: 'var(--text-dim)', fontSize: '0.8rem' }}>None</span>
                                                    )}
                                                </td>
                                                <td style={{ fontSize: '0.85rem' }}>{individualFixedShare.toLocaleString(undefined, { maximumFractionDigits: 0 })}</td>
                                                <td style={{ fontSize: '0.85rem' }}>{individualWorkShare.toLocaleString(undefined, { maximumFractionDigits: 0 })}</td>
                                                <td style={{ fontWeight: '500' }}>{total.toLocaleString(undefined, { maximumFractionDigits: 0 })}</td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

export default FounderTracker;

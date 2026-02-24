import React, { useState, useEffect } from 'react';
import { db } from './firebase';
import { collection, onSnapshot, addDoc, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import FundTracker from './components/FundTracker';
import CostTracker from './components/CostTracker';
import FounderTracker from './components/FounderTracker';
import ExpenseTracker from './components/ExpenseTracker';
import WorkTracker from './components/WorkTracker';

const foundersNames = [
  "Minoka Induwara", "Minidu Oshan", "Chamidu Irosh", "Amila Sandeepa", "Dilhara Samaranayake", "Dilusha Madushan", "Kavishan Rathnayake"
];

function App() {
  const [activeTab, setActiveTab] = useState('funds');
  const [funds, setFunds] = useState([]);
  const [costs, setCosts] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [workAttributions, setWorkAttributions] = useState([]);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', handleResize);

    // Real-time listeners
    const unsubFunds = onSnapshot(collection(db, 'funds'), (snapshot) => {
      setFunds(snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id })));
    });

    const unsubCosts = onSnapshot(collection(db, 'costs'), (snapshot) => {
      setCosts(snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id })));
    });

    const unsubExpenses = onSnapshot(collection(db, 'expenses'), (snapshot) => {
      setExpenses(snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id })));
    });

    const unsubWork = onSnapshot(collection(db, 'workAttributions'), (snapshot) => {
      setWorkAttributions(snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id })));
    });

    return () => {
      window.removeEventListener('resize', handleResize);
      unsubFunds();
      unsubCosts();
      unsubExpenses();
      unsubWork();
    };
  }, []);

  const addItem = async (collectionName, item) => {
    try {
      await addDoc(collection(db, collectionName), item);
    } catch (e) {
      console.error("Error adding document: ", e);
      alert("Error adding to Firebase.");
    }
  };

  const removeItem = async (collectionName, id) => {
    if (!window.confirm("Are you sure you want to delete this entry?")) return;
    try {
      await deleteDoc(doc(db, collectionName, id));
    } catch (e) {
      console.error("Error removing document: ", e);
      alert("Error removing from Firebase.");
    }
  };

  const updateItem = async (collectionName, id, updates) => {
    try {
      await updateDoc(doc(db, collectionName, id), updates);
    } catch (e) {
      console.error("Error updating document: ", e);
    }
  };

  const getProjectProfit = (fund) => {
    const projectCosts = costs.filter(c => c.projectName === fund.name).reduce((sum, c) => sum + (parseFloat(c.amount) || 0), 0);
    return (parseFloat(fund.revenue) || 0) - projectCosts;
  };

  const totalProfit = funds.reduce((acc, fund) => acc + getProjectProfit(fund), 0);

  const renderContent = () => {
    switch (activeTab) {
      case 'funds':
        return <FundTracker data={funds} onAdd={(item) => addItem('funds', item)} onRemove={(id) => removeItem('funds', id)} costs={costs} />;
      case 'cost':
        return <CostTracker data={costs} onAdd={(item) => addItem('costs', item)} onRemove={(id) => removeItem('costs', id)} projectNames={funds.map(f => f.name)} />;
      case 'work':
        return <WorkTracker data={workAttributions} onAdd={(item) => addItem('workAttributions', item)} onRemove={(id) => removeItem('workAttributions', id)} projectNames={funds.map(f => f.name)} foundersNames={foundersNames} />;
      case 'founders':
        return <FounderTracker funds={funds} costs={costs} foundersNames={foundersNames} workAttributions={workAttributions} expenses={expenses} />;
      case 'expenses':
        return <ExpenseTracker data={expenses} onAdd={(item) => addItem('expenses', item)} onRemove={(id) => removeItem('expenses', id)} onUpdate={(id, updates) => updateItem('expenses', id, updates)} foundersNames={foundersNames} />;
      default:
        return <FundTracker data={funds} onAdd={(item) => addItem('funds', item)} onRemove={(id) => removeItem('funds', id)} costs={costs} />;
    }
  };

  const NavItems = () => (
    <>
      <button onClick={() => setActiveTab('funds')} className={`nav-item ${activeTab === 'funds' ? 'active' : ''}`}>Funds</button>
      <button onClick={() => setActiveTab('cost')} className={`nav-item ${activeTab === 'cost' ? 'active' : ''}`}>Cost</button>
      <button onClick={() => setActiveTab('work')} className={`nav-item ${activeTab === 'work' ? 'active' : ''}`}>Work</button>
      <button onClick={() => setActiveTab('founders')} className={`nav-item ${activeTab === 'founders' ? 'active' : ''}`}>Founders</button>
      <button onClick={() => setActiveTab('expenses')} className={`nav-item ${activeTab === 'expenses' ? 'active' : ''}`}>Expenses</button>
    </>
  );

  return (
    <div className="app-container" style={{
      display: 'flex',
      flexDirection: isMobile ? 'column' : 'row',
      minHeight: '100vh',
      backgroundColor: 'var(--bg-dark)'
    }}>
      {!isMobile ? (
        <nav className="glass-card" style={{ width: '260px', borderRadius: '0', borderRight: '1px solid var(--glass-border)', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ padding: '1rem', borderBottom: '1px solid var(--glass-border)', marginBottom: '1rem' }}>
            <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--primary-red)' }}>AURION</h1>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>Financial Tracker</p>
          </div>
          <NavItems />
        </nav>
      ) : (
        <header className="glass-card" style={{ borderRadius: '0', borderBottom: '1px solid var(--glass-border)', padding: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'sticky', top: 0, zIndex: 100 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <h1 style={{ fontSize: '1.2rem', fontWeight: 'bold', color: 'var(--primary-red)', margin: 0 }}>AURION</h1>
            <div style={{ width: '1px', height: '1.5rem', background: 'var(--glass-border)' }}></div>
            <span style={{ fontSize: '0.9rem', color: 'var(--text-main)', textTransform: 'capitalize' }}>{activeTab}</span>
          </div>
        </header>
      )}

      <main style={{ flex: 1, padding: isMobile ? '1rem' : '2rem', paddingBottom: isMobile ? '5rem' : '2rem', overflowY: 'auto' }}>
        <header style={{ marginBottom: isMobile ? '1.5rem' : '2rem', display: 'flex', flexDirection: isMobile ? 'column' : 'row', gap: '1rem', justifyContent: 'space-between', alignItems: isMobile ? 'flex-start' : 'center' }}>
          {!isMobile && <h2 style={{ textTransform: 'capitalize' }}>{activeTab} Overview</h2>}
          <div className="glass-card" style={{
            padding: '0.5rem 1rem',
            display: 'flex',
            gap: isMobile ? '1rem' : '1.5rem',
            width: isMobile ? '100%' : 'auto',
            justifyContent: isMobile ? 'space-between' : 'flex-start'
          }}>
            <div>
              <span style={{ fontSize: '0.7rem', color: 'var(--text-dim)' }}>Revenue</span>
              <div style={{ fontSize: isMobile ? '1rem' : '1.1rem', fontWeight: '600' }}>Rs. {funds.reduce((acc, f) => acc + (parseFloat(f.revenue) || 0), 0).toLocaleString()}</div>
            </div>
            <div style={{ borderLeft: '1px solid var(--glass-border)', paddingLeft: isMobile ? '1rem' : '1.5rem' }}>
              <span style={{ fontSize: '0.7rem', color: 'var(--text-dim)' }}>Total Profit</span>
              <div style={{ fontSize: isMobile ? '1rem' : '1.1rem', fontWeight: '600', color: '#10B981' }}>Rs. {totalProfit.toLocaleString()}</div>
            </div>
          </div>
        </header>
        {renderContent()}
      </main>

      {isMobile && (
        <nav className="glass-card" style={{
          position: 'fixed', bottom: 0, left: 0, right: 0, borderRadius: '0', borderTop: '1px solid var(--glass-border)',
          display: 'flex', justifyContent: 'space-around', padding: '0.5rem', backdropFilter: 'blur(20px)', gap: '5px'
        }}>
          <NavItems />
        </nav>
      )}

      <style>{`
        .nav-item {
          background: transparent; border: none; color: var(--text-dim); text-align: left;
          padding: ${isMobile ? '0.5rem' : '1rem'}; font-size: ${isMobile ? '0.75rem' : 'inherit'};
          font-variation-settings: 'wght' 500; cursor: pointer; border-radius: 8px; transition: 0.2s;
          display: flex; align-items: center; justify-content: ${isMobile ? 'center' : 'flex-start'}; flex: ${isMobile ? 1 : 'none'};
        }
        .nav-item:hover { background: rgba(255, 255, 255, 0.05); color: white; }
        .nav-item.active { background: var(--primary-red); color: white; }
        .btn-delete {
          background: rgba(230, 57, 70, 0.1); color: var(--primary-red); border: none;
          padding: 0.4rem 0.6rem; border-radius: 6px; cursor: pointer; font-size: 0.8rem; transition: 0.2s;
        }
        .btn-delete:hover { background: var(--primary-red); color: white; }
      `}</style>
    </div>
  );
}

export default App;

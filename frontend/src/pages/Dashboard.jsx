import React, { useState } from 'react';
import Header from '../components/Header';
import AssetSummary from '../components/AssetSummary';
import TradeHistory from '../components/TradeHistory';
import AccountsSummary from '../components/AccountsSummary';
import Alerts from '../components/Alerts';
import TopAutotraders from '../components/TopAutotraders';
import Affiliate from '../components/Affiliate';
import Sidebar from '../components/Sidebar';
import { useDashboardData } from '../hooks/useDashboardData';
import { useSidebar } from '../hooks/useSidebar';

const Dashboard = () => {
  const [range, setRange] = useState('ALL');
  const { data, isLoading, isError } = useDashboardData(range);
  const { isCollapsed, toggleSidebar } = useSidebar();

  return (
    <div className={`app ${isCollapsed ? 'has-sidebar-collapsed' : ''}`}>
      <Header toggleSidebar={toggleSidebar} />
      <div className="app-body">
        <Sidebar />
        <main className="main">
          <div className="dashboard-row dashboard-row--split">
            <div className="dashboard-left">
              <AssetSummary 
                range={range} 
                setRange={setRange} 
                data={data?.assetSummary} 
                isLoading={isLoading} 
                isError={isError} 
              />
            </div>
            <div className="dashboard-right">
              <TradeHistory data={data?.tradeHistory} />
            </div>
          </div>
          <div className="dashboard-row dashboard-row--split dashboard-row--summary">
            <div className="dashboard-left">
              <AccountsSummary data={data?.accountsSummary} />
            </div>
            <div className="dashboard-right">
              <Alerts data={data?.alerts} />
            </div>
          </div>
          <div className="dashboard-row dashboard-row--split dashboard-row--bottom">
            <div className="dashboard-left">
              <TopAutotraders data={data?.topAutotraders} />
            </div>
            <div className="dashboard-right dashboard-right--stack">
              <Affiliate />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;

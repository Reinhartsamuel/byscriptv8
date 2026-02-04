import React from 'react';

const AccountsSummary = ({ data }) => {
  const accounts = data?.accounts || [];
  const totalBalance = data?.total || '$0.00';

  return (
    <section className="section section--secondary">
      <div className="section-header">
        <h2 className="section-title">Accounts Summary</h2>
      </div>
      <div className="section-body">
        <div className="summary-grid">
          <div className="summary-list scrollable">
            {accounts.map((account, index) => (
              <div key={index} className="summary-item">
                <span className="summary-item-name">{account.name}</span>
                <span className="summary-item-value">{account.value}</span>
              </div>
            ))}
          </div>
          <div className="summary-total">
            <div className="stat-label">Total Balance</div>
            <div className="stat-value">{totalBalance}</div>
            <div className="chart-placeholder">Chart Placeholder</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AccountsSummary;

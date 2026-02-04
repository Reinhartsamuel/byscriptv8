import React from 'react';

const TopAutotraders = ({ data }) => {
  const autotraders = data || [];

  return (
    <section className="section section--secondary section--autotraders">
      <div className="section-header">
        <h2 className="section-title">Top Autotraders</h2>
      </div>
      <div className="section-body">
        <div className="autotraders-list">
          {autotraders.map((trader, index) => (
            <div key={index} className="autotrader-card">
              <div className="autotrader-header">
                <div className="autotrader-identity">
                  <div className="autotrader-avatar"></div>
                  <div className="autotrader-name-group">
                    <span className="autotrader-name">{trader.name}</span>
                  </div>
                </div>
                <div className="autotrader-pnl">{trader.pnl}</div>
              </div>
              <div className="autotrader-meta">
                <span>{trader.runtime}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TopAutotraders;

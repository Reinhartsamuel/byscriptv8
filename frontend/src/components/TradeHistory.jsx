import React from 'react';

const TradeHistory = ({ data }) => {
  const tradeHistory = data || [];

  return (
    <section className="section section--secondary section--trade-history">
      <div className="section-header">
        <div>
          <h2 className="section-title">Trade History</h2>
          <p className="section-subtitle">
            Latest executed &amp; failed trades
          </p>
        </div>
        <a className="button button--ghost" href="/activity">View All</a>
      </div>
      <div className="section-body">
        <div className="trade-history-table">
          <div className="trade-history-header">
            <div>Asset</div>
            <div>Action</div>
            <div>Profit</div>
            <div>Time</div>
            <div></div>
          </div>
          <div className="trade-history-list scrollable">
            {tradeHistory.map((trade, index) => (
              <div key={index} className="trade-history-row">
                <div>{trade.asset}</div>
                <div>{trade.action}</div>
                <div>{trade.profit}</div>
                <div>{trade.time}</div>
                <div></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default TradeHistory;

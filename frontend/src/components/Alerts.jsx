import React from 'react';

const Alerts = () => {
  // Hardcoded data for now
  const alerts = [
    {
      title: 'High Volatility Warning',
      message: 'BTC/USD is experiencing high volatility. Trade with caution.',
      type: 'Warning',
      time: '2m ago',
      cta: 'View Chart',
    },
    {
      title: 'New Asset Listing',
      message: 'SOL/USD has been listed on the platform.',
      type: 'Info',
      time: '1h ago',
      cta: 'Trade Now',
    },
    {
      title: 'Margin Call',
      message: 'Your account is approaching a margin call. Please add funds.',
      type: 'Critical',
      time: '2d ago',
      cta: 'Add Funds',
    },
  ];

  const getBadgeClass = (type) => {
    switch (type) {
      case 'Warning':
        return 'badge--warning';
      case 'Info':
        return 'badge--info';
      case 'Critical':
        return 'badge--critical';
      default:
        return '';
    }
  };

  return (
    <section className="section section--secondary section--alerts">
      <div className="section-header">
        <h2 className="section-title">Alerts</h2>
        <div className="alerts-controls">
          <button className="alerts-nav" data-alert-nav="prev">◀</button>
          <button className="alerts-nav" data-alert-nav="next">▶</button>
        </div>
      </div>
      <div className="section-body">
        <div className="alerts-slider">
          <div className="alerts-slider__track">
            {alerts.map((alert, index) => (
              <div key={index} className="alert-card">
                <div className="alert-title">{alert.title}</div>
                <div className="alert-message">{alert.message}</div>
                <div className="alert-meta">
                  <span className={`badge ${getBadgeClass(alert.type)}`}>
                    {alert.type}
                  </span>
                  <span className="alert-time">{alert.time}</span>
                </div>
                <button className="button button--ghost">{alert.cta}</button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Alerts;

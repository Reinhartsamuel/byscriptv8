import React from 'react';

const Header = ({ toggleSidebar }) => {
  return (
    <header className="header section section--header section-header">
        <button className="sidebar-toggle" type="button" aria-label="Toggle sidebar" onClick={toggleSidebar}>
            <span className="sidebar-toggle-icon" aria-hidden="true">
                <span className="sidebar-toggle-panel sidebar-toggle-panel--sidebar"></span>
                <span className="sidebar-toggle-panel sidebar-toggle-panel--content"></span>
            </span>
            <span className="sidebar-toggle-tooltip" role="tooltip">Collapse sidebar</span>
        </button>
      <div className="section-header">
        <h1 className="section-title">Dashboard</h1>
      </div>
      <div className="section-body">
        <div className="header-meta">
          <span className="pill"></span>
          <span className="header-subtitle"></span>
        </div>
      </div>
    </header>
  );
};

export default Header;

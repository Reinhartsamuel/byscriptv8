import React from 'react';
import { NavLink } from 'react-router-dom';

const sidebarMenu = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    path: '/',
  },
  {
    id: 'accounts',
    label: 'Accounts',
    path: '/accounts',
  },
  {
    id: 'autotraders',
    label: 'Autotraders',
    path: '/autotraders',
  },
  {
    id: 'trade-history',
    label: 'Trade History',
    path: '/trade-history',
  },
];

const Sidebar = () => {
  return (
    <aside>
      <nav className="sidebar">
        <div className="sidebar-header">
          <div className="sidebar-logo" aria-hidden="true">
            B
          </div>
          <span className="sidebar-logo-text">ByScript</span>
        </div>
        <ul>
          {sidebarMenu.map((item) => (
            <li key={item.id}>
              <NavLink
                to={item.path}
                end
                className={({ isActive }) =>
                  `sidebar-item ${isActive ? 'sidebar-item--active' : ''}`
                }
              >
                <span className="sidebar-icon"></span>
                <span className="sidebar-label">{item.label}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;

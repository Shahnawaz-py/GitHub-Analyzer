'use client';

import React from 'react';
import styles from '../styles/analyzer.module.css';
import { Activity, GitCompare, Code2, ShieldAlert } from 'lucide-react';

function GithubIcon({ size = 24 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
    </svg>
  );
}

export default function Navbar({ activeTab, setActiveTab, rateLimit }) {
  const remaining = rateLimit?.rate?.remaining ?? '...';
  const limit = rateLimit?.rate?.limit ?? 60;
  const isNearLimit = typeof remaining === 'number' && remaining < 10;

  return (
    <header className={styles.navbar}>
      <div className={styles.navBrand}>
        <div className={styles.brandLogo}>
          <GithubIcon size={24} />
        </div>
        <div>
          <span className={styles.brandTitle}>
            Git<span className="text-gradient">Pulse</span>
          </span>
          <span className={styles.brandBadge}>Pro</span>
        </div>
      </div>

      <nav className={styles.navTabs} aria-label="Main Navigation">
        <button
          className={`${styles.tabBtn} ${activeTab === 'profile' ? styles.tabBtnActive : ''}`}
          onClick={() => setActiveTab('profile')}
        >
          <Code2 size={16} />
          <span>Profile Analyzer</span>
        </button>

        <button
          className={`${styles.tabBtn} ${activeTab === 'repo' ? styles.tabBtnActive : ''}`}
          onClick={() => setActiveTab('repo')}
        >
          <Activity size={16} />
          <span>Repository Deep-Dive</span>
        </button>

        <button
          className={`${styles.tabBtn} ${activeTab === 'showdown' ? styles.tabBtnActive : ''}`}
          onClick={() => setActiveTab('showdown')}
        >
          <GitCompare size={16} />
          <span>Dev Showdown</span>
        </button>
      </nav>

      <div className={styles.navRight}>
        <div
          className={styles.ratePill}
          title={`GitHub REST API Rate Limit: ${remaining} of ${limit} remaining. Resets hourly.`}
        >
          <span
            className={styles.statusDot}
            style={{
              background: isNearLimit ? '#f43f5e' : '#10b981',
              boxShadow: `0 0 8px ${isNearLimit ? '#f43f5e' : '#10b981'}`,
            }}
          />
          <span>
            API Rate: {remaining}/{limit}
          </span>
        </div>
      </div>
    </header>
  );
}

'use client';

import React from 'react';
import styles from '../styles/analyzer.module.css';
import { GitCommit, GitPullRequest, AlertCircle, Star, GitBranch, History } from 'lucide-react';

export default function ActivityTimeline({ events = [] }) {
  if (!events || events.length === 0) return null;

  function getEventIcon(type) {
    switch (type) {
      case 'PushEvent':
        return <GitCommit size={16} color="var(--accent-cyan)" />;
      case 'PullRequestEvent':
        return <GitPullRequest size={16} color="#a855f7" />;
      case 'IssuesEvent':
        return <AlertCircle size={16} color="#f59e0b" />;
      case 'WatchEvent':
        return <Star size={16} color="#fbbf24" />;
      default:
        return <GitBranch size={16} color="var(--accent-indigo)" />;
    }
  }

  function formatRelativeTime(dateStr) {
    const diffMs = Date.now() - new Date(dateStr).getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    if (diffHours < 1) return 'Just now';
    if (diffHours < 24) return `${diffHours}h ago`;
    const diffDays = Math.floor(diffHours / 24);
    if (diffDays < 30) return `${diffDays}d ago`;
    return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  }

  return (
    <div className={`glass-panel ${styles.sectionCard}`}>
      <div className={styles.sectionHeader}>
        <div className={styles.sectionTitle}>
          <History size={20} color="var(--accent-emerald)" />
          <span>Recent Public Velocity & Activity</span>
        </div>
        <span className="badge badge-emerald">Live Event Stream</span>
      </div>

      <div className={styles.activityList}>
        {events.map((evt, idx) => (
          <div key={evt.id || idx} className={styles.activityItem}>
            <div className={styles.activityLeft}>
              <div className={styles.activityIcon}>{getEventIcon(evt.type)}</div>
              <div>
                <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>
                  {evt.action}
                </div>
                {evt.repoName && (
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                    repo:{' '}
                    <span style={{ color: 'var(--accent-cyan)', fontFamily: 'var(--font-mono)' }}>
                      {evt.repoName}
                    </span>
                  </div>
                )}
              </div>
            </div>

            <div className={styles.activityTime}>{formatRelativeTime(evt.createdAt)}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

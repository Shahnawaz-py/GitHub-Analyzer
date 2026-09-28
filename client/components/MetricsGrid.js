'use client';

import React from 'react';
import styles from '../styles/analyzer.module.css';
import { Star, GitFork, BookMarked, Users, UserCheck, Sparkles } from 'lucide-react';

export default function MetricsGrid({ metrics, user }) {
  if (!metrics || !user) return null;

  const cards = [
    {
      label: 'Total Stars Earned',
      value: metrics.totalStars.toLocaleString(),
      subtext: 'Across all public repositories',
      icon: Star,
      color: '#f59e0b',
      bg: 'rgba(245, 158, 11, 0.12)',
    },
    {
      label: 'Total Forks',
      value: metrics.totalForks.toLocaleString(),
      subtext: 'Community derivatives',
      icon: GitFork,
      color: '#8b5cf6',
      bg: 'rgba(139, 92, 246, 0.12)',
    },
    {
      label: 'Public Repositories',
      value: user.publicReposCount.toLocaleString(),
      subtext: `${metrics.originalReposCount} original · ${metrics.forkedReposCount} forks`,
      icon: BookMarked,
      color: '#06b6d4',
      bg: 'rgba(6, 182, 212, 0.12)',
    },
    {
      label: 'Followers',
      value: user.followersCount.toLocaleString(),
      subtext: 'Developer audience',
      icon: Users,
      color: '#10b981',
      bg: 'rgba(16, 185, 129, 0.12)',
    },
    {
      label: 'Following',
      value: user.followingCount.toLocaleString(),
      subtext: 'Network connections',
      icon: UserCheck,
      color: '#3b82f6',
      bg: 'rgba(59, 130, 246, 0.12)',
    },
    {
      label: 'Avg Stars / Repo',
      value: metrics.averageStarsPerRepo,
      subtext: 'Per-project traction',
      icon: Sparkles,
      color: '#ec4899',
      bg: 'rgba(236, 72, 153, 0.12)',
    },
  ];

  return (
    <div className={styles.statsMatrix}>
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <div key={card.label} className={`glass-panel ${styles.statCard}`}>
            <div
              className={styles.statIconBox}
              style={{ backgroundColor: card.bg, color: card.color }}
            >
              <Icon size={24} />
            </div>
            <div className={styles.statContent}>
              <div className={styles.statValue}>{card.value}</div>
              <div className={styles.statLabel}>{card.label}</div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

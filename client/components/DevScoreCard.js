'use client';

import React from 'react';
import styles from '../styles/analyzer.module.css';
import { Award, Zap, Star, BookOpen, Layers } from 'lucide-react';

export default function DevScoreCard({ scoreData }) {
  if (!scoreData) return null;

  const { score, rank, badgeColor, breakdown } = scoreData;
  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (circumference * score) / 100;

  const breakdownItems = [
    { label: 'Repo Quality', value: breakdown?.repoQuality ?? 0, max: 25, icon: BookOpen },
    { label: 'Community Traction', value: breakdown?.communityTraction ?? 0, max: 30, icon: Star },
    { label: 'Recent Velocity', value: breakdown?.recentActivity ?? 0, max: 25, icon: Zap },
    { label: 'Stack Diversity', value: breakdown?.diversityAndReach ?? 0, max: 20, icon: Layers },
  ];

  return (
    <div className={`glass-panel ${styles.scoreCard}`}>
      <div className={styles.scoreHeader}>
        <span className={styles.scoreTitle}>OctoScore Index</span>
        <Award size={18} color={badgeColor} />
      </div>

      <div className={styles.scoreVisual}>
        <div className={styles.scoreCircleWrapper}>
          <svg width="140" height="140" viewBox="0 0 140 140">
            <defs>
              <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#06b6d4" />
                <stop offset="50%" stopColor="#6366f1" />
                <stop offset="100%" stopColor="#a855f7" />
              </linearGradient>
            </defs>

            {/* Background Ring */}
            <circle
              cx="70"
              cy="70"
              r={radius}
              stroke="rgba(255, 255, 255, 0.08)"
              strokeWidth="10"
              fill="transparent"
            />

            {/* Progress Ring with Smooth Transition */}
            <circle
              cx="70"
              cy="70"
              r={radius}
              stroke="url(#scoreGradient)"
              strokeWidth="10"
              fill="transparent"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              transform="rotate(-90 70 70)"
              style={{ transition: 'stroke-dashoffset 1s ease-in-out' }}
            />
          </svg>

          <div className={styles.scoreInnerNumber}>
            <div className={styles.scoreNum} style={{ color: badgeColor }}>
              {score}
            </div>
            <div className={styles.scoreLabel}>/ 100</div>
          </div>
        </div>
      </div>

      <div
        className={styles.rankBadge}
        style={{
          backgroundColor: `${badgeColor}1a`,
          color: badgeColor,
          border: `1px solid ${badgeColor}40`,
        }}
      >
        {rank}
      </div>

      <div className={styles.breakdownList}>
        {breakdownItems.map((item) => {
          const Icon = item.icon;
          const percentage = Math.round((item.value / item.max) * 100);
          return (
            <div key={item.label} className={styles.breakdownItem}>
              <div className={styles.breakdownLabelRow}>
                <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <Icon size={12} />
                  {item.label}
                </span>
                <span>
                  {item.value} / {item.max} pts
                </span>
              </div>
              <div className={styles.progressBarBg}>
                <div
                  className={styles.progressBarFill}
                  style={{ width: `${percentage}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

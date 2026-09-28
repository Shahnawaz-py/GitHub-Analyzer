'use client';

import React from 'react';
import styles from '../styles/analyzer.module.css';
import { Terminal } from 'lucide-react';

export default function LanguageBreakdown({ languages }) {
  if (!languages || languages.length === 0) return null;

  return (
    <div className={`glass-panel ${styles.sectionCard}`}>
      <div className={styles.sectionHeader}>
        <div className={styles.sectionTitle}>
          <Terminal size={20} color="var(--accent-cyan)" />
          <span>Language Breakdown & Ecosystem</span>
        </div>
        <span className="badge badge-indigo">
          {languages.length} Language{languages.length > 1 ? 's' : ''} Detected
        </span>
      </div>

      {/* Multi-segment Stacked Bar */}
      <div className={styles.langBarStacked}>
        {languages.map((lang) => (
          <div
            key={lang.name}
            className={styles.langBarSegment}
            style={{
              width: `${Math.max(1, lang.percentage)}%`,
              backgroundColor: lang.color,
            }}
            title={`${lang.name}: ${lang.percentage}% (${lang.count} repos)`}
          />
        ))}
      </div>

      {/* Language Pills */}
      <div className={styles.langPillGrid}>
        {languages.map((lang) => (
          <div key={lang.name} className={styles.langPill}>
            <span
              className={styles.langDot}
              style={{ backgroundColor: lang.color }}
            />
            <span className={styles.langName}>{lang.name}</span>
            <span className={styles.langPercent}>{lang.percentage}%</span>
            <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>
              ({lang.count} {lang.count === 1 ? 'repo' : 'repos'})
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

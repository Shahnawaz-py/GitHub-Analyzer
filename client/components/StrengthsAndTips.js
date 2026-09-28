'use client';

import React from 'react';
import styles from '../styles/analyzer.module.css';
import { CheckCircle2, Lightbulb, Compass, ShieldCheck } from 'lucide-react';

export default function StrengthsAndTips({ strengths = [], recommendations = [] }) {
  return (
    <div className={styles.insightsGrid}>
      {/* Strengths Card */}
      <div className={`glass-panel ${styles.insightCard}`}>
        <div className={styles.insightHeader} style={{ color: '#34d399' }}>
          <ShieldCheck size={20} />
          <span>Profile Strengths</span>
        </div>
        <div className={styles.insightList}>
          {strengths.map((item, idx) => (
            <div key={idx} className={styles.insightItem}>
              <CheckCircle2 size={16} color="#10b981" />
              <span>{item}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Recommendations Card */}
      <div className={`glass-panel ${styles.insightCard}`}>
        <div className={styles.insightHeader} style={{ color: '#fbbf24' }}>
          <Lightbulb size={20} />
          <span>Resume & Portfolio Suggestions</span>
        </div>
        <div className={styles.insightList}>
          {recommendations.map((item, idx) => (
            <div key={idx} className={styles.insightItem}>
              <Compass size={16} color="#f59e0b" />
              <span>{item}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

'use client';

import React, { useState } from 'react';
import styles from '../styles/analyzer.module.css';
import { Trophy, Swords, Search, Crown, Check, Minus } from 'lucide-react';

export default function ShowdownView({ apiUrl, onRateLimitUpdate }) {
  const [userA, setUserA] = useState('torvalds');
  const [userB, setUserB] = useState('gaearon');
  const [battleData, setBattleData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const presets = [
    { a: 'torvalds', b: 'gaearon', label: 'Torvalds vs Dan Abramov' },
    { a: 'shadcn', b: 'leerob', label: 'shadcn vs Lee Robinson' },
    { a: 'yyx990803', b: 'rich-harris', label: 'Evan You (Vue) vs Rich Harris (Svelte)' },
  ];

  async function runShowdown(uA, uB) {
    const first = uA || userA;
    const second = uB || userB;

    if (!first || !second) {
      setError('Please provide two GitHub usernames to battle.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch(
        `${apiUrl}/compare?userA=${encodeURIComponent(first.trim())}&userB=${encodeURIComponent(second.trim())}`
      );
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to compare GitHub profiles');
      }

      setBattleData(data);
      if (onRateLimitUpdate) onRateLimitUpdate();
    } catch (err) {
      setError(err.message);
      setBattleData(null);
    } finally {
      setLoading(false);
    }
  }

  function handleSubmit(e) {
    e.preventDefault();
    runShowdown();
  }

  function handlePreset(p) {
    setUserA(p.a);
    setUserB(p.b);
    runShowdown(p.a, p.b);
  }

  return (
    <div>
      <div className={styles.showdownHero}>
        <h2 className={styles.heroTitle}>
          Developer <span className="text-gradient">Showdown</span>
        </h2>
        <p className={styles.heroSubtitle}>
          Pit two GitHub developers head-to-head. Compare DevScores, stars, public repositories, and language depth.
        </p>

        <form onSubmit={handleSubmit} className={styles.showdownInputs}>
          <div className={styles.searchForm} style={{ flex: 1 }}>
            <input
              type="text"
              placeholder="First username (e.g. torvalds)"
              value={userA}
              onChange={(e) => setUserA(e.target.value)}
              className={styles.searchInput}
            />
          </div>

          <div className={styles.showdownVersus}>VS</div>

          <div className={styles.searchForm} style={{ flex: 1 }}>
            <input
              type="text"
              placeholder="Second username (e.g. gaearon)"
              value={userB}
              onChange={(e) => setUserB(e.target.value)}
              className={styles.searchInput}
            />
          </div>

          <button type="submit" className={styles.searchSubmitBtn} disabled={loading}>
            <Swords size={18} />
            <span>{loading ? 'Battling...' : 'Start Battle'}</span>
          </button>
        </form>

        <div className={styles.presetsList}>
          <span className={styles.presetLabel}>Epic Matchups:</span>
          {presets.map((p) => (
            <button
              key={p.label}
              className={styles.presetChip}
              onClick={() => handlePreset(p)}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {error && <div className={styles.errorBox}>{error}</div>}

      {loading && (
        <div className={styles.stateContainer}>
          <div className={styles.loadingSpinner} />
          <p style={{ color: 'var(--text-secondary)' }}>
            Comparing profiles, repository stars, and developer scores...
          </p>
        </div>
      )}

      {battleData && !loading && (
        <div className="animate-fade-in">
          {/* Winner Banner */}
          <div className={`glass-panel ${styles.showdownResultCard}`}>
            {battleData.comparison.overallWinner !== 'tie' ? (
              <div className={styles.winnerBanner}>
                <Crown size={24} />
                <span>
                  Champion: @{battleData.comparison.overallWinner} takes the victory!
                </span>
              </div>
            ) : (
              <div className={styles.winnerBanner}>
                <Trophy size={24} />
                <span>Honorable Tie! Both developers are evenly matched.</span>
              </div>
            )}

            {/* Comparison Table */}
            <table className={styles.comparisonTable}>
              <thead>
                <tr>
                  <th style={{ width: '38%' }}>
                    <div className={styles.tableUserHeader}>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={battleData.comparison.userA.avatarUrl}
                        alt={battleData.comparison.userA.login}
                        className={styles.tableAvatar}
                      />
                      <span>@{battleData.comparison.userA.login}</span>
                      {battleData.comparison.overallWinner === battleData.comparison.userA.login && (
                        <Crown size={16} color="#fbbf24" />
                      )}
                    </div>
                  </th>
                  <th style={{ width: '24%' }}>Metric Category</th>
                  <th style={{ width: '38%' }}>
                    <div className={styles.tableUserHeader}>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={battleData.comparison.userB.avatarUrl}
                        alt={battleData.comparison.userB.login}
                        className={styles.tableAvatar}
                      />
                      <span>@{battleData.comparison.userB.login}</span>
                      {battleData.comparison.overallWinner === battleData.comparison.userB.login && (
                        <Crown size={16} color="#fbbf24" />
                      )}
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody>
                {battleData.comparison.categories.map((cat) => {
                  const isAWin = cat.winner === battleData.comparison.userA.login;
                  const isBWin = cat.winner === battleData.comparison.userB.login;

                  return (
                    <tr key={cat.name}>
                      <td className={isAWin ? styles.cellWin : styles.cellLoss}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
                          {isAWin && <Check size={16} color="#10b981" />}
                          <span>{cat.valA.toLocaleString()}</span>
                        </div>
                      </td>
                      <td style={{ fontWeight: 600, color: 'var(--text-secondary)' }}>
                        {cat.name}
                      </td>
                      <td className={isBWin ? styles.cellWin : styles.cellLoss}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
                          {isBWin && <Check size={16} color="#10b981" />}
                          <span>{cat.valB.toLocaleString()}</span>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

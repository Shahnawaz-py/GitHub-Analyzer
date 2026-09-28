'use client';

import React, { useState } from 'react';
import styles from '../styles/analyzer.module.css';
import {
  Star,
  GitFork,
  Eye,
  AlertCircle,
  HardDrive,
  GitBranch,
  Shield,
  CheckCircle,
  XCircle,
  ExternalLink,
  Search,
  GitCommit,
  Layers,
} from 'lucide-react';

export default function RepoAnalyzerView({ initialRepo = '', apiUrl, onRateLimitUpdate }) {
  const [repoInput, setRepoInput] = useState(initialRepo || 'expressjs/express');
  const [repoData, setRepoData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const presets = [
    'expressjs/express',
    'vercel/next.js',
    'facebook/react',
    'torvalds/linux',
  ];

  async function fetchRepoAnalysis(query) {
    const target = query || repoInput;
    if (!target.includes('/')) {
      setError('Please enter a valid format: "owner/repo" (e.g., vercel/next.js)');
      return;
    }

    const [owner, repo] = target.trim().split('/');
    if (!owner || !repo) {
      setError('Both owner and repo name are required.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`${apiUrl}/repo/${encodeURIComponent(owner)}/${encodeURIComponent(repo)}`);
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to fetch repository analysis');
      }

      setRepoData(data);
      if (onRateLimitUpdate) onRateLimitUpdate();
    } catch (err) {
      setError(err.message);
      setRepoData(null);
    } finally {
      setLoading(false);
    }
  }

  function handleSubmit(e) {
    e.preventDefault();
    fetchRepoAnalysis();
  }

  function handlePresetClick(p) {
    setRepoInput(p);
    fetchRepoAnalysis(p);
  }

  return (
    <div>
      <div className={styles.searchHero}>
        <h2 className={styles.heroTitle}>
          Repository <span className="text-gradient">Deep-Dive</span>
        </h2>
        <p className={styles.heroSubtitle}>
          Audit code health, documentation standards, commit velocity, and language distribution for any public GitHub repository.
        </p>

        <div className={styles.searchBoxWrapper}>
          <form className={styles.searchForm} onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="e.g. vercel/next.js or facebook/react"
              value={repoInput}
              onChange={(e) => setRepoInput(e.target.value)}
              className={styles.searchInput}
            />
            <button type="submit" className={styles.searchSubmitBtn} disabled={loading}>
              <Search size={16} />
              <span>{loading ? 'Analyzing...' : 'Audit Repo'}</span>
            </button>
          </form>

          <div className={styles.presetsList}>
            <span className={styles.presetLabel}>Quick Presets:</span>
            {presets.map((p) => (
              <button
                key={p}
                className={styles.presetChip}
                onClick={() => handlePresetClick(p)}
              >
                {p}
              </button>
            ))}
          </div>
        </div>
      </div>

      {error && <div className={styles.errorBox}>{error}</div>}

      {loading && (
        <div className={styles.stateContainer}>
          <div className={styles.loadingSpinner} />
          <p style={{ color: 'var(--text-secondary)' }}>
            Inspecting repository structure, license, and commits...
          </p>
        </div>
      )}

      {repoData && !loading && (
        <div className="animate-fade-in">
          {/* Repo Hero Header */}
          <div className={`glass-panel ${styles.repoDetailsHero}`}>
            <div className={styles.repoHeroTop}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={repoData.repo.owner.avatarUrl}
                    alt={repoData.repo.owner.login}
                    style={{ width: 28, height: 28, borderRadius: '50%' }}
                  />
                  <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                    {repoData.repo.owner.login} /
                  </span>
                </div>
                <h3 className={styles.repoBigName}>
                  <span>{repoData.repo.name}</span>
                  <a
                    href={repoData.repo.htmlUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ color: 'var(--accent-cyan)' }}
                  >
                    <ExternalLink size={20} />
                  </a>
                </h3>
              </div>

              <div
                className={styles.healthScoreBadge}
                style={{
                  background:
                    repoData.healthScore >= 80
                      ? 'rgba(16, 185, 129, 0.15)'
                      : repoData.healthScore >= 50
                      ? 'rgba(245, 158, 11, 0.15)'
                      : 'rgba(244, 63, 94, 0.15)',
                  color:
                    repoData.healthScore >= 80
                      ? '#34d399'
                      : repoData.healthScore >= 50
                      ? '#fbbf24'
                      : '#f87171',
                  border: `1px solid ${
                    repoData.healthScore >= 80
                      ? 'rgba(16, 185, 129, 0.35)'
                      : repoData.healthScore >= 50
                      ? 'rgba(245, 158, 11, 0.35)'
                      : 'rgba(244, 63, 94, 0.35)'
                  }`,
                }}
              >
                <span>Health Score:</span>
                <span style={{ fontSize: '1.2rem', fontWeight: 800 }}>
                  {repoData.healthScore}/100
                </span>
              </div>
            </div>

            <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: 20 }}>
              {repoData.repo.description || 'No description provided.'}
            </p>

            {/* Health Checklist Grid */}
            <div className={styles.healthChecksGrid}>
              {repoData.healthChecks.map((chk, i) => (
                <div key={i} className={styles.healthCheckItem}>
                  {chk.passed ? (
                    <CheckCircle size={18} color="#10b981" />
                  ) : (
                    <XCircle size={18} color="#f43f5e" />
                  )}
                  <span
                    style={{
                      color: chk.passed ? 'var(--text-primary)' : 'var(--text-muted)',
                    }}
                  >
                    {chk.label}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Stats Matrix */}
          <div className={styles.statsMatrix}>
            <div className={`glass-panel ${styles.statCard}`}>
              <div
                className={styles.statIconBox}
                style={{ background: 'rgba(245, 158, 11, 0.15)', color: '#f59e0b' }}
              >
                <Star size={22} />
              </div>
              <div className={styles.statContent}>
                <div className={styles.statValue}>
                  {repoData.repo.stars.toLocaleString()}
                </div>
                <div className={styles.statLabel}>Stars</div>
              </div>
            </div>

            <div className={`glass-panel ${styles.statCard}`}>
              <div
                className={styles.statIconBox}
                style={{ background: 'rgba(139, 92, 246, 0.15)', color: '#8b5cf6' }}
              >
                <GitFork size={22} />
              </div>
              <div className={styles.statContent}>
                <div className={styles.statValue}>
                  {repoData.repo.forks.toLocaleString()}
                </div>
                <div className={styles.statLabel}>Forks</div>
              </div>
            </div>

            <div className={`glass-panel ${styles.statCard}`}>
              <div
                className={styles.statIconBox}
                style={{ background: 'rgba(6, 182, 212, 0.15)', color: '#06b6d4' }}
              >
                <Eye size={22} />
              </div>
              <div className={styles.statContent}>
                <div className={styles.statValue}>
                  {repoData.repo.watchers.toLocaleString()}
                </div>
                <div className={styles.statLabel}>Watchers</div>
              </div>
            </div>

            <div className={`glass-panel ${styles.statCard}`}>
              <div
                className={styles.statIconBox}
                style={{ background: 'rgba(244, 63, 94, 0.15)', color: '#f43f5e' }}
              >
                <AlertCircle size={22} />
              </div>
              <div className={styles.statContent}>
                <div className={styles.statValue}>
                  {repoData.repo.openIssues.toLocaleString()}
                </div>
                <div className={styles.statLabel}>Open Issues</div>
              </div>
            </div>

            <div className={`glass-panel ${styles.statCard}`}>
              <div
                className={styles.statIconBox}
                style={{ background: 'rgba(16, 185, 129, 0.15)', color: '#10b981' }}
              >
                <HardDrive size={22} />
              </div>
              <div className={styles.statContent}>
                <div className={styles.statValue}>{repoData.repo.sizeFormatted}</div>
                <div className={styles.statLabel}>Repository Size</div>
              </div>
            </div>

            <div className={`glass-panel ${styles.statCard}`}>
              <div
                className={styles.statIconBox}
                style={{ background: 'rgba(59, 130, 246, 0.15)', color: '#3b82f6' }}
              >
                <Shield size={22} />
              </div>
              <div className={styles.statContent}>
                <div className={styles.statValue}>
                  {repoData.repo.license || 'None'}
                </div>
                <div className={styles.statLabel}>License</div>
              </div>
            </div>
          </div>

          {/* Languages Breakdown */}
          {repoData.languages && repoData.languages.length > 0 && (
            <div className={`glass-panel ${styles.sectionCard}`}>
              <div className={styles.sectionHeader}>
                <div className={styles.sectionTitle}>
                  <Layers size={20} color="var(--accent-cyan)" />
                  <span>Language Distribution</span>
                </div>
                <span className="badge badge-cyan">
                  {repoData.languages.length} Language{repoData.languages.length > 1 ? 's' : ''}
                </span>
              </div>

              <div className={styles.langBarStacked}>
                {repoData.languages.map((l) => (
                  <div
                    key={l.name}
                    className={styles.langBarSegment}
                    style={{
                      width: `${Math.max(1, l.percentage)}%`,
                      backgroundColor: l.color,
                    }}
                    title={`${l.name}: ${l.percentage}% (${(l.bytes / 1024).toFixed(1)} KB)`}
                  />
                ))}
              </div>

              <div className={styles.langPillGrid}>
                {repoData.languages.map((l) => (
                  <div key={l.name} className={styles.langPill}>
                    <span
                      className={styles.langDot}
                      style={{ backgroundColor: l.color }}
                    />
                    <span className={styles.langName}>{l.name}</span>
                    <span className={styles.langPercent}>{l.percentage}%</span>
                    <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>
                      ({(l.bytes / 1024).toFixed(1)} KB)
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Recent Commits Log */}
          {repoData.recentCommits && repoData.recentCommits.length > 0 && (
            <div className={`glass-panel ${styles.sectionCard}`}>
              <div className={styles.sectionHeader}>
                <div className={styles.sectionTitle}>
                  <GitCommit size={20} color="var(--accent-indigo)" />
                  <span>Recent Commit Stream</span>
                </div>
                <span className="badge badge-indigo">
                  Branch: {repoData.repo.defaultBranch}
                </span>
              </div>

              <div className={styles.commitList}>
                {repoData.recentCommits.map((c) => (
                  <div key={c.sha} className={styles.commitItem}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <span className={styles.commitSha}>{c.sha}</span>
                      <span style={{ color: 'var(--text-primary)' }}>{c.message}</span>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                      <span style={{ color: 'var(--text-secondary)', fontSize: '0.8rem' }}>
                        {c.author}
                      </span>
                      <a
                        href={c.htmlUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ color: 'var(--accent-cyan)' }}
                        title="View commit on GitHub"
                      >
                        <ExternalLink size={14} />
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

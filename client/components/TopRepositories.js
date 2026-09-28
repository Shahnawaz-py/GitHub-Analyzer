'use client';

import React from 'react';
import styles from '../styles/analyzer.module.css';
import { Star, GitFork, ExternalLink, ArrowRight, FolderGit2 } from 'lucide-react';

export default function TopRepositories({ repos = [], onAnalyzeRepo }) {
  if (!repos || repos.length === 0) return null;

  return (
    <div className={`glass-panel ${styles.sectionCard}`}>
      <div className={styles.sectionHeader}>
        <div className={styles.sectionTitle}>
          <FolderGit2 size={20} color="var(--accent-indigo)" />
          <span>Flagship & Starred Repositories</span>
        </div>
        <span className="badge badge-cyan">Top {repos.length} Repositories</span>
      </div>

      <div className={styles.reposGrid}>
        {repos.map((repo) => (
          <div key={repo.name} className={`glass-panel ${styles.repoCard}`}>
            <div className={styles.repoTop}>
              <div className={styles.repoTitleRow}>
                <a
                  href={repo.htmlUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.repoName}
                  title="View repo on GitHub"
                >
                  <span>{repo.name}</span>
                  <ExternalLink size={14} />
                </a>

                {repo.isFork && <span className="badge badge-purple">Fork</span>}
              </div>

              <p className={styles.repoDesc}>
                {repo.description || 'No description provided for this repository.'}
              </p>

              {repo.topics && repo.topics.length > 0 && (
                <div className={styles.repoTopics}>
                  {repo.topics.slice(0, 3).map((topic) => (
                    <span key={topic} className={styles.topicBadge}>
                      #{topic}
                    </span>
                  ))}
                  {repo.topics.length > 3 && (
                    <span className={styles.topicBadge}>
                      +{repo.topics.length - 3}
                    </span>
                  )}
                </div>
              )}
            </div>

            <div className={styles.repoFooter}>
              <div className={styles.repoStatsRow}>
                {repo.language && (
                  <div className={styles.repoStatItem}>
                    <span
                      className={styles.langDot}
                      style={{ backgroundColor: repo.languageColor }}
                    />
                    <span>{repo.language}</span>
                  </div>
                )}

                <div className={styles.repoStatItem} title="Stars">
                  <Star size={14} color="#f59e0b" />
                  <span>{repo.stars.toLocaleString()}</span>
                </div>

                <div className={styles.repoStatItem} title="Forks">
                  <GitFork size={14} color="#8b5cf6" />
                  <span>{repo.forks.toLocaleString()}</span>
                </div>
              </div>

              {onAnalyzeRepo && (
                <button
                  onClick={() => onAnalyzeRepo(repo.fullName)}
                  style={{
                    color: 'var(--accent-cyan)',
                    fontSize: '0.78rem',
                    fontWeight: 600,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 4,
                  }}
                  title="Deep inspect this repository"
                >
                  <span>Deep Inspect</span>
                  <ArrowRight size={13} />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

'use client';

import React from 'react';
import styles from '../styles/analyzer.module.css';
import {
  MapPin,
  Building,
  Link as LinkIcon,
  Calendar,
  ExternalLink,
  Clock,
} from 'lucide-react';

function TwitterIcon({ size = 16 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

export default function UserProfileHero({ user }) {
  if (!user) return null;

  const joinDateFormatted = new Date(user.createdAt).toLocaleDateString('en-US', {
    month: 'short',
    year: 'numeric',
  });

  return (
    <div className={`glass-panel ${styles.profileCard}`}>
      <div className={styles.avatarWrapper}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={user.avatarUrl}
          alt={`${user.login}'s GitHub avatar`}
          className={styles.avatarImg}
        />
      </div>

      <h2 className={styles.profileName}>{user.name}</h2>
      <div className={styles.profileLogin}>@{user.login}</div>

      {user.bio && <p className={styles.profileBio}>{user.bio}</p>}

      <div className={styles.metaList}>
        {user.company && (
          <div className={styles.metaItem}>
            <Building size={16} />
            <span>{user.company}</span>
          </div>
        )}

        {user.location && (
          <div className={styles.metaItem}>
            <MapPin size={16} />
            <span>{user.location}</span>
          </div>
        )}

        {user.blog && (
          <div className={styles.metaItem}>
            <LinkIcon size={16} />
            <a
              href={user.blog.startsWith('http') ? user.blog : `https://${user.blog}`}
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: 'var(--accent-cyan)', wordBreak: 'break-all' }}
            >
              {user.blog.replace(/^https?:\/\//, '')}
            </a>
          </div>
        )}

        {user.twitter && (
          <div className={styles.metaItem}>
            <TwitterIcon size={16} />
            <a
              href={`https://twitter.com/${user.twitter}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              @{user.twitter}
            </a>
          </div>
        )}

        <div className={styles.metaItem}>
          <Calendar size={16} />
          <span>Joined {joinDateFormatted}</span>
        </div>

        <div className={styles.metaItem}>
          <Clock size={16} />
          <span>Account Age: {user.accountAge}</span>
        </div>
      </div>

      <a
        href={user.htmlUrl}
        target="_blank"
        rel="noopener noreferrer"
        className={styles.profileBtn}
      >
        <span>View on GitHub</span>
        <ExternalLink size={16} />
      </a>
    </div>
  );
}

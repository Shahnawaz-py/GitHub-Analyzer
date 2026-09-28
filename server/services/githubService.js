const axios = require('axios');

// In-memory cache with 5-minute TTL to optimize GitHub rate limits
const cache = new Map();
const CACHE_TTL_MS = 5 * 60 * 1000;

function getCached(key) {
  const item = cache.get(key);
  if (!item) return null;
  if (Date.now() > item.expiry) {
    cache.delete(key);
    return null;
  }
  return item.data;
}

function setCached(key, data, ttlMs = CACHE_TTL_MS) {
  cache.set(key, {
    data,
    expiry: Date.now() + ttlMs,
  });
}

const githubClient = axios.create({
  baseURL: 'https://api.github.com',
  headers: {
    Accept: 'application/vnd.github.v3+json',
    'User-Agent': 'GitHub-Analyzer-Pro',
  },
  timeout: 10000,
});

// Attach token if present
githubClient.interceptors.request.use((config) => {
  const token = process.env.GITHUB_TOKEN;
  if (token && token.trim() !== '') {
    config.headers.Authorization = `token ${token.trim()}`;
  }
  return config;
});

async function fetchFromGitHub(endpoint, params = {}) {
  const cacheKey = `${endpoint}:${JSON.stringify(params)}`;
  const cached = getCached(cacheKey);
  if (cached) {
    return { data: cached, fromCache: true };
  }

  try {
    const response = await githubClient.get(endpoint, { params });
    setCached(cacheKey, response.data);
    return { data: response.data, fromCache: false, headers: response.headers };
  } catch (error) {
    if (error.response) {
      const status = error.response.status;
      const message = error.response.data?.message || error.message;
      if (status === 404) {
        const notFoundErr = new Error(`Resource not found on GitHub (${endpoint})`);
        notFoundErr.status = 404;
        throw notFoundErr;
      }
      if (status === 403 && message.includes('API rate limit exceeded')) {
        const rateLimitErr = new Error(
          'GitHub API rate limit exceeded. Provide a personal access token in server/.env to get 5,000 req/hr.'
        );
        rateLimitErr.status = 429;
        throw rateLimitErr;
      }
      const apiErr = new Error(`GitHub API error (${status}): ${message}`);
      apiErr.status = status;
      throw apiErr;
    }
    throw error;
  }
}

async function getUser(username) {
  const result = await fetchFromGitHub(`/users/${encodeURIComponent(username)}`);
  return result.data;
}

async function getUserRepos(username, perPage = 100) {
  // Fetch up to 100 repos, sorted by updated
  const result = await fetchFromGitHub(`/users/${encodeURIComponent(username)}/repos`, {
    per_page: perPage,
    sort: 'updated',
  });
  return result.data;
}

async function getUserEvents(username) {
  try {
    const result = await fetchFromGitHub(`/users/${encodeURIComponent(username)}/events/public`, {
      per_page: 30,
    });
    return result.data;
  } catch {
    // Events might be 404 or empty for some users, fail gracefully
    return [];
  }
}

async function getRepo(owner, repo) {
  const result = await fetchFromGitHub(`/repos/${encodeURIComponent(owner)}/${encodeURIComponent(repo)}`);
  return result.data;
}

async function getRepoLanguages(owner, repo) {
  try {
    const result = await fetchFromGitHub(`/repos/${encodeURIComponent(owner)}/${encodeURIComponent(repo)}/languages`);
    return result.data;
  } catch {
    return {};
  }
}

async function getRepoCommits(owner, repo, perPage = 10) {
  try {
    const result = await fetchFromGitHub(
      `/repos/${encodeURIComponent(owner)}/${encodeURIComponent(repo)}/commits`,
      { per_page: perPage }
    );
    return result.data;
  } catch {
    return [];
  }
}

async function getRateLimit() {
  try {
    const result = await fetchFromGitHub('/rate_limit');
    return result.data;
  } catch (error) {
    return {
      rate: {
        limit: 60,
        remaining: 'unknown',
        reset: Math.floor(Date.now() / 1000) + 3600,
      },
    };
  }
}

module.exports = {
  getUser,
  getUserRepos,
  getUserEvents,
  getRepo,
  getRepoLanguages,
  getRepoCommits,
  getRateLimit,
};

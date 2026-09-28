const express = require('express');
const router = express.Router();
const githubService = require('../services/githubService');
const analyzerService = require('../services/analyzerService');

// Health check
router.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Check GitHub API rate limit
router.get('/ratelimit', async (req, res) => {
  try {
    const rateData = await githubService.getRateLimit();
    res.json(rateData);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Deep analyze GitHub user profile
router.get('/user/:username', async (req, res) => {
  const { username } = req.params;
  if (!username || username.trim() === '') {
    return res.status(400).json({ error: 'Username parameter is required' });
  }

  try {
    const [user, repos, events] = await Promise.all([
      githubService.getUser(username),
      githubService.getUserRepos(username),
      githubService.getUserEvents(username),
    ]);

    const analysis = analyzerService.analyzeUserData(user, repos, events);
    res.json(analysis);
  } catch (error) {
    const status = error.status || 500;
    res.status(status).json({
      error: error.message || 'Failed to analyze GitHub user',
      status,
    });
  }
});

// Deep analyze a specific GitHub repository
router.get('/repo/:owner/:repo', async (req, res) => {
  const { owner, repo } = req.params;
  if (!owner || !repo) {
    return res.status(400).json({ error: 'Owner and repo parameters are required' });
  }

  try {
    const [repoData, languages, commits] = await Promise.all([
      githubService.getRepo(owner, repo),
      githubService.getRepoLanguages(owner, repo),
      githubService.getRepoCommits(owner, repo),
    ]);

    const analysis = analyzerService.analyzeRepoData(repoData, languages, commits);
    res.json(analysis);
  } catch (error) {
    const status = error.status || 500;
    res.status(status).json({
      error: error.message || 'Failed to analyze GitHub repository',
      status,
    });
  }
});

// Compare two users
router.get('/compare', async (req, res) => {
  const { userA, userB } = req.query;
  if (!userA || !userB) {
    return res.status(400).json({ error: 'Both userA and userB query parameters are required' });
  }

  try {
    const [userDataA, userDataB] = await Promise.all([
      Promise.all([
        githubService.getUser(userA),
        githubService.getUserRepos(userA),
        githubService.getUserEvents(userA),
      ]),
      Promise.all([
        githubService.getUser(userB),
        githubService.getUserRepos(userB),
        githubService.getUserEvents(userB),
      ]),
    ]);

    const analysisA = analyzerService.analyzeUserData(userDataA[0], userDataA[1], userDataA[2]);
    const analysisB = analyzerService.analyzeUserData(userDataB[0], userDataB[1], userDataB[2]);

    const comparison = analyzerService.compareUsers(analysisA, analysisB);
    res.json({
      comparison,
      userA: analysisA,
      userB: analysisB,
    });
  } catch (error) {
    const status = error.status || 500;
    res.status(status).json({
      error: error.message || 'Failed to compare GitHub users',
      status,
    });
  }
});

module.exports = router;

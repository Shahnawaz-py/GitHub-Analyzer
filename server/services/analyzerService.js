// Language color definitions matching GitHub standard colors
const LANGUAGE_COLORS = {
  JavaScript: '#f1e05a',
  TypeScript: '#3178c6',
  Python: '#3572A5',
  Java: '#b07219',
  'C++': '#f34b7d',
  'C#': '#178600',
  C: '#555555',
  HTML: '#e34c26',
  CSS: '#563d7c',
  Rust: '#dea584',
  Go: '#00ADD8',
  PHP: '#4F5D95',
  Ruby: '#701516',
  Swift: '#F05138',
  Kotlin: '#A97BFF',
  Dart: '#00B4AB',
  Shell: '#89e051',
  Vue: '#41b883',
  R: '#198CE7',
  Scala: '#c22d40',
  Lua: '#000080',
  Elixir: '#6e4a7e',
  Unknown: '#8b949e',
};

function getLanguageColor(lang) {
  return LANGUAGE_COLORS[lang] || '#6366f1';
}

function calculateDevScore({ user, repos, events, totalStars, totalForks, languages }) {
  let score = 0;
  const originalRepos = repos.filter((r) => !r.fork);
  const reposWithDesc = originalRepos.filter((r) => r.description && r.description.trim().length > 5);

  // 1. Repository Quality & Breadth (Max 25 pts)
  const originalCount = originalRepos.length;
  if (originalCount >= 15) score += 15;
  else if (originalCount >= 8) score += 12;
  else if (originalCount >= 3) score += 8;
  else if (originalCount >= 1) score += 4;

  const descRatio = originalCount > 0 ? reposWithDesc.length / originalCount : 0;
  score += Math.round(descRatio * 10); // up to 10 points

  // 2. Community Traction & Stars (Max 30 pts)
  if (totalStars >= 500) score += 30;
  else if (totalStars >= 200) score += 26;
  else if (totalStars >= 100) score += 22;
  else if (totalStars >= 50) score += 18;
  else if (totalStars >= 20) score += 14;
  else if (totalStars >= 5) score += 10;
  else if (totalStars >= 1) score += 5;

  if (totalForks >= 50) score += 5;
  else if (totalForks >= 10) score += 3;
  else if (totalForks >= 1) score += 1;

  // 3. Activity & Consistency (Max 25 pts)
  const pushEvents = events.filter((e) => e.type === 'PushEvent');
  const prEvents = events.filter((e) => e.type === 'PullRequestEvent');
  const issueEvents = events.filter((e) => e.type === 'IssuesEvent');

  if (pushEvents.length >= 10) score += 12;
  else if (pushEvents.length >= 5) score += 8;
  else if (pushEvents.length >= 1) score += 4;

  if (prEvents.length >= 3) score += 8;
  else if (prEvents.length >= 1) score += 5;

  if (issueEvents.length >= 1) score += 5;

  // 4. Followers & Code Diversity (Max 20 pts)
  const followers = user.followers || 0;
  if (followers >= 500) score += 10;
  else if (followers >= 100) score += 8;
  else if (followers >= 30) score += 6;
  else if (followers >= 10) score += 4;
  else if (followers >= 1) score += 2;

  const langCount = Object.keys(languages).length;
  if (langCount >= 5) score += 10;
  else if (langCount >= 3) score += 7;
  else if (langCount >= 2) score += 4;
  else if (langCount >= 1) score += 2;

  // Clamp score between 0 and 100
  const finalScore = Math.min(100, Math.max(5, Math.round(score)));

  let rank = 'Novice Explorer';
  let badgeColor = '#94a3b8';
  if (finalScore >= 90) {
    rank = 'Mythic Architect';
    badgeColor = '#f59e0b';
  } else if (finalScore >= 75) {
    rank = 'Elite Contributor';
    badgeColor = '#8b5cf6';
  } else if (finalScore >= 60) {
    rank = 'Senior Builder';
    badgeColor = '#3b82f6';
  } else if (finalScore >= 40) {
    rank = 'Active Crafter';
    badgeColor = '#10b981';
  }

  return {
    score: finalScore,
    rank,
    badgeColor,
    breakdown: {
      repoQuality: Math.min(25, Math.round(originalCount >= 5 ? 15 : 8) + Math.round(descRatio * 10)),
      communityTraction: Math.min(30, totalStars > 0 ? Math.min(30, Math.round(totalStars * 1.5)) : 2),
      recentActivity: Math.min(25, pushEvents.length * 2 + prEvents.length * 3 + 4),
      diversityAndReach: Math.min(20, Math.round(followers * 0.5) + langCount * 2),
    },
  };
}

function generateStrengthsAndRecommendations({ user, repos, events, totalStars, languages, scoreData }) {
  const strengths = [];
  const recommendations = [];

  const originalRepos = repos.filter((r) => !r.fork);
  const langCount = Object.keys(languages).length;

  // Strengths checks
  if (totalStars >= 10) {
    strengths.push(`Community recognition with ${totalStars} total stars across public repositories.`);
  }
  if (langCount >= 4) {
    strengths.push(`Polyglot versatility: Actively builds using ${langCount} distinct programming languages.`);
  }
  if (user.bio && user.bio.trim().length > 10) {
    strengths.push('Clear personal brand with a detailed profile biography.');
  }
  const reposWithDesc = originalRepos.filter((r) => r.description && r.description.trim().length > 5);
  const descPercent = originalRepos.length > 0 ? Math.round((reposWithDesc.length / originalRepos.length) * 100) : 0;
  if (descPercent >= 70) {
    strengths.push(`Strong documentation discipline: ${descPercent}% of original repos have informative descriptions.`);
  }
  if (events.length > 15) {
    strengths.push('High public development velocity with frequent push and collaboration events.');
  }

  if (strengths.length === 0) {
    strengths.push('Active GitHub presence with public repositories ready for expansion.');
    strengths.push(`Portfolio built with primary language: ${repos[0]?.language || 'JavaScript'}.`);
  }

  // Recommendations checks
  if (!user.bio || user.bio.trim().length < 5) {
    recommendations.push('Add an engaging profile bio highlighting your core skills, passions, and current projects.');
  }
  if (descPercent < 70) {
    recommendations.push('Write concise, informative descriptions and tags for repos currently missing them.');
  }
  const reposWithoutLicense = originalRepos.filter((r) => !r.license);
  if (reposWithoutLicense.length > 0) {
    recommendations.push(`Add open source licenses (like MIT or Apache-2.0) to ${reposWithoutLicense.length} unlicensed projects.`);
  }
  if (!user.blog || user.blog.trim() === '') {
    recommendations.push('Link your personal website, portfolio, or LinkedIn profile to maximize recruiter reach.');
  }
  if (originalRepos.length < 5) {
    recommendations.push('Publish more original projects or open-source libraries to demonstrate end-to-end capabilities.');
  }
  if (recommendations.length === 0) {
    recommendations.push('Pin your top 6 flagship repositories on your GitHub profile page to showcase your best code.');
    recommendations.push('Contribute pull requests to popular open-source repositories to boost global community reach.');
  }

  return { strengths: strengths.slice(0, 4), recommendations: recommendations.slice(0, 4) };
}

function analyzeUserData(user, repos = [], events = []) {
  let totalStars = 0;
  let totalForks = 0;
  let totalOpenIssues = 0;
  const languageCounts = {};

  repos.forEach((repo) => {
    totalStars += repo.stargazers_count || 0;
    totalForks += repo.forks_count || 0;
    totalOpenIssues += repo.open_issues_count || 0;

    if (repo.language) {
      languageCounts[repo.language] = (languageCounts[repo.language] || 0) + 1;
    }
  });

  // Calculate language distribution percentages
  const totalLangsCount = Object.values(languageCounts).reduce((a, b) => a + b, 0);
  const languages = Object.entries(languageCounts)
    .map(([name, count]) => ({
      name,
      count,
      percentage: totalLangsCount > 0 ? Math.round((count / totalLangsCount) * 100) : 0,
      color: getLanguageColor(name),
    }))
    .sort((a, b) => b.count - a.count);

  // Top starred repos
  const topStarredRepos = [...repos]
    .sort((a, b) => (b.stargazers_count || 0) - (a.stargazers_count || 0))
    .slice(0, 6)
    .map((r) => ({
      name: r.name,
      fullName: r.full_name,
      description: r.description,
      htmlUrl: r.html_url,
      stars: r.stargazers_count,
      forks: r.forks_count,
      language: r.language,
      languageColor: getLanguageColor(r.language),
      updatedAt: r.updated_at,
      isFork: r.fork,
      topics: r.topics || [],
    }));

  // Account creation & age
  const createdAt = new Date(user.created_at);
  const now = new Date();
  const diffYears = (now - createdAt) / (1000 * 60 * 60 * 24 * 365.25);
  const accountAgeFormatted =
    diffYears >= 1 ? `${diffYears.toFixed(1)} years` : `${Math.max(1, Math.round(diffYears * 12))} months`;

  // Activity events analysis
  const recentEvents = events.slice(0, 15).map((e) => ({
    id: e.id,
    type: e.type,
    repoName: e.repo?.name,
    createdAt: e.created_at,
    action: formatEventAction(e),
  }));

  const scoreData = calculateDevScore({
    user,
    repos,
    events,
    totalStars,
    totalForks,
    languages: languageCounts,
  });

  const { strengths, recommendations } = generateStrengthsAndRecommendations({
    user,
    repos,
    events,
    totalStars,
    languages: languageCounts,
    scoreData,
  });

  return {
    user: {
      login: user.login,
      name: user.name || user.login,
      avatarUrl: user.avatar_url,
      htmlUrl: user.html_url,
      bio: user.bio,
      company: user.company,
      location: user.location,
      blog: user.blog,
      twitter: user.twitter_username,
      publicReposCount: user.public_repos,
      followersCount: user.followers,
      followingCount: user.following,
      createdAt: user.created_at,
      accountAge: accountAgeFormatted,
    },
    metrics: {
      totalStars,
      totalForks,
      totalOpenIssues,
      originalReposCount: repos.filter((r) => !r.fork).length,
      forkedReposCount: repos.filter((r) => r.fork).length,
      languagesCount: languages.length,
      averageStarsPerRepo: repos.length > 0 ? (totalStars / repos.length).toFixed(1) : 0,
    },
    score: scoreData,
    languages,
    topStarredRepos,
    recentEvents,
    strengths,
    recommendations,
  };
}

function formatEventAction(event) {
  switch (event.type) {
    case 'PushEvent':
      return `Pushed ${event.payload?.commits?.length || 1} commit(s)`;
    case 'PullRequestEvent':
      return `${event.payload?.action === 'opened' ? 'Opened' : 'Updated'} pull request`;
    case 'IssuesEvent':
      return `${event.payload?.action === 'opened' ? 'Created' : 'Updated'} issue`;
    case 'WatchEvent':
      return 'Starred repository';
    case 'ForkEvent':
      return 'Forked repository';
    case 'CreateEvent':
      return `Created ${event.payload?.ref_type || 'repository'}`;
    default:
      return event.type.replace('Event', '');
  }
}

function analyzeRepoData(repo, languagesObj = {}, commits = []) {
  const totalLangBytes = Object.values(languagesObj).reduce((a, b) => a + b, 0);
  const languages = Object.entries(languagesObj)
    .map(([name, bytes]) => ({
      name,
      bytes,
      percentage: totalLangBytes > 0 ? Math.round((bytes / totalLangBytes) * 100) : 0,
      color: getLanguageColor(name),
    }))
    .sort((a, b) => b.bytes - a.bytes);

  // Calculate Repo Health Score (0-100)
  let healthScore = 20; // baseline
  const checks = [];

  if (repo.description && repo.description.trim().length > 10) {
    healthScore += 20;
    checks.push({ label: 'Has informative description', passed: true });
  } else {
    checks.push({ label: 'Missing detailed description', passed: false });
  }

  if (repo.license) {
    healthScore += 20;
    checks.push({ label: `Has open source license (${repo.license.spdx_id || repo.license.name})`, passed: true });
  } else {
    checks.push({ label: 'Missing open source license', passed: false });
  }

  if (repo.topics && repo.topics.length > 0) {
    healthScore += 15;
    checks.push({ label: `Has repository tags/topics (${repo.topics.length})`, passed: true });
  } else {
    checks.push({ label: 'No repository topics configured', passed: false });
  }

  if (repo.has_issues) {
    healthScore += 10;
    checks.push({ label: 'Issue tracker enabled', passed: true });
  }

  if (commits.length > 0) {
    healthScore += 15;
    checks.push({ label: 'Active commit history', passed: true });
  }

  healthScore = Math.min(100, healthScore);

  return {
    repo: {
      name: repo.name,
      fullName: repo.full_name,
      owner: {
        login: repo.owner.login,
        avatarUrl: repo.owner.avatar_url,
      },
      htmlUrl: repo.html_url,
      description: repo.description,
      stars: repo.stargazers_count,
      forks: repo.forks_count,
      watchers: repo.watchers_count,
      openIssues: repo.open_issues_count,
      primaryLanguage: repo.language,
      languageColor: getLanguageColor(repo.language),
      defaultBranch: repo.default_branch,
      sizeKb: repo.size,
      sizeFormatted: repo.size > 1024 ? `${(repo.size / 1024).toFixed(1)} MB` : `${repo.size} KB`,
      license: repo.license ? repo.license.spdx_id || repo.license.name : null,
      topics: repo.topics || [],
      createdAt: repo.created_at,
      updatedAt: repo.updated_at,
      pushedAt: repo.pushed_at,
      isFork: repo.fork,
      isArchived: repo.archived,
    },
    languages,
    healthScore,
    healthChecks: checks,
    recentCommits: commits.slice(0, 8).map((c) => ({
      sha: c.sha.substring(0, 7),
      message: c.commit.message.split('\n')[0],
      author: c.commit.author.name,
      avatarUrl: c.author?.avatar_url,
      date: c.commit.author.date,
      htmlUrl: c.html_url,
    })),
  };
}

function compareUsers(analysisA, analysisB) {
  const userA = analysisA.user;
  const userB = analysisB.user;

  const categories = [
    {
      name: 'Developer Score',
      valA: analysisA.score.score,
      valB: analysisB.score.score,
      higherIsBetter: true,
    },
    {
      name: 'Total Stars',
      valA: analysisA.metrics.totalStars,
      valB: analysisB.metrics.totalStars,
      higherIsBetter: true,
    },
    {
      name: 'Followers',
      valA: userA.followersCount,
      valB: userB.followersCount,
      higherIsBetter: true,
    },
    {
      name: 'Public Repositories',
      valA: userA.publicReposCount,
      valB: userB.publicReposCount,
      higherIsBetter: true,
    },
    {
      name: 'Total Forks',
      valA: analysisA.metrics.totalForks,
      valB: analysisB.metrics.totalForks,
      higherIsBetter: true,
    },
    {
      name: 'Language Diversity',
      valA: analysisA.languages.length,
      valB: analysisB.languages.length,
      higherIsBetter: true,
    },
  ];

  let winsA = 0;
  let winsB = 0;

  const processedCategories = categories.map((cat) => {
    let winner = 'tie';
    if (cat.valA > cat.valB) {
      winner = userA.login;
      winsA++;
    } else if (cat.valB > cat.valA) {
      winner = userB.login;
      winsB++;
    }
    return {
      ...cat,
      winner,
    };
  });

  let overallWinner = 'tie';
  if (winsA > winsB) overallWinner = userA.login;
  else if (winsB > winsA) overallWinner = userB.login;

  return {
    userA: { login: userA.login, avatarUrl: userA.avatarUrl, wins: winsA, score: analysisA.score.score },
    userB: { login: userB.login, avatarUrl: userB.avatarUrl, wins: winsB, score: analysisB.score.score },
    overallWinner,
    categories: processedCategories,
  };
}

module.exports = {
  analyzeUserData,
  analyzeRepoData,
  compareUsers,
  getLanguageColor,
};

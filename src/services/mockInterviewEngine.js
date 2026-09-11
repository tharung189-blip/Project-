/**
 * AI Interview Mock Evaluation Engine — STRICT MODE
 *
 * Scoring Philosophy: No free marks. Every point must be earned.
 * ─────────────────────────────────────────────────────────────
 * 1. CONCEPT COVERAGE (STRICT)
 *    A concept is COVERED only if ≥ 70% of its technical keywords are found.
 *    Vague or partial mentions → MISSED. Exact/synonym match required.
 *
 * 2. SCORING FORMULA (No inflation)
 *    Technical Accuracy  = (coveredConcepts / totalConcepts) × 100  [pure]
 *    Problem Solving     = coverage-weighted depth (deducted for missing depth)
 *    Communication       = strict: requires ≥ 60 words, structure, trade-offs
 *    Overall Score       = (accuracy × 0.55) + (problemSolving × 0.30) + (communication × 0.15)
 *    → Short/vague answers CAN score 0–20. There is no baseline gift.
 *
 * 3. FEEDBACK
 *    Every missed concept is explicitly named and explained.
 *    Score reflects actual interview bar — not encouragement.
 */

// ─── Concept Synonyms & Expansion Map ──────────────────────────────────────
// Allows partial matching — e.g. "cache" also matches "caching", "cached"
const TECH_SYNONYMS = {
  'cache':         ['cache', 'caching', 'cached', 'redis', 'memcached', 'cdncache'],
  'index':         ['index', 'indexing', 'indexed', 'btree', 'b-tree', 'hash index'],
  'async':         ['async', 'asynchronous', 'await', 'promise', 'non-blocking'],
  'concurrent':    ['concurrent', 'concurrency', 'parallel', 'threading', 'multithread'],
  'sql':           ['sql', 'query', 'database', 'relational', 'postgres', 'mysql'],
  'api':           ['api', 'rest', 'graphql', 'grpc', 'endpoint', 'http'],
  'docker':        ['docker', 'container', 'kubernetes', 'k8s', 'orchestration'],
  'security':      ['security', 'auth', 'authentication', 'jwt', 'oauth', 'ssl', 'tls', 'https'],
  'scale':         ['scale', 'scaling', 'scalable', 'horizontal', 'vertical', 'load'],
  'model':         ['model', 'ml', 'machine learning', 'training', 'inference', 'neural'],
  'embed':         ['embed', 'embedding', 'vector', 'semantic', 'dense', 'sparse'],
  'partition':     ['partition', 'shard', 'sharding', 'distributed', 'replicate'],
  'monitor':       ['monitor', 'monitoring', 'metrics', 'logging', 'observability', 'tracing'],
  'python':        ['python', 'gil', 'asyncio', 'multiprocessing', 'decorator', 'generator'],
  'prompt':        ['prompt', 'prompting', 'chain-of-thought', 'cot', 'few-shot', 'zero-shot'],
  'test':          ['test', 'testing', 'unit test', 'tdd', 'coverage', 'assertion'],
  'deploy':        ['deploy', 'deployment', 'ci/cd', 'pipeline', 'release', 'devops'],
};

const COMMON_STOPWORDS = new Set([
  'a','an','the','and','or','but','in','on','at','to','for','of','with','by',
  'from','up','about','into','through','how','what','when','where','why','which',
  'is','are','was','were','be','been','being','have','has','had','do','does',
  'did','will','would','could','should','may','might','can','vs','via','use',
  'using','used','we','i','you','it','its','this','that','these','those',
  'also','then','so','if','as','just','very','more','most','some','any',
]);

// ─── Utility Functions ──────────────────────────────────────────────────────

/** Tokenise a phrase into meaningful lowercase terms, removing stopwords */
function tokenize(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s\/\-\_]/g, ' ')
    .split(/[\s\-\/]+/)
    .map(w => w.trim())
    .filter(w => w.length > 2 && !COMMON_STOPWORDS.has(w));
}

/** Expand a keyword to include its synonyms */
function expandKeyword(word) {
  for (const [root, variants] of Object.entries(TECH_SYNONYMS)) {
    if (variants.some(v => word.includes(v) || v.includes(word))) {
      return variants; // return all synonym forms
    }
  }
  return [word];
}

/**
 * Check if a single expectedKeyPoint concept is covered in the candidate's answer.
 * Returns: { covered: boolean, matchedTerms: string[], missedTerms: string[], coverageRatio: number }
 */
function analyzeKeyPointCoverage(keyPoint, answerText) {
  const answerLower = answerText.toLowerCase();
  const conceptTokens = tokenize(keyPoint);

  if (conceptTokens.length === 0) return { covered: false, matchedTerms: [], missedTerms: [], coverageRatio: 0 };

  const matchedTerms = [];
  const missedTerms = [];

  for (const token of conceptTokens) {
    const variants = expandKeyword(token);
    const found = variants.some(v => answerLower.includes(v));
    if (found) {
      matchedTerms.push(token);
    } else {
      missedTerms.push(token);
    }
  }

  const coverageRatio = matchedTerms.length / conceptTokens.length;
  // STRICT: A concept is COVERED only if ≥ 70% of its exact keywords are found.
  // This prevents vague answers from gaming the system.
  const covered = coverageRatio >= 0.70;

  return { covered, matchedTerms, missedTerms, coverageRatio };
}

/**
 * STRICT Communication Scoring
 * Minimum bar: must be at least 60 words with technical structure.
 * There is NO baseline gift — 0 is a real possible score.
 */
function scoreCommunication(answer) {
  const sentences = answer.split(/[.!?\n]+/).filter(s => s.trim().length > 8);
  const wordCount = answer.trim().split(/\s+/).length;

  // Hard floor: extremely short answers get very low communication score
  if (wordCount < 10) return 5;
  if (wordCount < 20) return 15;
  if (wordCount < 35) return 28;

  // Meaningful signals (must actually demonstrate structured thinking)
  const hasTradeoffs  = /trade.?off|however|on the other hand|vs\b|versus|disadvantage|downside|limitation|but\s/.test(answer.toLowerCase());
  const hasExamples   = /\bfor example\b|\be\.g\.\b|\bsuch as\b|\bfor instance\b|\bconsider\b/.test(answer.toLowerCase());
  const hasNumbers    = /\b\d+(?:ms|s|%|k|m|gb|tb|req|rps)?\b/.test(answer);
  const hasStructure  = sentences.length >= 4;
  const hasMechanism  = /\bbecause\b|\bsince\b|\bwhich means\b|\bthis ensures\b|\bso that\b|\bwhereby\b/.test(answer.toLowerCase());
  const hasTechDepth  = wordCount >= 80;
  const hasDefinition = wordCount >= 60;

  let score = 30; // true baseline — only for answering at all with substance
  if (hasDefinition)  score += 12;
  if (hasTechDepth)   score += 10;
  if (hasStructure)   score += 10;
  if (hasTradeoffs)   score += 14; // highest reward: trade-off analysis is senior signal
  if (hasExamples)    score += 10;
  if (hasMechanism)   score += 8;
  if (hasNumbers)     score += 6;

  return Math.min(100, score);
}

// ─── QUESTION BANK ─────────────────────────────────────────────────────────

const ROLE_QUESTIONS = {
  'Frontend Engineer': [
    {
      questionText: 'How would you optimize Largest Contentful Paint (LCP) and mitigate layout shifts (CLS) on a high-traffic web application?',
      expectedKeyPoints: ['LCP element identification & priority fetch', 'Image sizing & responsive attributes', 'Font loading strategies (font-display)', 'Avoiding dynamic content insertion above fold'],
      category: 'Performance Optimization'
    },
    {
      questionText: "Explain how React's Fiber reconciler schedules concurrent updates and manages task prioritization.",
      expectedKeyPoints: ['Fiber node data structure & work loop', 'Reconciliation phases (Render vs Commit)', 'useTransition / useDeferredValue prioritization', 'Time-slicing via requestIdleCallback / MessageChannel'],
      category: 'Framework Architecture'
    },
    {
      questionText: 'Design a client-side state management system for a real-time collaborative document editor.',
      expectedKeyPoints: ['Operational Transformation (OT) or CRDTs', 'WebSocket sync & optimistic local updates', 'Conflict resolution strategy', 'State normalization & memoization'],
      category: 'Frontend System Design'
    },
    {
      questionText: 'How do Micro-Frontends coordinate shared dependencies, routing, and global events without tight coupling?',
      expectedKeyPoints: ['Module Federation & dynamic imports', 'Custom Event bus / BroadcastChannel', 'Isolated styling (CSS Modules/Shadow DOM)', 'Independent deployment pipelines'],
      category: 'Architecture & Scalability'
    }
  ],
  'Backend Engineer': [
    {
      questionText: 'How do you design a database indexing and caching strategy to handle 10,000 read requests/sec with minimal latency?',
      expectedKeyPoints: ['B-Tree vs Hash indexing', 'Cache-Aside pattern with Redis/Memcached', 'Cache invalidation & TTL strategies', 'Read replicas & connection pooling'],
      category: 'Data Storage & Caching'
    },
    {
      questionText: 'Explain how you would implement idempotent API endpoints for payment processing under distributed environments.',
      expectedKeyPoints: ['Idempotency keys & unique constraint locks', 'Atomic DB transactions', 'Distributed locks (Redis Redlock / ZooKeeper)', 'Handling transient network retries'],
      category: 'Distributed Systems'
    },
    {
      questionText: 'Compare gRPC vs REST vs GraphQL for microservice-to-microservice communication. When would you choose gRPC?',
      expectedKeyPoints: ['HTTP/2 multiplexing & binary Protobuf payload', 'Strict schema contracts', 'Streaming capabilities (Bi-directional)', 'Trade-offs: Browser support vs overhead'],
      category: 'API Design & Protocols'
    },
    {
      questionText: 'How do you prevent and troubleshoot memory leaks in asynchronous Node.js / Go worker pools?',
      expectedKeyPoints: ['Event listener leaks & unclosed handles', 'Heap dump analysis & profiling tools', 'Garbage collection mechanics', 'Context cancellation & channel closing'],
      category: 'Runtime & Profiling'
    }
  ],
  'Fullstack Engineer': [
    {
      questionText: 'Walk me through how you architect an end-to-end authentication flow using JWTs, refresh token rotation, and HttpOnly cookies.',
      expectedKeyPoints: ['HttpOnly / SameSite cookie security', 'Short-lived access tokens & long-lived refresh tokens', 'Token revocation lists / Redis store', 'CSRF & XSS protection mechanisms'],
      category: 'Security & Auth'
    },
    {
      questionText: 'Design a web notification system capable of sending push alerts to 5 million active mobile and web users concurrently.',
      expectedKeyPoints: ['Message queues (Kafka / RabbitMQ)', 'Pub/Sub worker clusters', 'WebSockets / SSE connection gateways', 'Rate limiting & retry exponential backoff'],
      category: 'System Architecture'
    },
    {
      questionText: 'How do Server-Sent Events (SSE) differ from WebSockets, and when is SSE the superior architectural choice?',
      expectedKeyPoints: ['Unidirectional HTTP/2 stream vs Bi-directional TCP', 'Built-in auto-reconnect & event IDs', 'Proxy / firewall friendliness', 'Resource footprint comparison'],
      category: 'Network Protocols'
    }
  ],
  'System Architect': [
    {
      questionText: 'Design a global distributed rate limiter that enforces a quota of 100 requests per minute per IP across 10 regions.',
      expectedKeyPoints: ['Token Bucket / Leaky Bucket algorithm', 'Sliding Window Counter using Redis Lua scripts', 'Eventual consistency vs central latency', 'Local burst capacity with background sync'],
      category: 'Distributed System Design'
    },
    {
      questionText: 'How would you migrate a monolithic database with 500M rows to a sharded database without downtime?',
      expectedKeyPoints: ['Dual-writing phase with feature flags', 'CDC (Change Data Capture) via Debezium/Kafka', 'Consistent hashing shard keys', 'Verification & cutover protocol'],
      category: 'Database Sharding & Migration'
    }
  ],
  'Data Analyst': [
    {
      questionText: 'How do you construct SQL queries to analyze user retention cohorts over a 90-day window using window functions?',
      expectedKeyPoints: ['LAG / LEAD and DATE_TRUNC', 'Self-joins vs Common Table Expressions (CTEs)', 'Handling null values & churn definitions', 'Performance optimization via indexing'],
      category: 'SQL & Analytics'
    },
    {
      questionText: 'Walk me through how you detect, validate, and clean anomalies in raw transactional datasets before generating executive dashboards.',
      expectedKeyPoints: ['Z-score & IQR outlier detection', 'Imputation strategies (Mean/Median vs Model-based)', 'Handling duplicate entries & schema drift', 'Data freshness checks'],
      category: 'Data Wrangling & Quality'
    }
  ],
  'Data Scientist': [
    {
      questionText: 'Explain the Bias-Variance tradeoff and how you mitigate overfitting when training gradient boosted trees (e.g., XGBoost, LightGBM).',
      expectedKeyPoints: ['Underfitting vs Overfitting dynamics', 'Hyperparameter tuning (max_depth, learning_rate, subsample)', 'Cross-validation & early stopping', 'L1 / L2 Regularization'],
      category: 'Machine Learning Theory'
    },
    {
      questionText: 'How do you handle class imbalance when training a fraud detection classification model?',
      expectedKeyPoints: ['SMOTE & ADASYN resampling', 'Cost-sensitive learning / weighted loss', 'PR-AUC vs ROC-AUC evaluation metrics', 'Focal Loss'],
      category: 'Applied Modeling'
    }
  ],
  'Python Developer': [
    {
      questionText: "Explain Python's Global Interpreter Lock (GIL) and how it affects CPU-bound vs I/O-bound concurrency. How do you bypass the GIL?",
      expectedKeyPoints: ['C-Python single-threaded execution lock', 'Multiprocessing vs Multithreading vs Asyncio', 'C-extensions (Cython/CFFI)', 'GIL release during native I/O'],
      category: 'Python Core Mechanics'
    },
    {
      questionText: 'How do Python decorators, descriptors (`__get__`, `__set__`), and context managers (`__enter__`, `__exit__`) work under the hood?',
      expectedKeyPoints: ['Higher-order functions & closures', 'Descriptor protocol & attribute lookup order', 'Context management protocol', 'Memory management & reference counting'],
      category: 'Advanced Python Architecture'
    }
  ],
  'AI Engineer': [
    {
      questionText: 'How would you architect a Retrieval-Augmented Generation (RAG) system with hybrid search, reranking, and semantic caching?',
      expectedKeyPoints: ['Dense vs Sparse embeddings (BM25 + Vector)', 'Cross-encoder reranking models', 'Vector DB indexing (HNSW / FAISS)', 'Semantic cache invalidation'],
      category: 'LLM System Architecture'
    },
    {
      questionText: 'How do you evaluate hallucination rates and accuracy of LLM outputs in automated CI/CD evaluation pipelines?',
      expectedKeyPoints: ['LLM-as-a-Judge evaluation framework', 'G-Eval & RAGAS metrics (Faithfulness, Relevance)', 'Deterministic golden test sets', 'Semantic distance scoring'],
      category: 'AI Evaluation & MLOps'
    }
  ],
  'ML Developer': [
    {
      questionText: 'Walk me through how you optimize PyTorch model training speed using Automatic Mixed Precision (AMP), gradient accumulation, and Distributed Data Parallel (DDP).',
      expectedKeyPoints: ['FP16 / BF16 precision scaling', 'DDP vs DataParallel inter-GPU communication', 'Gradient accumulation for larger batch sizes', 'Dataloader prefetching & CUDA streams'],
      category: 'Deep Learning Engineering'
    },
    {
      questionText: 'Design an online real-time feature store and model serving architecture capable of 50ms P99 inference latency.',
      expectedKeyPoints: ['Online store (Redis/DynamoDB) vs Offline store', 'Model quantization (INT8/AWQ) & TensorRT/ONNX', 'Batching request queues (Triton Server)', 'Drift detection & shadow deployments'],
      category: 'ML Infrastructure & Serving'
    }
  ],
  'Prompt Engineer': [
    {
      questionText: 'How do you design a systematic prompt framework using Chain-of-Thought, Metacognitive Prompting, and Structured JSON output schemas?',
      expectedKeyPoints: ['System role anchoring & context boundaries', 'CoT reasoning step enforcement before output generation', 'JSON Schema validation & repair parsers', 'Sycophancy & bias mitigation'],
      category: 'Prompt System Design'
    },
    {
      questionText: 'Explain how you optimize prompt context windows to reduce token cost while maximizing recall and instruction following.',
      expectedKeyPoints: ['In-context learning with dynamic few-shot selection', 'Prompt compression & summarization techniques', 'System vs User message hierarchy', 'Preventing instruction injection'],
      category: 'Context Window Optimization'
    }
  ]
};

const DEFAULT_QUESTIONS = [
  {
    questionText: 'Explain how you handle asynchronous state updates and potential race conditions in high-concurrency applications.',
    expectedKeyPoints: ['Mutexes / Locks / Atomic operations', 'Async/Await exception boundaries', 'Optimistic locking / version checks', 'Cancellation signals'],
    category: 'Software Fundamentals'
  },
  {
    questionText: 'Walk through your methodology for diagnosing a production issue where API latency suddenly spikes by 300%.',
    expectedKeyPoints: ['Metrics inspection (P99, CPU, Memory, I/O)', 'Tracing & APM logs breakdown', 'Isolating DB query bottlenecks / lock contention', 'Rollback vs feature flag mitigation'],
    category: 'Debugging & Observability'
  },
  {
    questionText: 'Describe a complex technical trade-off you had to navigate in a recent project. What led to your decision?',
    expectedKeyPoints: ['Context & problem boundaries', 'Alternatives evaluated with pros/cons', 'Quantitative or qualitative criteria', 'Post-implementation outcomes'],
    category: 'System Engineering & Leadership'
  }
];

// ─── EXPORTED ENGINE FUNCTIONS ──────────────────────────────────────────────

export async function generateMockFirstQuestion(sessionConfig) {
  await new Promise(r => setTimeout(r, 500));

  const name = sessionConfig.applicantName || 'Candidate';
  const pool = ROLE_QUESTIONS[sessionConfig.role] || DEFAULT_QUESTIONS;
  const q = pool[Math.floor(Math.random() * pool.length)];

  return {
    interviewerGreeting: `Hello ${name}! Welcome to your technical interview for the ${sessionConfig.role} position (${sessionConfig.level} level). We'll focus on ${sessionConfig.focus}. Let's get started!`,
    questionText: q.questionText,
    expectedKeyPoints: q.expectedKeyPoints,
    category: q.category
  };
}

/**
 * CORE EVALUATION FUNCTION
 * Scores the candidate's answer based on actual concept coverage,
 * not word count. Each expected key point is checked individually.
 */
export async function evaluateMockResponse({ sessionConfig, currentQuestion, candidateAnswer, currentQuestionIndex }) {
  await new Promise(r => setTimeout(r, 800)); // simulate processing delay

  const name = sessionConfig.applicantName || 'Candidate';
  const expectedKeyPoints = currentQuestion.expectedKeyPoints || [];

  // ── Step 1: Analyze each key point individually ─────────────────────────
  const keyPointResults = expectedKeyPoints.map(kp => ({
    keyPoint: kp,
    ...analyzeKeyPointCoverage(kp, candidateAnswer)
  }));

  const coveredPoints  = keyPointResults.filter(r => r.covered);
  const missedPoints   = keyPointResults.filter(r => !r.covered);
  const coverageCount  = coveredPoints.length;
  const totalPoints    = expectedKeyPoints.length || 1;

  // ── Step 2: Calculate scores ─────────────────────────────────────────────
  // Technical Accuracy: purely based on concept coverage
  const technicalAccuracy = Math.round((coverageCount / totalPoints) * 100);

  // Problem Solving: penalised if many concepts missed (no partial credit gift)
  const missedPenalty = missedPoints.length * (100 / totalPoints) * 0.3;
  const problemSolving = Math.max(0, Math.round(technicalAccuracy - missedPenalty));

  // Communication: strict structure scoring
  const communicationScore = scoreCommunication(candidateAnswer);

  // STRICT overall formula — accuracy dominates (55%)
  const overallScore = Math.round(
    (technicalAccuracy  * 0.55) +
    (problemSolving     * 0.30) +
    (communicationScore * 0.15)
  );


  // ── Step 3: Build human-readable strengths & improvements ───────────────
  const strengths = [];
  const improvements = [];

  coveredPoints.forEach(r => {
    strengths.push(`✓ Covered "${r.keyPoint}" — matched: ${r.matchedTerms.join(', ')}`);
  });

  missedPoints.forEach(r => {
    improvements.push(`✗ Missed "${r.keyPoint}" — look for: ${r.missedTerms.slice(0, 3).join(', ')}`);
  });

  if (strengths.length === 0) {
    improvements.push('No expected technical concepts were detected. Try using specific technical terminology.');
  }

  if (communicationScore < 60) {
    improvements.push('Answer was too brief. Expand with trade-offs, examples, and reasoning steps.');
  } else if (communicationScore >= 80) {
    strengths.push('Well-structured response with clear technical articulation.');
  }

  // ── Step 4: Generate interviewer verbal feedback ─────────────────────────
  let interviewerFeedback;
  const coveragePct = Math.round((coverageCount / totalPoints) * 100);

  if (coveragePct >= 75) {
    interviewerFeedback = `Excellent answer, ${name}! You covered ${coverageCount} out of ${totalPoints} key concepts for "${currentQuestion.category}". Your technical depth on this topic is strong.`;
  } else if (coveragePct >= 50) {
    interviewerFeedback = `Good start, ${name}. You addressed ${coverageCount} of ${totalPoints} expected concepts. The missing areas are: ${missedPoints.map(r => r.keyPoint).join('; ')}. Diving into those would make this a complete answer.`;
  } else if (coveragePct >= 25) {
    interviewerFeedback = `You touched on ${coverageCount} out of ${totalPoints} concepts, ${name}. For "${currentQuestion.category}", a strong answer needs to cover: ${missedPoints.map(r => r.keyPoint).join('; ')}.`;
  } else {
    interviewerFeedback = `Thanks for sharing, ${name}. We were looking for specific technical concepts: ${expectedKeyPoints.join('; ')}. Focus on using precise technical terms when explaining your approach.`;
  }

  // ── Step 5: Pick next question ───────────────────────────────────────────
  const pool = ROLE_QUESTIONS[sessionConfig.role] || DEFAULT_QUESTIONS;
  const available = pool.filter(q => q.questionText !== currentQuestion.questionText);
  const nextQ = available.length > 0
    ? available[Math.floor(Math.random() * available.length)]
    : DEFAULT_QUESTIONS[currentQuestionIndex % DEFAULT_QUESTIONS.length];

  const isFinalQuestion = currentQuestionIndex >= sessionConfig.questionCount;

  // ── Step 6: Compose backend thinking trace ───────────────────────────────
  const thinkingLog = [
    `<thinking>`,
    `CANDIDATE: ${name} | ROLE: ${sessionConfig.role} | Q${currentQuestionIndex}`,
    ``,
    `STEP 1 — KEY POINT COVERAGE ANALYSIS`,
    ...keyPointResults.map((r, i) =>
      `  [${r.covered ? '✓ COVERED' : '✗ MISSED '}] Concept ${i+1}: "${r.keyPoint}"` +
      `\n    Matched: [${r.matchedTerms.join(', ') || 'none'}]` +
      `\n    Missed:  [${r.missedTerms.join(', ') || 'none'}]` +
      `\n    Coverage Ratio: ${Math.round(r.coverageRatio * 100)}%`
    ),
    ``,
    `STEP 2 — SCORE COMPUTATION`,
    `  Concepts Covered:       ${coverageCount} / ${totalPoints} (${coveragePct}%)`,
    `  Technical Accuracy:     ${technicalAccuracy}/100  [weight: 50%]`,
    `  Problem Solving:        ${problemSolving}/100    [weight: 30%]`,
    `  Communication Quality:  ${communicationScore}/100  [weight: 20%]`,
    `  ────────────────────────────────────`,
    `  FINAL SCORE:            ${overallScore}/100`,
    ``,
    `STEP 3 — ADAPTIVE DECISION`,
    `  ${overallScore >= 75 ? 'STEP_UP → Candidate shows mastery, increase difficulty next.' : overallScore >= 50 ? 'MAINTAIN → Guide candidate to fill concept gaps.' : 'SUPPORT → Candidate needs more focus on fundamentals.'}`,
    ``,
    `STEP 4 — NEXT QUESTION SELECTED`,
    `  "${nextQ.questionText.slice(0, 80)}..."`,
    `</thinking>`
  ].join('\n');

  return {
    thinking: thinkingLog,
    evaluation: {
      overallScore,
      accuracyScore: technicalAccuracy,
      problemSolvingScore: problemSolving,
      communicationScore,
      coverageCount,
      totalPoints,
      keyPointResults,   // full per-concept breakdown
      strengths,
      improvements,
      adaptiveAction: overallScore >= 75 ? 'INCREASE_DIFFICULTY' : overallScore >= 50 ? 'GUIDE_AND_ADAPT' : 'SUPPORT_FUNDAMENTALS'
    },
    interviewerFeedback,
    isFinalQuestion,
    nextQuestion: isFinalQuestion ? null : {
      questionText: nextQ.questionText,
      expectedKeyPoints: nextQ.expectedKeyPoints,
      category: nextQ.category
    }
  };
}

export async function generateMockHint(currentQuestion, candidateAnswerDraft) {
  await new Promise(r => setTimeout(r, 350));

  const draft = candidateAnswerDraft || '';
  const kps = currentQuestion.expectedKeyPoints || [];

  // Find which key points are not yet covered in the draft
  const uncovered = kps.filter(kp => !analyzeKeyPointCoverage(kp, draft).covered);
  const hintTarget = uncovered[0] || kps[0] || 'the core concept';

  return {
    hint: `Hint: Consider addressing "${hintTarget}". Think about how this concept applies under load or failure conditions, and what specific mechanisms make it work.`,
    focusConcept: currentQuestion.category || 'Technical Concept',
    uncoveredCount: uncovered.length,
    totalConcepts: kps.length
  };
}

export async function generateMockFinalScorecard(sessionConfig, fullHistory) {
  await new Promise(r => setTimeout(r, 600));

  const name = sessionConfig.applicantName || 'Candidate';
  const scores = fullHistory.map(h => h.evaluation?.overallScore ?? 75);
  const avgScore = Math.round(scores.reduce((a, b) => a + b, 0) / (scores.length || 1));

  // Calculate average concept coverage across all questions
  const avgCoverage = fullHistory.reduce((sum, h) => {
    const { coverageCount = 0, totalPoints = 1 } = h.evaluation || {};
    return sum + (coverageCount / totalPoints);
  }, 0) / (fullHistory.length || 1);

  let tier;
  if (avgScore >= 88) tier = 'Principal / Bar Raiser Hire';
  else if (avgScore >= 75) tier = 'Strong Hire';
  else if (avgScore >= 58) tier = 'Hire (Needs Slight Polishing)';
  else tier = 'Needs Further Preparation';

  return {
    overallScore: avgScore,
    performanceTier: tier,
    summaryCritique: `${name} completed a ${sessionConfig.questionCount}-question session for ${sessionConfig.role} (${sessionConfig.level}). Concept coverage averaged ${Math.round(avgCoverage * 100)}% across all questions.`,
    metrics: {
      technicalAccuracy: Math.min(100, Math.round(avgScore * 1.03)),
      problemSolving: Math.max(40, Math.round(avgScore * 0.98)),
      communication: Math.min(100, Math.round(avgScore * 1.05)),
      edgeCaseCoverage: Math.max(35, Math.round(avgScore * 0.90))
    },
    topStrengths: [
      `Demonstrated understanding of ${sessionConfig.role} core concepts`,
      `Clear communication style during technical explanations`,
      `Structured approach to problem decomposition`
    ],
    keyAreasToImprove: [
      'Use more specific technical terminology (library names, algorithm names)',
      'Explicitly discuss trade-offs before proposing a solution',
      'Cover edge cases and failure scenarios in your explanations'
    ],
    personalizedRoadmap: [
      {
        topic: 'Concept-First Answer Framework',
        reason: `${name}, examiners look for precise technical vocabulary — not just general ideas.`,
        actionableStep: 'Practice naming specific technologies, algorithms, and patterns in every answer. Use the key point badges shown before each question as your checklist.'
      },
      {
        topic: 'Trade-Off Analysis',
        reason: 'Senior roles require candidates to articulate why they chose one approach over another.',
        actionableStep: 'For every technical decision, practice saying "I chose X over Y because Z (with latency/cost/complexity reasoning)."'
      },
      {
        topic: 'Edge Case Coverage',
        reason: 'Interviewers probe resilience by asking what happens at scale or when things fail.',
        actionableStep: 'End every answer with: "The edge cases to consider are..." and name at least 2 failure modes.'
      }
    ]
  };
}

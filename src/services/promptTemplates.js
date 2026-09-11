/**
 * Prompt Engineering Suite for AI Interview Preparation Assistant
 * Includes System Persona prompts, Chain-of-Thought guides, Few-Shot examples,
 * JSON schemas, and Hint generation prompts.
 */

export const INTERVIEWER_PERSONAS = {
  mentor: {
    name: "Empathetic Mentor",
    tagline: "Supportive, encouraging, focuses on learning and guidance",
    style: "Friendly, constructive, highlights positive insights before pointing out improvements."
  },
  techLead: {
    name: "Rigorous Tech Lead",
    tagline: "Direct, realistic, challenges edge cases & production trade-offs",
    style: "Professional, analytical, probes into system limits and code efficiency."
  },
  barRaiser: {
    name: "FAANG Bar Raiser",
    tagline: "High-standard, tests depth, architecture, and extreme scale",
    style: "Challenging, deeply technical, demands clean trade-off analysis and scalability."
  }
};

export function buildSystemPrompt(sessionConfig) {
  const persona = INTERVIEWER_PERSONAS[sessionConfig.persona] || INTERVIEWER_PERSONAS.techLead;
  const name = sessionConfig.applicantName || 'Candidate';
  
  return `YOU ARE: A world-class Senior Technical Interviewer acting as a ${persona.name}.
CANDIDATE NAME: ${name}
TARGET ROLE: ${sessionConfig.role}
EXPERIENCE LEVEL: ${sessionConfig.level}
INTERVIEW TYPE / FOCUS: ${sessionConfig.focus}
TOTAL SESSION QUESTIONS: ${sessionConfig.questionCount}

INTERVIEWER STYLE & BEHAVIOR:
- Style: ${persona.style}
- Address the candidate by their name (${name}) naturally in greetings and feedback.
- You must simulate a real, immersive technical interview session.
- Generate DISTINCT, CREATIVE, and VARIED questions tailored to the specified role (${sessionConfig.role}) and focus (${sessionConfig.focus}).
- Do NOT repeat standard generic questions; change questions dynamically for every new candidate and session.
- Assess both technical depth and communication clarity.

PROMPT ENGINEERING RULES APPLIED:
1. Role & Persona Anchoring: Maintain character consistently.
2. Structured JSON Output: All responses must return valid JSON strictly adhering to requested schemas.
3. Chain-of-Thought (CoT): Step-by-step reasoning before scoring.
4. Adaptive Evaluation: If the candidate performs well, increase technical depth. If struggling, offer constructive guidance.
5. Score Calibration:
   - 90-100: Flawless answer + trade-offs + performance + edge cases.
   - 75-89: Correct core logic + clear communication, slight missed detail.
   - 50-74: Surface-level answer, missing key mechanics.
   - Below 50: Incorrect concept or major misconceptions.`;
}

export function buildFirstQuestionPrompt(sessionConfig) {
  const name = sessionConfig.applicantName || 'Candidate';
  return `Generate a UNIQUE, FRESH FIRST interview question for ${name} with the following profile:
- Candidate Name: ${name}
- Target Role: ${sessionConfig.role}
- Experience Level: ${sessionConfig.level}
- Interview Type / Focus: ${sessionConfig.focus}

REQUIREMENTS:
- Return ONLY a valid JSON object.
- Include a clear, realistic opening greeting addressing ${name} by name in 'interviewerGreeting'.
- Provide a challenging, non-generic question statement tailored to ${sessionConfig.role} and focus on ${sessionConfig.focus} in 'questionText'.
- Provide 2-3 key technical topics/concepts that a strong answer should cover in 'expectedKeyPoints'.

JSON FORMAT:
{
  "interviewerGreeting": "Hello ${name}! Welcome to your technical interview for the ${sessionConfig.role} position...",
  "questionText": "To start off, let's look at...",
  "expectedKeyPoints": ["Topic A", "Topic B", "Topic C"],
  "category": "Core Architecture / Domain Practice"
}`;
}

export function buildEvaluationPrompt({ sessionConfig, currentQuestion, candidateAnswer, questionHistory, currentQuestionIndex }) {
  const isFinalQuestion = currentQuestionIndex >= sessionConfig.questionCount;

  return `Evaluate the candidate's response to Question ${currentQuestionIndex} of ${sessionConfig.questionCount}.

QUESTION ASKED:
"${currentQuestion.questionText}"

EXPECTED KEY POINTS:
${JSON.stringify(currentQuestion.expectedKeyPoints)}

CANDIDATE'S ANSWER:
"${candidateAnswer}"

PREVIOUS CONVERSATION CONTEXT:
${JSON.stringify(questionHistory.slice(-3))}

EVALUATION INSTRUCTIONS (Follow Chain-of-Thought):
1. Evaluate Technical Accuracy (0-100), Problem Solving (0-100), and Communication (0-100).
2. Identify specific strengths in the candidate's answer.
3. Identify missing edge cases, trade-offs, or inaccuracies.
4. Formulate immediate interviewer feedback (constructive, conversational).
${isFinalQuestion ? '5. This is the LAST question. Prepare to wrap up the interview gracefully.' : '5. Generate the NEXT question (Question ' + (currentQuestionIndex + 1) + '), adapting difficulty based on current performance.'}

MUST RETURN ONLY A VALID JSON OBJECT MATCHING THIS SCHEMA:
{
  "thinking": "Step 1: Accuracy analysis... Step 2: Edge cases check... Step 3: Score calculation...",
  "evaluation": {
    "overallScore": 85,
    "accuracyScore": 90,
    "problemSolvingScore": 85,
    "communicationScore": 80,
    "strengths": ["Clear explanation of concept", "Used relevant examples"],
    "improvements": ["Missed edge case regarding memory limits"],
    "adaptiveAction": "INCREASE_DIFFICULTY"
  },
  "interviewerFeedback": "Great explanation! You covered the core mechanism well...",
  "isFinalQuestion": ${isFinalQuestion},
  "nextQuestion": ${isFinalQuestion ? 'null' : `{
    "questionText": "Now, let's step up the depth...",
    "expectedKeyPoints": ["Key Point 1", "Key Point 2"],
    "category": "Advanced Systems / Optimization"
  }`}
}`;
}

export function buildHintPrompt(currentQuestion, candidateAnswerDraft) {
  return `The candidate is asking for a subtle HINT for the following interview question:
Question: "${currentQuestion.questionText}"
Expected Key Points: ${JSON.stringify(currentQuestion.expectedKeyPoints)}
Candidate's Current Progress: "${candidateAnswerDraft || 'Not started yet'}"

RULES FOR HINT:
- Do NOT give away the direct answer or full solution.
- Provide a thought-provoking clue, leading question, or conceptual nudge.
- Keep it under 3 sentences.

RETURN ONLY VALID JSON:
{
  "hint": "Think about how data flows when multiple requests arrive simultaneously...",
  "focusConcept": "Concurrency Control"
}`;
}

export function buildFinalScorecardPrompt(sessionConfig, fullHistory) {
  return `Generate a comprehensive Final Interview Performance Report / Scorecard for this session.

CANDIDATE PROFILE:
- Role: ${sessionConfig.role} (${sessionConfig.level})
- Interview Focus: ${sessionConfig.focus}
- Persona: ${sessionConfig.persona}

FULL INTERVIEW HISTORY:
${JSON.stringify(fullHistory, null, 2)}

INSTRUCTIONS:
Calculate overall weighted score, detailed criteria breakdown, summary report, strengths, areas for growth, and a personalized learning roadmap.

RETURN ONLY A VALID JSON OBJECT:
{
  "overallScore": 84,
  "performanceTier": "Strong Hire",
  "summaryCritique": "Demonstrated strong grasp of core fundamentals and system design. Communication was structured and concise.",
  "metrics": {
    "technicalAccuracy": 86,
    "problemSolving": 82,
    "communication": 88,
    "edgeCaseCoverage": 78
  },
  "topStrengths": [
    "Solid understanding of async processing patterns",
    "Structured problem-solving approach using clear trade-offs"
  ],
  "keyAreasToImprove": [
    "Deepen knowledge on database index optimization under high write load",
    "Always state time/space complexity explicitly before coding"
  ],
  "personalizedRoadmap": [
    {
      "topic": "Distributed Consensus & Locks",
      "reason": "You hesitated on race condition mitigation strategies during question 2.",
      "actionableStep": "Review Raft protocol and Redis distributed lock (Redlock) implementation."
    },
    {
      "topic": "Memory & Cache Eviction",
      "reason": "Missed discussing LRU vs LFU trade-offs.",
      "actionableStep": "Implement an LRU Cache from scratch in your preferred language."
    }
  ]
}`;
}

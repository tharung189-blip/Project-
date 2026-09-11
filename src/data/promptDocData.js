export const PROMPT_ENGINEERING_TECHNIQUES = [
  {
    id: "role-persona",
    title: "1. Role & Persona Prompting",
    tag: "Context Isolation",
    icon: "UserCheck",
    summary: "Establishes a precise persona boundary (e.g. Empathetic Mentor vs. Strict FAANG Bar Raiser) ensuring the LLM maintains strict conversational context and tone throughout the session.",
    details: "By anchoring the LLM's identity in the System Instruction with clear behavior guidelines, standard responses are prevented from breaking character. The prompt explicitly specifies tone, brevity rules, evaluation strictness, and feedback timing.",
    examplePrompt: `SYSTEM INSTRUCTION: You are a Senior Principal Engineer and Technical Interviewer at a top-tier tech company. 
Target Role: {targetRole} ({experienceLevel}). Persona: {personaName}.
Rules:
- Never break character.
- Keep questions focused and concise.
- Adapt question depth based on candidate performance.
- Evaluate responses systematically.`
  },
  {
    id: "chain-of-thought",
    title: "2. Chain-of-Thought (CoT) Reasoning",
    tag: "Reasoning Step",
    icon: "Brain",
    summary: "Forces the LLM to write out its explicit analysis step-by-step (Evaluating Accuracy -> Identifying Edge Cases -> Scoring -> Formatting Output) prior to generating final output.",
    details: "LLMs perform significantly better at complex evaluations when given a workspace to 'think'. We mandate a structured CoT XML block (<thinking>...</thinking>) in the prompt before generating the final JSON response.",
    examplePrompt: `Before returning your JSON evaluation:
1. FIRST analyze the candidate's answer for technical correctness.
2. List 2 key strengths and 2 missing edge cases or trade-offs.
3. Compute scores (0-100) for Technical Accuracy, Problem Solving, and Communication.
4. Decide if difficulty should step UP, stay SAME, or step DOWN.
5. THEN synthesize the output matching the requested JSON format.`
  },
  {
    id: "structured-json",
    title: "3. Structured JSON Schema Enforcement",
    tag: "Output Reliability",
    icon: "Code2",
    summary: "Enforces strict JSON schema format output from the LLM, making AI responses 100% programmatically parseable for real-time UI updates, score visualizers, and state transitions.",
    details: "Instead of unformatted markdown text, prompts enforce JSON structure containing numerical scores, critique bullet points, adaptive difficulty decisions, and follow-up question texts.",
    examplePrompt: `{
  "evaluation": {
    "score": 85,
    "accuracyScore": 90,
    "communicationScore": 80,
    "strengths": ["Clear explanation of time complexity", "Mentioned spatial overhead"],
    "improvements": ["Did not address thread safety under high concurrency"],
    "adaptiveAction": "INCREASE_DIFFICULTY"
  },
  "interviewerResponse": "Solid breakdown on Big-O! Let's build on that...",
  "nextQuestion": "How would you handle race conditions if multiple workers execute this simultaneously?"
}`
  },
  {
    id: "few-shot",
    title: "4. Dynamic Few-Shot Exemplars",
    tag: "In-Context Learning",
    icon: "Sparkles",
    summary: "Injects domain-specific gold-standard Q&A pairs and ideal evaluation samples directly into the context window based on the candidate's selected role.",
    details: "Demonstrating 1-2 examples of high-quality interview feedback and follow-ups dramatically grounds the LLM, avoiding generic answers and maintaining industry-standard technical depth.",
    examplePrompt: `Example Evaluation:
Input Question: "Explain event loop in Node.js"
Candidate Answer: "It runs single threaded using an event queue."
Good Evaluation Output:
- Strengths: Identified single-threaded core.
- Missing: Microtask queue vs Macrotask queue (Promises vs setTimeout), libuv thread pool for I/O.`
  },
  {
    id: "metacognitive-correction",
    title: "5. Metacognitive Self-Correction & Bias Anchoring",
    tag: "Evaluation Guardrails",
    icon: "ShieldCheck",
    summary: "Prevents LLM feedback drift, sycophancy (overly flattering feedback), or harsh bias by anchoring score rubrics with explicit evaluation guidelines.",
    details: "LLMs can tend to give 100% scores for brief correct answers. Our prompt defines explicit score bands (e.g. 90-100 requires covering trade-offs and edge cases; 60-75 indicates high-level answer missing core mechanics).",
    examplePrompt: `SCORING RUBRIC:
- 90-100: Complete answer + trade-offs + performance implications + edge cases.
- 75-89: Correct core logic + clear communication + minor missed optimization.
- 50-74: High-level overview only, missed fundamental technical details.
- Below 50: Incorrect concept or blank response.`
  }
];

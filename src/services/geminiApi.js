/**
 * Gemini API Integration for AI Interview Assistant
 * API Key is loaded from environment variable VITE_GEMINI_API_KEY (.env file).
 * Never exposed in the frontend UI — completely hidden from users.
 * Seamlessly falls back to mockInterviewEngine if no key is configured.
 */

import {
  buildSystemPrompt,
  buildFirstQuestionPrompt,
  buildEvaluationPrompt,
  buildHintPrompt,
  buildFinalScorecardPrompt
} from './promptTemplates';

import {
  generateMockFirstQuestion,
  evaluateMockResponse,
  generateMockHint,
  generateMockFinalScorecard
} from './mockInterviewEngine';

// API key loaded from .env file — never visible in the UI
const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY || '';

function hasApiKey() {
  return GEMINI_API_KEY && GEMINI_API_KEY !== 'your_gemini_api_key_here';
}

export async function fetchFirstQuestion({ sessionConfig }) {
  if (!hasApiKey()) {
    return generateMockFirstQuestion(sessionConfig);
  }

  try {
    const systemInstruction = buildSystemPrompt(sessionConfig);
    const userPrompt = buildFirstQuestionPrompt(sessionConfig);
    return await callGeminiApi({ systemInstruction, userPrompt });
  } catch (error) {
    console.warn("Gemini API call failed, using intelligent mock fallback:", error);
    return generateMockFirstQuestion(sessionConfig);
  }
}

export async function evaluateResponse({ sessionConfig, currentQuestion, candidateAnswer, questionHistory, currentQuestionIndex }) {
  if (!hasApiKey()) {
    return evaluateMockResponse({ sessionConfig, currentQuestion, candidateAnswer, currentQuestionIndex });
  }

  try {
    const systemInstruction = buildSystemPrompt(sessionConfig);
    const userPrompt = buildEvaluationPrompt({ sessionConfig, currentQuestion, candidateAnswer, questionHistory, currentQuestionIndex });
    return await callGeminiApi({ systemInstruction, userPrompt });
  } catch (error) {
    console.warn("Gemini API call failed, using intelligent mock fallback:", error);
    return evaluateMockResponse({ sessionConfig, currentQuestion, candidateAnswer, currentQuestionIndex });
  }
}

export async function fetchHint({ currentQuestion, candidateAnswerDraft }) {
  if (!hasApiKey()) {
    return generateMockHint(currentQuestion, candidateAnswerDraft);
  }

  try {
    const userPrompt = buildHintPrompt(currentQuestion, candidateAnswerDraft);
    return await callGeminiApi({
      systemInstruction: "You are an AI interviewer giving a subtle, non-spoiling hint. Return JSON.",
      userPrompt
    });
  } catch (error) {
    return generateMockHint(currentQuestion, candidateAnswerDraft);
  }
}

export async function generateFinalScorecard({ sessionConfig, fullHistory }) {
  if (!hasApiKey()) {
    return generateMockFinalScorecard(sessionConfig, fullHistory);
  }

  try {
    const userPrompt = buildFinalScorecardPrompt(sessionConfig, fullHistory);
    return await callGeminiApi({
      systemInstruction: "You are a Chief Technical Interviewer evaluating a completed interview session. Return structured JSON.",
      userPrompt
    });
  } catch (error) {
    return generateMockFinalScorecard(sessionConfig, fullHistory);
  }
}

async function callGeminiApi({ systemInstruction, userPrompt, model = "gemini-2.5-flash" }) {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${GEMINI_API_KEY}`;

  const payload = {
    contents: [
      {
        role: "user",
        parts: [{ text: userPrompt }]
      }
    ],
    systemInstruction: {
      parts: [{ text: systemInstruction }]
    },
    generationConfig: {
      temperature: 0.7,
      responseMimeType: "application/json"
    }
  };

  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`Gemini API Error (${response.status}): ${errText}`);
  }

  const json = await response.json();
  const textOutput = json.candidates?.[0]?.content?.parts?.[0]?.text;

  if (!textOutput) {
    throw new Error("Empty response from Gemini API");
  }

  try {
    return JSON.parse(textOutput);
  } catch (e) {
    const cleaned = textOutput.replace(/```json/g, '').replace(/```/g, '').trim();
    return JSON.parse(cleaned);
  }
}

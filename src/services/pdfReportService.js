/**
 * PDF Report Generator — AI Interview Assistant
 * Generates a formatted, downloadable PDF report using jsPDF.
 * Includes: Header, Score Ring, Per-Question Breakdown, Concept Coverage, Study Roadmap
 */
import { jsPDF } from 'jspdf';

// ─── Color Palette ──────────────────────────────────────────────────────────
const COLORS = {
  bg:         [10,  12,  30],   // dark navy
  primary:    [99,  102, 241],  // indigo
  emerald:    [16,  185, 129],  // green
  amber:      [245, 158, 11],   // yellow
  red:        [239, 68,  68],   // red
  white:      [255, 255, 255],
  textMuted:  [148, 163, 184],
  textDim:    [100, 116, 139],
  border:     [30,  35,  70],
  cardBg:     [15,  20,  50],
};

function setColor(doc, rgb, type = 'text') {
  if (type === 'fill')   doc.setFillColor(...rgb);
  else if (type === 'draw') doc.setDrawColor(...rgb);
  else doc.setTextColor(...rgb);
}

function drawRoundedBox(doc, x, y, w, h, r, fillColor, drawColor) {
  setColor(doc, fillColor, 'fill');
  if (drawColor) setColor(doc, drawColor, 'draw');
  doc.roundedRect(x, y, w, h, r, r, drawColor ? 'FD' : 'F');
}

function addSectionHeader(doc, text, y, pageWidth) {
  setColor(doc, COLORS.primary, 'fill');
  doc.setFillColor(...COLORS.primary);
  doc.rect(14, y, pageWidth - 28, 0.5, 'F');
  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  setColor(doc, COLORS.primary);
  doc.text(text.toUpperCase(), 14, y - 2);
  return y + 6;
}

function checkPageBreak(doc, y, needed = 30) {
  const pageHeight = doc.internal.pageSize.getHeight();
  if (y + needed > pageHeight - 15) {
    doc.addPage();
    // re-draw dark background on new page
    setColor(doc, COLORS.bg, 'fill');
    doc.rect(0, 0, doc.internal.pageSize.getWidth(), pageHeight, 'F');
    return 20;
  }
  return y;
}

// ─── MAIN EXPORT ────────────────────────────────────────────────────────────
export function generatePDFReport({ sessionConfig, report, fullHistory }) {
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
  const pageWidth  = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();

  // ── Dark background ───────────────────────────────────────────────────────
  setColor(doc, COLORS.bg, 'fill');
  doc.rect(0, 0, pageWidth, pageHeight, 'F');

  let y = 0;

  // ═══════════════════════════════════════════════════════════════════════════
  // HEADER BANNER
  // ═══════════════════════════════════════════════════════════════════════════
  // Gradient-ish header bar
  setColor(doc, [20, 24, 60], 'fill');
  doc.rect(0, 0, pageWidth, 52, 'F');

  // Brand badge
  setColor(doc, COLORS.primary, 'fill');
  doc.roundedRect(14, 8, 38, 7, 2, 2, 'F');
  doc.setFontSize(6);
  doc.setFont('helvetica', 'bold');
  setColor(doc, COLORS.white);
  doc.text('CYBERHIRE AI · NEURAL PLATFORM', 16, 13);

  // Title
  doc.setFontSize(18);
  doc.setFont('helvetica', 'bold');
  setColor(doc, COLORS.white);
  const title = sessionConfig.applicantName
    ? `${sessionConfig.applicantName}'s CyberHire Report`
    : 'CyberHire AI Performance Report';
  doc.text(title, 14, 28);

  // Subtitle
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  setColor(doc, COLORS.textMuted);
  doc.text(`${sessionConfig.role} · ${sessionConfig.level} · ${sessionConfig.focus}`, 14, 35);

  // Date
  const now = new Date().toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' });
  doc.text(`Generated: ${now}`, 14, 41);

  y = 60;

  // ═══════════════════════════════════════════════════════════════════════════
  // SCORE RING + TIER CARD
  // ═══════════════════════════════════════════════════════════════════════════
  const overallScore = report?.overallScore ?? 0;
  const tier = report?.performanceTier ?? 'N/A';

  // Score circle (left)
  const cx = 35, cy = y + 20;
  doc.setLineWidth(3);
  setColor(doc, COLORS.border, 'draw');
  doc.circle(cx, cy, 18, 'D');
  setColor(doc, COLORS.primary, 'draw');
  doc.circle(cx, cy, 18, 'D');

  // Score text inside circle
  doc.setFontSize(20);
  doc.setFont('helvetica', 'bold');
  setColor(doc, COLORS.white);
  doc.text(String(overallScore), cx, cy + 3, { align: 'center' });
  doc.setFontSize(6);
  setColor(doc, COLORS.textMuted);
  doc.text('/ 100', cx, cy + 8, { align: 'center' });

  // Tier & critique (right)
  const tierColor = overallScore >= 80 ? COLORS.emerald : overallScore >= 60 ? COLORS.amber : COLORS.red;
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  setColor(doc, tierColor);
  doc.text(tier, 65, y + 14);

  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  setColor(doc, COLORS.textMuted);
  const critique = report?.summaryCritique ?? '';
  const lines = doc.splitTextToSize(critique, pageWidth - 80);
  doc.text(lines, 65, y + 22);

  y += 48;

  // ═══════════════════════════════════════════════════════════════════════════
  // SCORE METRICS ROW
  // ═══════════════════════════════════════════════════════════════════════════
  y = addSectionHeader(doc, 'Performance Metrics', y, pageWidth);
  const metrics = report?.metrics ?? {};
  const metricCols = [
    { label: 'Technical Accuracy', val: metrics.technicalAccuracy ?? 0, color: COLORS.primary },
    { label: 'Problem Solving',    val: metrics.problemSolving    ?? 0, color: COLORS.emerald },
    { label: 'Communication',      val: metrics.communication     ?? 0, color: COLORS.amber },
    { label: 'Edge Case Coverage', val: metrics.edgeCaseCoverage  ?? 0, color: [253, 164, 175] },
  ];
  const colW = (pageWidth - 28) / 4;
  metricCols.forEach((m, i) => {
    const x = 14 + i * colW;
    drawRoundedBox(doc, x, y, colW - 3, 22, 2, COLORS.cardBg, COLORS.border);
    doc.setFontSize(7);
    setColor(doc, COLORS.textMuted);
    doc.text(m.label, x + (colW - 3) / 2, y + 7, { align: 'center' });
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    setColor(doc, m.color);
    doc.text(`${m.val}`, x + (colW - 3) / 2, y + 17, { align: 'center' });
  });
  y += 30;

  // ═══════════════════════════════════════════════════════════════════════════
  // QUESTION-BY-QUESTION BREAKDOWN
  // ═══════════════════════════════════════════════════════════════════════════
  y = addSectionHeader(doc, 'Question-by-Question Breakdown', y, pageWidth);

  fullHistory.forEach((item, idx) => {
    y = checkPageBreak(doc, y, 55);

    const qScore = item.evaluation?.overallScore ?? 0;
    const covered = item.evaluation?.coverageCount ?? 0;
    const total   = item.evaluation?.totalPoints  ?? 0;
    const scoreColor = qScore >= 75 ? COLORS.emerald : qScore >= 50 ? COLORS.amber : COLORS.red;

    // Question card
    drawRoundedBox(doc, 14, y, pageWidth - 28, 8, 2, [20, 25, 58], COLORS.border);

    // Q# badge
    setColor(doc, COLORS.primary, 'fill');
    doc.roundedRect(16, y + 1.5, 10, 5, 1, 1, 'F');
    doc.setFontSize(7);
    doc.setFont('helvetica', 'bold');
    setColor(doc, COLORS.white);
    doc.text(`Q${idx + 1}`, 21, y + 5.5, { align: 'center' });

    // Question text
    doc.setFontSize(8);
    doc.setFont('helvetica', 'bold');
    setColor(doc, COLORS.white);
    const qText = doc.splitTextToSize(item.question.questionText, pageWidth - 70);
    doc.text(qText[0], 30, y + 5.5); // first line only in header

    // Score badge
    setColor(doc, scoreColor, 'fill');
    doc.roundedRect(pageWidth - 38, y + 1.5, 22, 5, 1.5, 1.5, 'F');
    doc.setFontSize(7);
    doc.setFont('helvetica', 'bold');
    setColor(doc, COLORS.white);
    doc.text(`${qScore}/100`, pageWidth - 27, y + 5.5, { align: 'center' });

    y += 11;

    // Candidate's answer (truncated)
    const answerPreview = (item.candidateAnswer ?? '').slice(0, 300) + (item.candidateAnswer?.length > 300 ? '...' : '');
    doc.setFontSize(7);
    doc.setFont('helvetica', 'italic');
    setColor(doc, COLORS.textDim);
    const answerLines = doc.splitTextToSize(`Answer: ${answerPreview}`, pageWidth - 30);
    const maxLines = Math.min(answerLines.length, 3);
    doc.text(answerLines.slice(0, maxLines), 16, y);
    y += maxLines * 4 + 2;

    // Concept coverage pills
    const kpResults = item.evaluation?.keyPointResults ?? [];
    if (kpResults.length > 0) {
      doc.setFontSize(6.5);
      doc.setFont('helvetica', 'normal');
      kpResults.forEach(r => {
        y = checkPageBreak(doc, y, 8);
        const pillColor = r.covered ? COLORS.emerald : COLORS.red;
        const pillBg = r.covered ? [10, 40, 28] : [40, 12, 12];
        drawRoundedBox(doc, 16, y, pageWidth - 34, 5.5, 1.5, pillBg, pillColor);
        setColor(doc, pillColor);
        doc.text(r.covered ? '✓' : '✗', 19, y + 4);
        setColor(doc, r.covered ? [134, 239, 172] : [252, 165, 165]);
        const kpLabel = doc.splitTextToSize(r.keyPoint, pageWidth - 80);
        doc.text(kpLabel[0], 23, y + 4);
        // match %
        setColor(doc, COLORS.textDim);
        doc.text(`${Math.round(r.coverageRatio * 100)}% match`, pageWidth - 36, y + 4, { align: 'right' });
        y += 7;
      });
    }

    // Interviewer feedback
    y = checkPageBreak(doc, y, 12);
    doc.setFontSize(7);
    doc.setFont('helvetica', 'italic');
    setColor(doc, COLORS.textMuted);
    const fbLines = doc.splitTextToSize(`Feedback: "${item.interviewerFeedback}"`, pageWidth - 30);
    doc.text(fbLines.slice(0, 2), 16, y);
    y += fbLines.slice(0, 2).length * 4 + 6;
  });

  // ═══════════════════════════════════════════════════════════════════════════
  // STRENGTHS & IMPROVEMENTS
  // ═══════════════════════════════════════════════════════════════════════════
  y = checkPageBreak(doc, y, 50);
  y = addSectionHeader(doc, 'Key Strengths & Growth Areas', y, pageWidth);

  const halfW = (pageWidth - 30) / 2;

  // Strengths box
  drawRoundedBox(doc, 14, y, halfW, 38, 3, [8, 30, 22], [16, 100, 70]);
  doc.setFontSize(8);
  doc.setFont('helvetica', 'bold');
  setColor(doc, COLORS.emerald);
  doc.text('Key Strengths', 17, y + 7);
  doc.setFontSize(7);
  doc.setFont('helvetica', 'normal');
  (report?.topStrengths ?? []).slice(0, 4).forEach((s, i) => {
    setColor(doc, [134, 239, 172]);
    doc.text('•', 17, y + 14 + i * 7);
    setColor(doc, [226, 232, 240]);
    const sLines = doc.splitTextToSize(s, halfW - 10);
    doc.text(sLines[0], 20, y + 14 + i * 7);
  });

  // Improvements box
  drawRoundedBox(doc, 16 + halfW, y, halfW, 38, 3, [30, 18, 8], [100, 60, 16]);
  doc.setFontSize(8);
  doc.setFont('helvetica', 'bold');
  setColor(doc, COLORS.amber);
  doc.text('Areas to Improve', 19 + halfW, y + 7);
  doc.setFontSize(7);
  doc.setFont('helvetica', 'normal');
  (report?.keyAreasToImprove ?? []).slice(0, 4).forEach((m, i) => {
    setColor(doc, [253, 224, 71]);
    doc.text('•', 19 + halfW, y + 14 + i * 7);
    setColor(doc, [226, 232, 240]);
    const mLines = doc.splitTextToSize(m, halfW - 10);
    doc.text(mLines[0], 23 + halfW, y + 14 + i * 7);
  });

  y += 46;

  // ═══════════════════════════════════════════════════════════════════════════
  // STUDY ROADMAP
  // ═══════════════════════════════════════════════════════════════════════════
  y = checkPageBreak(doc, y, 40);
  y = addSectionHeader(doc, 'Personalised Study Roadmap', y, pageWidth);

  (report?.personalizedRoadmap ?? []).forEach((item, i) => {
    y = checkPageBreak(doc, y, 30);
    drawRoundedBox(doc, 14, y, pageWidth - 28, 26, 3, COLORS.cardBg, COLORS.border);

    // Step number
    setColor(doc, COLORS.primary, 'fill');
    doc.circle(22, y + 9, 5, 'F');
    doc.setFontSize(8);
    doc.setFont('helvetica', 'bold');
    setColor(doc, COLORS.white);
    doc.text(String(i + 1), 22, y + 11.5, { align: 'center' });

    // Topic
    doc.setFontSize(9);
    doc.setFont('helvetica', 'bold');
    setColor(doc, [165, 180, 252]);
    doc.text(item.topic, 31, y + 8);

    // Reason
    doc.setFontSize(7);
    doc.setFont('helvetica', 'normal');
    setColor(doc, COLORS.textMuted);
    const rLines = doc.splitTextToSize(item.reason, pageWidth - 50);
    doc.text(rLines[0], 31, y + 14);

    // Actionable step
    setColor(doc, COLORS.primary, 'fill');
    doc.roundedRect(31, y + 18, pageWidth - 46, 5, 1, 1, 'F');
    doc.setFontSize(6.5);
    doc.setFont('helvetica', 'bold');
    setColor(doc, COLORS.white);
    const aLines = doc.splitTextToSize(`→ ${item.actionableStep}`, pageWidth - 50);
    doc.text(aLines[0], 33, y + 21.5);

    y += 31;
  });

  // ═══════════════════════════════════════════════════════════════════════════
  // FOOTER on every page
  // ═══════════════════════════════════════════════════════════════════════════
  const totalPages = doc.internal.getNumberOfPages();
  for (let p = 1; p <= totalPages; p++) {
    doc.setPage(p);
    // dark footer bar
    setColor(doc, [8, 10, 25], 'fill');
    doc.rect(0, pageHeight - 12, pageWidth, 12, 'F');
    doc.setFontSize(6.5);
    doc.setFont('helvetica', 'normal');
    setColor(doc, COLORS.textDim);
    doc.text('CyberHire AI · Neural AI Technical Interview Platform', 14, pageHeight - 5);
    doc.text(`Page ${p} of ${totalPages}`, pageWidth - 14, pageHeight - 5, { align: 'right' });
  }

  // ── Save file ──────────────────────────────────────────────────────────────
  const safeName = (sessionConfig.applicantName || 'Candidate').replace(/\s+/g, '_');
  const safeRole = (sessionConfig.role || 'Role').replace(/\s+/g, '_');
  const dateStr  = new Date().toISOString().slice(0, 10);
  doc.save(`CyberHire_AI_Report_${safeName}_${safeRole}_${dateStr}.pdf`);
}


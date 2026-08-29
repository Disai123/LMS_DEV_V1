const normalizeAnswer = (text) => {
  if (!text) return '';
  return String(text).trim().toLowerCase().replace(/\s+/g, ' ');
};

const gradeShortAnswer = (studentText, correctOptions = []) => {
  const normalized = normalizeAnswer(studentText);
  if (!normalized) return false;
  return correctOptions
    .filter((opt) => opt.is_correct)
    .some((opt) => normalizeAnswer(opt.option_text) === normalized);
};

const buildShortAnswerOptions = (acceptedAnswers) => {
  const answers = Array.isArray(acceptedAnswers)
    ? acceptedAnswers
    : String(acceptedAnswers || '')
        .split(',')
        .map((a) => a.trim())
        .filter(Boolean);

  return answers.map((text) => ({
    option_text: text,
    is_correct: true
  }));
};

const buildTrueFalseOptions = (correctValue) => {
  const isTrue = correctValue === true || correctValue === 'true';
  return [
    { option_text: 'True', is_correct: isTrue },
    { option_text: 'False', is_correct: !isTrue }
  ];
};

module.exports = {
  normalizeAnswer,
  gradeShortAnswer,
  buildShortAnswerOptions,
  buildTrueFalseOptions
};

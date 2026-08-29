/**
 * Build a flat ordered list of course steps: Chapter 1, Quiz 1, Chapter 2, Quiz 2, ...
 */
export const buildCourseSteps = (chapters = []) => {
  const sorted = [...chapters]
    .filter((ch) => ch.type !== 'test')
    .sort((a, b) => (a.chapter_order || 0) - (b.chapter_order || 0))

  const steps = []

  sorted.forEach((chapter, index) => {
    const order = chapter.chapter_order || index + 1

    steps.push({
      key: `chapter-${chapter.id}`,
      type: 'chapter',
      chapterId: chapter.id,
      chapter,
      title: chapter.title,
      subtitle: getChapterSubtitle(chapter),
      stepNumber: steps.length + 1
    })

    if (chapter.test_id || chapter.test) {
      steps.push({
        key: `quiz-${chapter.id}`,
        type: 'quiz',
        chapterId: chapter.id,
        chapter,
        title: chapter.test?.title || `Chapter ${order} Quiz`,
        subtitle: 'Quiz',
        stepNumber: steps.length + 1
      })
    }
  })

  return steps
}

const getChapterSubtitle = (chapter) => {
  const hasVideo = chapter.video_url || chapter.video_embed_url || chapter.has_video
  const hasPDF = chapter.pdf_url || chapter.has_pdf
  if (hasVideo && hasPDF) return 'Video + PDF'
  if (hasVideo) return 'Video'
  if (hasPDF) return 'PDF'
  return 'Lesson'
}

export const getStepStatus = (step, progressionData, hasAdminAccess = false) => {
  if (!progressionData?.chapters) {
    return { isAccessible: true, isCompleted: false }
  }

  const chapterProgress = progressionData.chapters.find((ch) => ch.id === step.chapterId)
  if (!chapterProgress) {
    return { isAccessible: hasAdminAccess, isCompleted: false }
  }

  if (step.type === 'quiz') {
    const quizDone = (chapterProgress.quiz_attempts || 0) > 0
      && (chapterProgress.quiz_passed || chapterProgress.is_completed)
    return {
      isAccessible: hasAdminAccess || chapterProgress.quiz_unlocked || chapterProgress.quiz_passed || quizDone,
      isCompleted: quizDone,
      quizBestScore: chapterProgress.quiz_best_score
    }
  }

  return {
    isAccessible: hasAdminAccess || chapterProgress.is_accessible,
    isCompleted: chapterProgress.content_completed || chapterProgress.is_completed || false
  }
}

export default buildCourseSteps

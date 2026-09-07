import { useEffect, useState, useMemo } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import LoadingSpinner from '../components/LoadingSpinner'
import ErrorMessage from '../components/ErrorMessage'
import { courseApi } from '../utils/api'

export default function Course() {
  const { courseId } = useParams()
  const navigate = useNavigate()
  const [detail, setDetail] = useState(null)
  const [loadState, setLoadState] = useState('loading')

  function load() {
    setLoadState('loading')
    courseApi
      .get(courseId)
      .then((data) => {
        setDetail(data)
        setLoadState('ready')
      })
      .catch(() => setLoadState('error'))
  }

  useEffect(load, [courseId])

  const stats = useMemo(() => {
    if (!detail?.modules) return { totalLessons: 0, enrichedLessons: 0, percent: 0, firstUnfinished: null }
    let total = 0
    let enriched = 0
    let firstUnfinished = null

    detail.modules.forEach((m) => {
      m.lessons?.forEach((l) => {
        total++
        if (l.enriched || l.isEnriched) {
          enriched++
        } else if (!firstUnfinished) {
          firstUnfinished = l.id || l._id
        }
      })
    })

    const percent = total > 0 ? Math.round((enriched / total) * 100) : 0
    return { totalLessons: total, enrichedLessons: enriched, percent, firstUnfinished }
  }, [detail])

  if (loadState === 'loading') return <LoadingSpinner label="Loading course syllabus…" />
  if (loadState === 'error') {
    return (
      <div className="max-w-4xl mx-auto px-6 py-12">
        <ErrorMessage message="Couldn't load this course." onRetry={load} />
      </div>
    )
  }

  const { course, modules } = detail
  const firstLessonId = modules?.[0]?.lessons?.[0]?.id || modules?.[0]?.lessons?.[0]?._id

  return (
    <div className="max-w-4xl mx-auto px-4 md:px-8 py-8 md:py-12">
      <Link
        to="/"
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-moss-600 hover:text-moss-700 mb-6 focus-ring rounded"
      >
        <span>&larr;</span>
        <span>Back to all courses</span>
      </Link>

      {/* Course Hero Card */}
      <div className="rounded-2xl border border-ink-700/15 bg-white p-6 md:p-8 shadow-sm mb-8">
        <div className="flex flex-wrap items-center gap-2 mb-3">
          <span className="rounded-full bg-moss-500/10 text-moss-700 px-3 py-1 text-xs font-semibold">
            {modules.length} Modules
          </span>
          <span className="rounded-full bg-paper-100 text-ink-700 px-3 py-1 text-xs font-semibold">
            {stats.totalLessons} Lessons
          </span>
          {course.tags?.map((t) => (
            <span key={t} className="rounded-full bg-ink-900/5 text-ink-700/70 px-2.5 py-0.5 text-xs">
              #{t}
            </span>
          ))}
        </div>

        <h1 className="font-serif text-3xl md:text-4xl font-bold text-ink-950 mb-3 tracking-tight">
          {course.title}
        </h1>

        <p className="text-ink-700/80 text-sm md:text-base leading-relaxed mb-6 max-w-3xl">
          {course.description}
        </p>

        {/* Progress Bar */}
        <div className="rounded-xl bg-paper-50 border border-ink-700/10 p-4">
          <div className="flex items-center justify-between text-xs font-semibold text-ink-900 mb-2">
            <span>Course Completion Progress</span>
            <span className="text-moss-600 font-bold">{stats.percent}% ({stats.enrichedLessons}/{stats.totalLessons} Lessons)</span>
          </div>
          <div className="w-full h-2.5 rounded-full bg-paper-100 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-moss-500 to-emerald-500 transition-all duration-500 rounded-full"
              style={{ width: `${stats.percent}%` }}
            ></div>
          </div>
        </div>

        {firstLessonId && (
          <div className="mt-6 flex flex-wrap items-center gap-3">
            <button
              onClick={() => navigate(`/lesson/${stats.firstUnfinished || firstLessonId}`)}
              className="rounded-xl bg-moss-600 hover:bg-moss-700 text-white font-semibold px-6 py-3 text-sm shadow-md hover:shadow-lg transition-all focus-ring"
            >
              {stats.enrichedLessons === 0 ? 'Start Course Now' : 'Continue Learning →'}
            </button>
          </div>
        )}
      </div>

      {/* Modules Syllabus List */}
      <h2 className="font-serif text-2xl font-bold text-ink-950 mb-4">
        Course Syllabus
      </h2>

      <div className="flex flex-col gap-5">
        {modules.map((m, mi) => (
          <div
            key={m.module.id || m.module._id}
            className="rounded-2xl border border-ink-700/15 bg-white overflow-hidden shadow-xs"
          >
            <div className="px-6 py-4 bg-ink-950 text-paper-100 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-moss-500/20 text-moss-400 text-xs font-mono font-bold">
                  {mi + 1}
                </span>
                <h3 className="font-serif text-base md:text-lg font-semibold">
                  {m.module.title}
                </h3>
              </div>
              <span className="text-xs text-paper-100/60 font-mono">
                {m.lessons?.length || 0} lessons
              </span>
            </div>

            <ul className="divide-y divide-ink-700/10">
              {m.lessons.map((lesson, li) => {
                const lessonId = lesson.id || lesson._id
                const isDone = lesson.enriched || lesson.isEnriched

                return (
                  <li key={lessonId}>
                    <Link
                      to={`/lesson/${lessonId}`}
                      className="group flex items-center justify-between px-6 py-4 hover:bg-paper-50/80 transition-colors focus-ring"
                    >
                      <div className="flex items-center gap-3">
                        <span className="font-mono text-xs text-ink-700/50 w-8">
                          {mi + 1}.{li + 1}
                        </span>
                        <span className="text-sm font-medium text-ink-900 group-hover:text-moss-600 transition-colors">
                          {lesson.title}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        {isDone ? (
                          <span className="rounded-md bg-emerald-500/10 text-emerald-700 border border-emerald-500/20 text-[11px] font-semibold px-2.5 py-1 flex items-center gap-1">
                            <span>✓</span> Generated
                          </span>
                        ) : (
                          <span className="rounded-md bg-paper-100 text-ink-700/60 text-[11px] font-medium px-2.5 py-1">
                            Click to open
                          </span>
                        )}
                        <span className="text-ink-700/30 group-hover:text-moss-600 group-hover:translate-x-0.5 transition-all text-sm">
                          &rarr;
                        </span>
                      </div>
                    </Link>
                  </li>
                )
              })}
            </ul>
          </div>
        ))}
      </div>
    </div>
  )
}

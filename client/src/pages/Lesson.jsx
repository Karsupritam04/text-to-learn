import { useEffect, useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import LoadingSpinner from '../components/LoadingSpinner'
import ErrorMessage from '../components/ErrorMessage'
import LessonRenderer from '../components/LessonRenderer'
import LessonPDFExporter from '../components/LessonPDFExporter'
import HinglishAudioPlayer from '../components/HinglishAudioPlayer'
import { lessonApi } from '../utils/api'

export default function Lesson() {
  const { lessonId } = useParams()
  const navigate = useNavigate()
  const [lesson, setLesson] = useState(null)
  const [loadState, setLoadState] = useState('loading') // loading | ready | error

  function load() {
    setLoadState('loading')
    lessonApi
      .get(lessonId)
      .then((data) => {
        setLesson(data)
        setLoadState('ready')
      })
      .catch(() => setLoadState('error'))
  }

  useEffect(load, [lessonId])

  if (loadState === 'loading') {
    return (
      <div className="max-w-3xl mx-auto px-6 py-20 text-center">
        <LoadingSpinner label="Generating & enriching lesson content with AI…" />
        <p className="text-xs text-ink-700/60 mt-3">
          Synthesizing key topics, practical examples, video guides, and multiple-choice quizzes...
        </p>
      </div>
    )
  }

  if (loadState === 'error') {
    return (
      <div className="max-w-3xl mx-auto px-6 py-12">
        <ErrorMessage message="Couldn't load this lesson." onRetry={load} />
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto px-4 md:px-8 py-8 md:py-12">
      {/* Breadcrumb Navigation */}
      <nav className="flex items-center gap-2 text-xs text-ink-700/60 mb-6 flex-wrap">
        <Link to="/" className="hover:text-moss-600 focus-ring rounded">
          Courses
        </Link>
        <span>/</span>
        <button
          onClick={() => navigate(-1)}
          className="hover:text-moss-600 focus-ring rounded underline"
        >
          Back to Course
        </button>
        <span>/</span>
        <span className="text-ink-950 font-medium truncate max-w-xs">{lesson.title}</span>
      </nav>

      {/* Lesson Title Header & Actions */}
      <div className="rounded-2xl border border-ink-700/10 bg-white p-6 md:p-8 shadow-xs mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="rounded-md bg-moss-500/10 text-moss-700 text-xs font-bold px-2.5 py-1 uppercase tracking-wider">
              Interactive Lesson
            </span>
            <h1 className="font-serif text-2xl md:text-4xl font-bold text-ink-950 mt-3 tracking-tight">
              {lesson.title}
            </h1>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <LessonPDFExporter lesson={lesson} />
          </div>
        </div>

        {/* Objectives Box */}
        {lesson.objectives?.length > 0 && (
          <div className="mt-6 rounded-xl bg-gradient-to-r from-moss-500/5 to-emerald-500/5 border border-moss-500/20 p-4 md:p-5">
            <div className="flex items-center gap-2 mb-3">
              <span className="flex h-6 w-6 items-center justify-center rounded-md bg-moss-600 text-white text-xs font-bold">
                🎯
              </span>
              <p className="font-semibold text-moss-800 text-xs md:text-sm uppercase tracking-wide">
                Core Learning Objectives
              </p>
            </div>
            <ul className="grid sm:grid-cols-2 gap-2 text-xs md:text-sm text-ink-800">
              {lesson.objectives.map((obj, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="text-moss-600 font-bold text-sm">✓</span>
                  <span>{obj}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Hinglish Audio Narration Module */}
      <div className="mb-8">
        <HinglishAudioPlayer lesson={lesson} />
      </div>

      {/* Dynamic Content Block Renderer */}
      <div className="rounded-2xl border border-ink-700/10 bg-white p-6 md:p-8 shadow-xs mb-10">
        <LessonRenderer content={lesson.content} />
      </div>

      {/* Lesson Footer Navigation */}
      <div className="flex items-center justify-between gap-4 pt-6 border-t border-ink-700/10">
        <button
          onClick={() => navigate(-1)}
          className="rounded-xl border border-ink-700/15 bg-white px-5 py-2.5 text-xs md:text-sm font-semibold text-ink-900 hover:bg-paper-100 transition-colors focus-ring"
        >
          &larr; Back to Syllabus
        </button>

        <Link
          to="/"
          className="rounded-xl bg-moss-600 hover:bg-moss-700 px-5 py-2.5 text-xs md:text-sm font-semibold text-white shadow-xs transition-colors focus-ring"
        >
          Explore More Courses &rarr;
        </Link>
      </div>
    </div>
  )
}

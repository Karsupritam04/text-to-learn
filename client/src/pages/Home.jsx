import { useEffect, useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import PromptForm from '../components/PromptForm'
import LoadingSpinner from '../components/LoadingSpinner'
import ErrorMessage from '../components/ErrorMessage'
import { courseApi } from '../utils/api'

export default function Home() {
  const navigate = useNavigate()
  const [courses, setCourses] = useState([])
  const [loadState, setLoadState] = useState('loading') // loading | ready | error
  const [isGenerating, setIsGenerating] = useState(false)
  const [generateError, setGenerateError] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedTag, setSelectedTag] = useState('all')

  function loadCourses() {
    setLoadState('loading')
    courseApi
      .list()
      .then((data) => {
        setCourses(data || [])
        setLoadState('ready')
      })
      .catch(() => setLoadState('error'))
  }

  useEffect(loadCourses, [])

  async function handleGenerate(topic) {
    setIsGenerating(true)
    setGenerateError(null)
    try {
      const course = await courseApi.generate(topic)
      navigate(`/course/${course.id || course._id}`)
    } catch (e) {
      setGenerateError(e.message)
    } finally {
      setIsGenerating(false)
    }
  }

  async function handleDeleteCourse(e, courseId) {
    e.stopPropagation()
    if (!window.confirm('Are you sure you want to delete this course?')) return
    try {
      await courseApi.remove(courseId)
      setCourses((prev) => prev.filter((c) => (c.id || c._id) !== courseId))
    } catch (err) {
      alert('Failed to delete course: ' + err.message)
    }
  }

  const allTags = useMemo(() => {
    const tags = new Set()
    courses.forEach((c) => {
      c.tags?.forEach((t) => tags.add(t))
    })
    return ['all', ...Array.from(tags)]
  }, [courses])

  const filteredCourses = useMemo(() => {
    return courses.filter((c) => {
      const matchesSearch =
        c.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.description?.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesTag = selectedTag === 'all' || c.tags?.includes(selectedTag)
      return matchesSearch && matchesTag
    })
  }, [courses, searchQuery, selectedTag])

  return (
    <div className="max-w-5xl mx-auto px-4 md:px-8 py-8 md:py-12">
      {/* Top Banner / Hero */}
      <div className="mb-10">
        <PromptForm onGenerate={handleGenerate} isGenerating={isGenerating} />
        {generateError && (
          <div className="mt-4">
            <ErrorMessage message={generateError} onRetry={() => setGenerateError(null)} />
          </div>
        )}
      </div>

      {/* Catalog & Filter Section */}
      <div className="border-t border-ink-700/10 pt-10">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="font-serif text-2xl md:text-3xl text-ink-950 font-bold tracking-tight">
              Generated Course Catalog
            </h2>
            <p className="text-sm text-ink-700/70 mt-1">
              Explore previously generated courses or search by subject
            </p>
          </div>

          {courses.length > 0 && (
            <div className="relative w-full md:w-72">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-700/40 text-sm">
                🔍
              </span>
              <input
                type="text"
                placeholder="Search courses..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-xl border border-ink-700/15 bg-white pl-9 pr-4 py-2 text-xs md:text-sm text-ink-900 focus-ring shadow-xs"
              />
            </div>
          )}
        </div>

        {/* Tag Filters */}
        {allTags.length > 1 && (
          <div className="flex items-center gap-1.5 overflow-x-auto pb-4 mb-4 scrollbar-none">
            <span className="text-xs font-semibold text-ink-700/60 mr-1 uppercase">Filter:</span>
            {allTags.slice(0, 8).map((tag) => (
              <button
                key={tag}
                onClick={() => setSelectedTag(tag)}
                className={`rounded-lg px-3 py-1.5 text-xs font-medium capitalize transition-all focus-ring ${
                  selectedTag === tag
                    ? 'bg-moss-600 text-white shadow-xs'
                    : 'bg-white border border-ink-700/15 text-ink-700 hover:bg-paper-100'
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
        )}

        {/* Course Grid */}
        {loadState === 'loading' && <LoadingSpinner label="Loading courses…" />}
        {loadState === 'error' && (
          <ErrorMessage message="Couldn't load courses from server." onRetry={loadCourses} />
        )}
        {loadState === 'ready' && courses.length === 0 && (
          <div className="rounded-2xl border-2 border-dashed border-ink-700/15 bg-white p-12 text-center">
            <span className="text-4xl">📚</span>
            <h3 className="font-serif text-xl font-bold text-ink-950 mt-3">No courses yet</h3>
            <p className="text-sm text-ink-700/70 mt-1 max-w-md mx-auto">
              Type any topic in the generator above to instantly create your first AI-structured syllabus with rich lessons and quizzes.
            </p>
          </div>
        )}

        {loadState === 'ready' && courses.length > 0 && filteredCourses.length === 0 && (
          <div className="rounded-xl border border-ink-700/10 bg-white p-8 text-center text-sm text-ink-700/70">
            No courses found matching "{searchQuery}".
          </div>
        )}

        {loadState === 'ready' && filteredCourses.length > 0 && (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredCourses.map((c) => {
              const courseId = c.id || c._id
              const moduleCount = c.moduleIds?.length || c.modules?.length || 4
              const formattedDate = c.createdAt
                ? new Date(c.createdAt).toLocaleDateString(undefined, {
                    month: 'short',
                    day: 'numeric',
                  })
                : 'Recent'

              return (
                <div
                  key={courseId}
                  onClick={() => navigate(`/course/${courseId}`)}
                  className="group relative flex flex-col justify-between rounded-2xl border border-ink-700/15 bg-white p-5 hover:border-moss-500/50 hover:shadow-md transition-all cursor-pointer focus-ring"
                >
                  <div>
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <span className="rounded-md bg-moss-500/10 text-moss-700 text-[11px] font-semibold px-2 py-0.5">
                        {moduleCount} Modules
                      </span>
                      <button
                        onClick={(e) => handleDeleteCourse(e, courseId)}
                        className="opacity-0 group-hover:opacity-100 text-ink-700/40 hover:text-rose-600 transition-opacity p-1 text-xs"
                        title="Delete course"
                      >
                        🗑️
                      </button>
                    </div>

                    <h3 className="font-serif text-lg font-bold text-ink-950 group-hover:text-moss-600 transition-colors line-clamp-2 mb-2">
                      {c.title}
                    </h3>
                    <p className="text-xs text-ink-700/75 line-clamp-3 leading-relaxed">
                      {c.description}
                    </p>
                  </div>

                  <div className="mt-5 pt-4 border-t border-ink-700/10 flex items-center justify-between text-xs text-ink-700/60">
                    <span className="flex items-center gap-1">
                      <span>📅</span> {formattedDate}
                    </span>
                    <span className="font-semibold text-moss-600 group-hover:translate-x-1 transition-transform">
                      View Syllabus &rarr;
                    </span>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}

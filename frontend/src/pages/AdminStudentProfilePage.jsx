import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from 'react-query'
import { motion } from 'framer-motion'
import { userService } from '../services/userService'
import Header from '../components/common/Header'
import LoadingSpinner from '../components/common/LoadingSpinner'
import toast from 'react-hot-toast'

const AdminStudentProfilePage = () => {
  const { id } = useParams()
  const queryClient = useQueryClient()
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({})

  const { data, isLoading } = useQuery(
    ['student-profile', id],
    () => userService.getStudentProfile(id),
    {
      onSuccess: (res) => {
        if (res?.data?.profile) {
          setFormData(res.data.profile)
        }
      }
    }
  )

  const updateMutation = useMutation(
    (payload) => userService.updateStudentProfile(id, payload),
    {
      onSuccess: () => {
        toast.success('Student profile updated')
        setIsEditing(false)
        queryClient.invalidateQueries(['student-profile', id])
      },
      onError: (err) => toast.error(err.message)
    }
  )

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  const profile = data?.data?.profile || {}
  const enrollments = data?.data?.enrollments || []
  const certificates = data?.data?.certificates || []
  const testAttempts = data?.data?.testAttempts || []
  const summary = data?.data?.summary || {}

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSave = (e) => {
    e.preventDefault()
    updateMutation.mutate(formData)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <Header />
      <main className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <Link to="/admin/students" className="text-indigo-600 text-sm hover:underline">← Back to students</Link>
              <h1 className="text-2xl font-bold text-gray-900 mt-2">{profile.name}</h1>
              <p className="text-gray-600">{profile.email}</p>
            </div>
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="btn-primary"
            >
              {isEditing ? 'Cancel' : 'Edit Profile'}
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="card"><p className="text-sm text-gray-500">Enrolled</p><p className="text-2xl font-bold">{summary.totalEnrolled || 0}</p></div>
            <div className="card"><p className="text-sm text-gray-500">Content Done</p><p className="text-2xl font-bold">{summary.contentCompleted || 0}</p></div>
            <div className="card"><p className="text-sm text-gray-500">Certified</p><p className="text-2xl font-bold">{summary.certified || 0}</p></div>
            <div className="card"><p className="text-sm text-gray-500">Certificates</p><p className="text-2xl font-bold">{summary.certificatesEarned || 0}</p></div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <motion.form onSubmit={handleSave} className="card space-y-4">
              <h2 className="text-lg font-semibold">Personal & Academic</h2>
              {[
                ['student_id', 'Student ID'],
                ['phone', 'Phone'],
                ['location', 'Location'],
                ['education_level', 'Education Level'],
                ['college_name', 'College'],
                ['specialization', 'Specialization'],
                ['graduation_year', 'Graduation Year'],
                ['joined_at', 'Joined Date']
              ].map(([name, label]) => (
                <div key={name}>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
                  <input
                    type={name.includes('year') ? 'number' : name.includes('joined') || name.includes('birth') ? 'date' : 'text'}
                    name={name}
                    value={formData[name] || ''}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className="input-field w-full disabled:bg-gray-50"
                  />
                </div>
              ))}
              {isEditing && (
                <button type="submit" className="btn-primary" disabled={updateMutation.isLoading}>
                  Save Changes
                </button>
              )}
            </motion.form>

            <div className="card">
              <h2 className="text-lg font-semibold mb-4">Course Progress</h2>
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {enrollments.map((e) => (
                  <div key={e.id} className="border rounded-lg p-3">
                    <div className="flex justify-between">
                      <p className="font-medium">{e.course?.title || 'Course'}</p>
                      <span className="text-xs px-2 py-1 bg-indigo-100 text-indigo-700 rounded">{e.status}</span>
                    </div>
                    <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-indigo-600 h-2 rounded-full" style={{ width: `${e.progress || 0}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="card">
              <h2 className="text-lg font-semibold mb-4">Assessments</h2>
              {testAttempts.length === 0 ? (
                <p className="text-gray-500 text-sm">No test attempts yet.</p>
              ) : (
                testAttempts.map((a) => (
                  <div key={a.id} className="border-b py-2 last:border-0">
                    <p className="font-medium">{a.test?.title || 'Assessment'}</p>
                    <p className="text-sm text-gray-600">Score: {a.score}% · {a.isPassed ? 'Passed' : 'Failed'}</p>
                  </div>
                ))
              )}
            </div>
            <div className="card">
              <h2 className="text-lg font-semibold mb-4">Certificates</h2>
              {certificates.length === 0 ? (
                <p className="text-gray-500 text-sm">No certificates yet.</p>
              ) : (
                certificates.map((c) => (
                  <div key={c.id} className="border-b py-2 last:border-0">
                    <p className="font-medium">{c.metadata?.courseName || 'Course Certificate'}</p>
                    <p className="text-sm text-gray-600">{c.certificate_number}</p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default AdminStudentProfilePage

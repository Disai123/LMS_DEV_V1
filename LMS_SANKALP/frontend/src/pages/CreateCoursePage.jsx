import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import CreateCourseNew from '../components/admin/CreateCourseNew'

const CreateCoursePage = () => {
  const { user } = useAuth()

  if (user?.role !== 'admin') {
    return <Navigate to="/unauthorized" replace />
  }

  return <CreateCourseNew />
}

export default CreateCoursePage

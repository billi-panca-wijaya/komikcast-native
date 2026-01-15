import { Navigate, useParams } from 'react-router-dom'

const GenreRedirect = () => {
    const { name } = useParams()
    return <Navigate to={`/pustaka?genre=${encodeURIComponent(name)}`} replace />
}

export default GenreRedirect

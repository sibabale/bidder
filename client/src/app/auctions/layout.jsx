import ProtectedRoute from '@/components/template/protectedRoute.js'
import Header from '../../components/molecules/header/header.jsx'

export default function AuctionsLayout({ children }) {
    return (
        <ProtectedRoute>
            <Header />
            <nav></nav>
            {children}
        </ProtectedRoute>
    )
}

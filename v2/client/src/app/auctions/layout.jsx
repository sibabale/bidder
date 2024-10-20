import Header from '../../components/molecules/header/header.jsx'

export default function AuctionsLayout({ children }) {
    return (
        <section>
            <Header />
            <nav></nav>
            {children}
        </section>
    )
}

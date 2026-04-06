import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
    return (
        <nav style={styles.navbar}>
            <div style={styles.container}>
                <Link to="/" style={styles.logo}>
                    🏫 Smart Campus Hub
                </Link>
                <div style={styles.navLinks}>
                    <Link to="/resources" style={styles.link}>📚 Resources</Link>
                    <Link to="/resources/create" style={styles.link}>➕ Add Resource</Link>
                </div>
            </div>
        </nav>
    );
};

const styles = {
    navbar: {
        backgroundColor: '#2c3e50',
        padding: '1rem 2rem',
        color: 'white',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    },
    container: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        maxWidth: '1200px',
        margin: '0 auto',
    },
    logo: {
        fontSize: '1.5rem',
        fontWeight: 'bold',
        color: 'white',
        textDecoration: 'none',
    },
    navLinks: {
        display: 'flex',
        gap: '1rem',
    },
    link: {
        color: 'white',
        textDecoration: 'none',
        padding: '0.5rem 1rem',
        borderRadius: '4px',
        backgroundColor: '#34495e',
    },
};

export default Navbar;
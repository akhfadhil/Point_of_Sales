// src/components/common/ErrorBoundary.jsx
import React from 'react';

/**
 * ErrorBoundary Component untuk menangkap error JavaScript yang tidak terduga
 * pada komponen anak di bawah hirarki render React.
 */
export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("React ErrorBoundary caught an error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: '40px 20px', textAlign: 'center', fontFamily: 'sans-serif' }}>
          <h2 style={{ color: '#ef4444', marginBottom: '12px' }}>Terjadi Kendala Tampilan</h2>
          <p style={{ color: '#64748b', marginBottom: '20px' }}>
            {this.state.error ? this.state.error.toString() : 'Terjadi kendala sistem.'}
          </p>
          <button
            onClick={() => {
              localStorage.removeItem('oliviana_db_version');
              window.location.reload();
            }}
            style={{ padding: '10px 20px', backgroundColor: '#4f46e5', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}
          >
            Muat Ulang Aplikasi (Reset Database & Cache)
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

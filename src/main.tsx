import React, {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import './proposal-theme.css';
import './accessibility.css';

class AppErrorBoundary extends React.Component<
  React.PropsWithChildren,
  { error: Error | null }
> {
  state = { error: null as Error | null };

  static getDerivedStateFromError(error: Error) {
    return { error };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error('ThesisVerse startup error:', error, info);
  }

  render() {
    if (this.state.error) {
      return (
        <main style={{ minHeight: '100vh', display: 'grid', placeItems: 'center', padding: 24, background: '#f7f8f5', color: '#1d251b', fontFamily: 'system-ui, sans-serif' }}>
          <section style={{ width: 'min(680px, 100%)', border: '1px solid #dce1d8', borderRadius: 20, background: '#fff', padding: 28, boxShadow: '0 10px 30px rgba(29,37,27,.08)' }}>
            <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: '.12em', textTransform: 'uppercase', color: '#65775a' }}>ThesisVerse</div>
            <h1 style={{ margin: '10px 0 8px', fontSize: 28 }}>The app could not start.</h1>
            <p style={{ margin: '0 0 18px', lineHeight: 1.6, color: '#687264' }}>The deployment loaded, but the browser encountered a startup error.</p>
            <pre style={{ overflowX: 'auto', padding: 14, borderRadius: 12, background: '#f1f3ee', fontSize: 12, whiteSpace: 'pre-wrap' }}>{this.state.error.message}</pre>
            <button onClick={() => window.location.reload()} style={{ marginTop: 16, border: 0, borderRadius: 12, padding: '11px 16px', background: '#65775a', color: '#fff', fontWeight: 700 }}>Reload ThesisVerse</button>
          </section>
        </main>
      );
    }

    return this.props.children;
  }
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AppErrorBoundary>
      <App />
    </AppErrorBoundary>
  </StrictMode>,
);

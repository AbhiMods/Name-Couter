import React from 'react';
import Button from '../ui/Button';

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null, errorInfo: null };
    }

    static getDerivedStateFromError(error) {
        // Update state so the next render will show the fallback UI.
        return { hasError: true, error };
    }

    componentDidCatch(error, errorInfo) {
        // You can also log the error to an error reporting service
        console.error("Uncaught error:", error, errorInfo);
        this.setState({ errorInfo });
    }

    handleReset = () => {
        this.setState({ hasError: false, error: null, errorInfo: null });
        // Optionally clear local storage if it's a data corruption issue, 
        // or just reload the page which is often the safest bet for deep state corruption.
        window.location.reload();
    };

    render() {
        if (this.state.hasError) {
            return (
                <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    height: '100vh',
                    padding: '2rem',
                    textAlign: 'center',
                    backgroundColor: '#0a0a0f',
                    color: '#fff'
                }}>
                    <h2 style={{
                        fontSize: '2rem',
                        color: '#ff4444',
                        marginBottom: '1rem',
                        fontFamily: 'var(--font-display)'
                    }}>
                        Something went wrong.
                    </h2>
                    <p style={{ maxWidth: '500px', marginBottom: '2rem', color: '#888' }}>
                        We encountered an unexpected error. Please try reloading the application.
                    </p>

                    <Button onClick={this.handleReset} variant="primary">
                        Reload Application
                    </Button>

                    {process.env.NODE_ENV === 'development' && this.state.error && (
                        <div style={{
                            marginTop: '2rem',
                            padding: '1rem',
                            background: '#1a1a1f',
                            borderRadius: '8px',
                            textAlign: 'left',
                            overflow: 'auto',
                            maxWidth: '100%',
                            maxHeight: '300px'
                        }}>
                            <pre style={{ color: '#ff8888', fontSize: '0.85rem' }}>
                                {this.state.error.toString()}
                            </pre>
                            <br />
                            <pre style={{ color: '#666', fontSize: '0.75rem' }}>
                                {this.state.errorInfo?.componentStack}
                            </pre>
                        </div>
                    )}
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;


import React from 'react';
import { Button, Result } from 'antd';

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }

    componentDidCatch(error, errorInfo) {
        console.error('ErrorBoundary caught an error:', error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return (
                <div style={{ padding: '50px', display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', flexDirection: 'column' }}>
                    <Result
                        status="500"
                        title="Something went wrong."
                        subTitle="Sorry, an unexpected error has occurred."
                        extra={
                            <Button type="primary" onClick={() => window.location.reload()}>
                                Reload Page
                            </Button>
                        }
                    />
                    {this.state.error && (
                        <details style={{ whiteSpace: 'pre-wrap', marginTop: '20px', color: 'red' }}>
                            {this.state.error.toString()}
                        </details>
                    )}
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;

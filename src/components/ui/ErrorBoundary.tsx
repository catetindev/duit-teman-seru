import React from 'react';
import { Button } from '@/components/ui/button';

export default class ErrorBoundary extends React.Component<{
  children: React.ReactNode;
}, {
  hasError: boolean;
  error?: Error;
}> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-4 border border-red-200 bg-red-50 rounded-lg">
          <h3 className="text-lg font-medium text-red-800 mb-2">Something went wrong</h3>
          <p className="text-red-600 mb-4">{this.state.error?.message}</p>
          <Button 
            variant="outline" 
            onClick={() => window.location.reload()}
            className="text-red-600 border-red-300"
          >
            Reload Page
          </Button>
        </div>
      );
    }

    return this.props.children;
  }
}

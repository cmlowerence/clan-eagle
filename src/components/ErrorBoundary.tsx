'use client';

import React, { Component, ErrorInfo, ReactNode } from "react";
import { AlertTriangle, RefreshCw } from "lucide-react";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export default class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center min-h-[50vh] p-6 text-center space-y-4">
          <div className="bg-red-500/10 p-4 rounded-full text-red-500">
            <AlertTriangle size={48} />
          </div>
          <h2 className="text-2xl font-clash text-white">Something went wrong</h2>
          <p className="text-red-400 font-mono text-sm max-w-md bg-black/30 p-4 rounded border border-red-500/20">
            {this.state.error?.message}
          </p>
          <button
            onClick={() => this.setState({ hasError: false })}
            className="flex items-center gap-2 bg-skin-primary text-black px-4 py-2 rounded-lg font-bold hover:bg-skin-secondary transition-colors"
          >
            <RefreshCw size={16} /> Try Again
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

"use client";
import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/uicomponents';

interface ErrorBoundaryProps {
  children?: ReactNode;
  fallback?: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: any;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  public state: ErrorBoundaryState = {
    hasError: false,
    error: null
  };

  static getDerivedStateFromError(error: any): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("REACT_CRASH", error, errorInfo);
  }

  private handleReload = () => {
    window.location.reload();
  };

  render(): ReactNode {
    const { hasError, error } = this.state;
    const { children, fallback } = this.props;

    if (hasError) {
      if (fallback) return fallback as ReactNode;

      const errorMessage = error instanceof Error 
        ? error.message 
        : (typeof error === 'object' ? JSON.stringify(error) : String(error));

      return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4 text-center">
          <div className="bg-white p-8 rounded-[2.5rem] shadow-xl border border-gray-100 max-w-md w-full animate-scale-in">
            <div className="w-16 h-16 bg-red-50 text-red-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <AlertTriangle size={32} />
            </div>
            <h2 className="text-2xl font-serif font-bold text-gray-900 mb-2">Une erreur inattendue est survenue</h2>
            <p className="text-gray-500 mb-4 text-sm leading-relaxed">L'application a rencontré un problème technique. Nos ingénieurs ont été notifiés.</p>
            <div className="bg-gray-50 p-3 rounded-xl font-mono text-[10px] text-gray-400 mb-8 break-all max-h-24 overflow-y-auto text-left">
              {errorMessage}
            </div>
            <Button onClick={this.handleReload} className="w-full bg-[#c25e00] text-white hover:bg-[#a04e00] h-12 rounded-xl shadow-lg shadow-orange-500/20">
              <RefreshCw className="mr-2 h-4 w-4" /> Rafraîchir l'application
            </Button>
          </div>
        </div>
      );
    }
    return children;
  }
}

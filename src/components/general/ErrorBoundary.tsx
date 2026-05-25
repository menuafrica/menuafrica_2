import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error in Menu Africa:", error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div id="error-screen" className="min-h-screen bg-gray-950 text-white flex flex-col items-center justify-center p-6 text-center">
          <div className="h-16 w-16 bg-red-950 rounded-full flex items-center justify-center text-red-500 text-3xl mb-6">
            ⚠️
          </div>
          <h1 className="text-2xl font-bold font-sans tracking-tight mb-2">Quelque chose s'est mal passé</h1>
          <p className="text-sm text-gray-400 font-mono mb-6 max-w-md">
            {this.state.error?.message || "Une erreur inattendue est survenue lors de l'affichage."}
          </p>
          <button
            id="error-reset-btn"
            onClick={() => window.location.reload()}
            className="h-12 px-6 rounded-xl bg-orange-600 font-medium text-white hover:bg-orange-500 active:scale-95 transition-all outline-none"
          >
            Recharger l'Application
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

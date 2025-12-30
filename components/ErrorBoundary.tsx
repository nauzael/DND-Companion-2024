import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null
    };
  }

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-[#0F172A] text-white p-6 text-center font-display">
          <div className="bg-red-500/10 p-5 rounded-full mb-6 ring-1 ring-red-500/30">
             <span className="material-symbols-outlined text-5xl text-red-500">error_med</span>
          </div>
          <h1 className="text-3xl font-bold mb-3 tracking-tight">Algo salió mal</h1>
          <p className="text-slate-400 mb-8 max-w-xs mx-auto text-sm leading-relaxed">
            La aplicación ha encontrado un error crítico y no puede continuar.
          </p>
          
          {this.state.error && (
             <div className="w-full max-w-sm bg-black/30 rounded-xl p-4 mb-8 text-left border border-white/5 overflow-hidden">
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Detalles del Error</p>
                <code className="text-xs text-red-300 font-mono break-words block">
                    {this.state.error.toString()}
                </code>
             </div>
          )}

          <button 
            onClick={() => window.location.reload()}
            className="w-full max-w-xs py-4 bg-[#359EFF] hover:bg-[#2B7DE0] text-[#0F172A] rounded-xl font-bold text-lg shadow-lg shadow-blue-500/20 transition-all active:scale-[0.98]"
          >
            Reiniciar Aplicación
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
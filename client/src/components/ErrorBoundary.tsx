import { Component } from 'react'
import type { ErrorInfo, ReactNode } from 'react'

interface Props {
  children: ReactNode
  fallback?: ReactNode
}

interface State {
  hasError: boolean
  error: Error | null
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  }

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo)
  }

  public render() {
    if (this.state.hasError) {
      return (
        this.props.fallback || (
          <div className="p-6 bg-red-50 border border-red-200 rounded-lg text-center my-8">
            <h2 className="text-xl font-bold text-red-800 mb-2">Qualcosa è andato storto</h2>
            <p className="text-red-600 mb-4">
              Si è verificato un errore imprevisto nell'applicazione.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
            >
              Ricarica la pagina
            </button>
            {import.meta.env.DEV && this.state.error && (
              <pre className="mt-4 p-4 bg-gray-800 text-white text-left text-xs overflow-auto rounded">
                {this.state.error.toString()}
              </pre>
            )}
          </div>
        )
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary

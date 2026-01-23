import React, { Component } from 'react';

class ErrorBoundary extends Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true };
    }

    componentDidCatch(error, errorInfo) {
        console.error("Medalla Factory Error:", error, errorInfo);
    }

    handleReload = () => {
        window.location.reload();
    };

    render() {
        if (this.state.hasError) {
            return (
                <div className="min-h-screen flex flex-col items-center justify-center bg-slate-900 text-center px-4">
                    <div className="relative mb-8">
                        <div className="absolute inset-0 bg-red-500/10 blur-3xl rounded-full"></div>
                        <h1 className="relative text-9xl font-bold brand-font text-slate-800 select-none">500</h1>
                        <div className="absolute inset-0 flex items-center justify-center">
                            <span className="text-3xl md:text-4xl font-bold border-2 border-red-500 text-red-500 px-4 py-2 rounded rotate-6 bg-slate-900/80 backdrop-blur-sm shadow-xl">
                                FALLA EN LÍNEA
                            </span>
                        </div>
                    </div>

                    <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
                        ¡Se rompió una botella!
                    </h2>
                    <p className="text-slate-400 max-w-md mb-8 text-lg">
                        Nuestros maestros cerveceros están limpiando el desastre. Por favor, intentá recargar la página.
                    </p>

                    <button
                        onClick={this.handleReload}
                        className="inline-flex items-center gap-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white font-bold py-3 px-8 rounded-sm uppercase tracking-widest transition-all hover:scale-105"
                    >
                        Recargar Página
                    </button>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;

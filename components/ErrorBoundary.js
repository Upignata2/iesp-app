import { jsx as _jsx } from "react/jsx-runtime";
import { Component } from 'react';
export default class ErrorBoundary extends Component {
    constructor() {
        super(...arguments);
        this.state = { hasError: false };
    }
    static getDerivedStateFromError() { return { hasError: true }; }
    render() {
        if (this.state.hasError)
            return _jsx("div", { className: "p-6 text-center", children: "Algo deu errado" });
        return this.props.children;
    }
}

import { jsx as _jsx } from "react/jsx-runtime";
export function Card({ className = '', ...props }) {
    const classes = ['rounded-lg border border-gray-200 bg-white shadow-sm', className].join(' ');
    return _jsx("div", { className: classes, ...props });
}

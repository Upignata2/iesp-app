import { jsx as _jsx } from "react/jsx-runtime";
import { forwardRef } from 'react';
export const Button = forwardRef(function Button({ variant = 'solid', size = 'md', className = '', ...props }, ref) {
    const base = 'inline-flex items-center justify-center rounded-md transition-colors';
    const variantClass = variant === 'outline'
        ? 'border border-gray-300 bg-transparent text-gray-900'
        : variant === 'secondary'
            ? 'bg-gray-100 text-gray-900'
            : variant === 'ghost'
                ? 'bg-transparent text-gray-700 hover:bg-gray-100'
                : variant === 'destructive'
                    ? 'bg-red-600 text-white hover:bg-red-700'
                    : 'bg-blue-600 text-white';
    const sizeClass = size === 'sm' ? 'px-3 py-1 text-sm' : size === 'lg' ? 'px-5 py-3 text-base' : 'px-4 py-2 text-sm';
    const classes = [base, variantClass, sizeClass, className].join(' ');
    return _jsx("button", { ref: ref, className: classes, ...props });
});

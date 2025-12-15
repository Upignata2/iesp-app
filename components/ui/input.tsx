import { InputHTMLAttributes, forwardRef } from 'react';

type Props = InputHTMLAttributes<HTMLInputElement>;

export const Input = forwardRef<HTMLInputElement, Props>(function Input({ className = '', ...props }, ref) {
  const classes = [
    'flex h-10 w-full rounded-md border border-gray-300 bg-[#D2D7DB] px-3 py-2 text-sm',
    'placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500',
    className,
  ].join(' ');
  return <input ref={ref} className={classes} {...props} />;
});

import { HTMLAttributes } from 'react';

export function Card({ className = '', ...props }: HTMLAttributes<HTMLDivElement>) {
  const classes = ['rounded-lg border border-gray-200 bg-white shadow-sm', className].join(' ');
  return <div className={classes} {...props} />;
}
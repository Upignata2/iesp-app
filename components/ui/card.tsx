import { HTMLAttributes } from 'react';

export function Card({ className = '', ...props }: HTMLAttributes<HTMLDivElement>) {
  const classes = ['rounded-lg border border-gray-200 bg-[#D2D7DB] shadow-sm', className].join(' ');
  return <div className={classes} {...props} />;
}

import { FC, ComponentProps, ButtonHTMLAttributes, forwardRef } from 'react';
import type { VariantProps } from 'class-variance-authority';
import { cva } from 'class-variance-authority';
import { cn } from '../../utils/utils';

const buttonVariants = cva(
  'bg-pink-500 hover:bg-pink-700 text-white font-bold py-2 px-4 rounded',
  {
    variants: {
      variant: {
        default:
          'bg-indigo-700 hover:bg-indigo-800 text-white font-bold py-2 px-4 rounded',
        outline:
          'bg-transparent hover:bg-indigo-700 text-indigo-200 font-semibold hover:text-white py-2 px-4 border border-indigo-500 hover:border-transparent rounded',
      },
      size: {
        default: 'py-2 px-4',
        sm: 'py-1 px-2',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);
// interface ButtonProps
//   extends ButtonHTMLAttributes<HTMLButtonElement>,
//     VariantProps<typeof buttonVariants> {}

interface ButtonProps extends ComponentProps<'button'>, VariantProps<typeof buttonVariants> {}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(({className, size, variant, ...props}: ButtonProps, ref) => {
  return <button ref={ref} className={cn(buttonVariants({variant, size, className}))}{...props} />;
});

export default Button;

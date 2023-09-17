import { ComponentProps } from 'react';
import { cn } from '../../utils/utils';
import { cva, VariantProps } from 'class-variance-authority';

const skeletonVariants = cva('bg-pink-500 hover:bg-pink-700 text-white font-bold py-2 px-4 rounded', {
  variants: {
    variant: {
      default: 'bg-indigo-700 hover:bg-indigo-800 text-white font-bold py-2 px-4 rounded',
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
});

interface ButtonProps extends ComponentProps<'div'>, VariantProps<typeof skeletonVariants> {}

function Skeleton({ className, variant, ...props }: ButtonProps) {
  return <div className={cn(skeletonVariants({ className, variant }))} {...props} />;
}

export { Skeleton };

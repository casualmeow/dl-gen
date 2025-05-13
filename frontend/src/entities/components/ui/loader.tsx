import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { motion } from 'framer-motion';

import { cn } from 'shared/lib/utils';

const loaderVariants = cva('relative flex items-center justify-center', {
  variants: {
    variant: {
      default: 'text-primary',
      secondary: 'text-secondary',
      destructive: 'text-destructive',
      outline: 'text-primary border border-input bg-background',
      ghost: 'hover:bg-accent hover:text-accent-foreground',
      muted: 'text-muted-foreground',
      accent: 'text-accent-foreground bg-accent',
    },
    size: {
      xs: 'h-3 w-3',
      sm: 'h-4 w-4',
      default: 'h-5 w-5',
      md: 'h-6 w-6',
      lg: 'h-8 w-8',
      xl: 'h-10 w-10',
      '2xl': 'h-12 w-12',
    },
  },
  defaultVariants: {
    variant: 'default',
    size: 'default',
  },
});

export interface LoaderProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof loaderVariants> {
  type?: 'spinner' | 'dots' | 'pulse' | 'linear' | 'circular';
  speed?: 'slow' | 'default' | 'fast';
  thickness?: 'thin' | 'default' | 'thick';
  progress?: number;
  label?: string;
}

const Loader = React.forwardRef<HTMLDivElement, LoaderProps>(
  (
    {
      className,
      variant,
      size,
      type = 'spinner',
      speed = 'default',
      thickness = 'default',
      progress,
      label,
      ...props
    },
    ref,
  ) => {
    const speedValues = {
      slow: 1.5,
      default: 1,
      fast: 0.5,
    };

    const thicknessValues = {
      thin: type === 'spinner' ? 'border' : '2px',
      default: type === 'spinner' ? 'border-2' : '3px',
      thick: type === 'spinner' ? 'border-[3px]' : '4px',
    };

    const ariaLabel = label || 'Loading';

    return (
      <div
        className={cn(loaderVariants({ variant, size, className }))}
        ref={ref}
        role="status"
        aria-label={ariaLabel}
        {...props}
      >
        {type === 'spinner' && (
          <SpinnerLoader duration={speedValues[speed]} thickness={thicknessValues[thickness]} />
        )}
        {type === 'dots' && <DotsLoader duration={speedValues[speed]} />}
        {type === 'pulse' && <PulseLoader duration={speedValues[speed]} />}
        {type === 'linear' && (
          <LinearLoader progress={progress} thickness={thicknessValues[thickness]} />
        )}
        {type === 'circular' && (
          <CircularLoader progress={progress} thickness={thicknessValues[thickness]} />
        )}
        {label && <span className="sr-only">{label}</span>}
      </div>
    );
  },
);
Loader.displayName = 'Loader';

// Spinner Loader
interface SpinnerLoaderProps {
  duration: number;
  thickness: string;
}

const SpinnerLoader = ({ duration, thickness }: SpinnerLoaderProps) => {
  return (
    <div className="relative h-full w-full">
      {/* Static ring */}
      <div className={cn('absolute inset-0 rounded-full border-current opacity-20', thickness)} />

      {/* Animated spinner */}
      <motion.div
        className={cn('absolute inset-0 rounded-full border-transparent', thickness)}
        style={{
          borderTopColor: 'currentColor',
        }}
        animate={{ rotate: 360 }}
        transition={{
          duration,
          ease: 'linear',
          repeat: Number.POSITIVE_INFINITY,
        }}
      />
    </div>
  );
};

// Dots Loader
interface DotsLoaderProps {
  duration: number;
}

const DotsLoader = ({ duration }: DotsLoaderProps) => {
  return (
    <div className="flex h-full w-full items-center justify-center space-x-1">
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          className="h-1/4 w-1/4 rounded-full bg-current"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.6, 1, 0.6],
          }}
          transition={{
            duration: duration * 0.8,
            repeat: Number.POSITIVE_INFINITY,
            delay: i * (duration / 4),
            ease: 'easeInOut',
          }}
        />
      ))}
    </div>
  );
};

// Pulse Loader
interface PulseLoaderProps {
  duration: number;
}

const PulseLoader = ({ duration }: PulseLoaderProps) => {
  return (
    <div className="relative h-full w-full">
      <motion.div
        className="absolute inset-0 rounded-full bg-current"
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{
          opacity: [0, 0.5, 0],
          scale: [0.5, 1, 0.5],
        }}
        transition={{
          duration: duration * 1.2,
          repeat: Number.POSITIVE_INFINITY,
          ease: 'easeInOut',
        }}
      />
      <motion.div
        className="absolute inset-[25%] rounded-full bg-current"
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{
          opacity: [0, 0.8, 0],
          scale: [0.5, 1, 0.5],
        }}
        transition={{
          duration: duration * 1.2,
          repeat: Number.POSITIVE_INFINITY,
          ease: 'easeInOut',
          delay: duration * 0.3,
        }}
      />
    </div>
  );
};

// Linear Loader
interface LinearLoaderProps {
  progress?: number;
  thickness: string;
}

const LinearLoader = ({ progress }: LinearLoaderProps) => {
  const determinate = typeof progress === 'number';

  return (
    <div className="h-1/4 w-full overflow-hidden rounded-full bg-current bg-opacity-20">
      {determinate ? (
        <motion.div
          className="h-full bg-current"
          initial={{ width: '0%' }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
        />
      ) : (
        <motion.div
          className="h-full bg-current"
          initial={{ x: '-100%' }}
          animate={{ x: '100%' }}
          transition={{
            duration: 1.5,
            repeat: Number.POSITIVE_INFINITY,
            ease: 'easeInOut',
          }}
          style={{ width: '30%' }}
        />
      )}
    </div>
  );
};

// Circular Loader
interface CircularLoaderProps {
  progress?: number;
  thickness: string;
}

const CircularLoader = ({ progress, thickness }: CircularLoaderProps) => {
  const determinate = typeof progress === 'number';
  const strokeWidth = Number.parseInt(thickness.replace(/[^\d]/g, '')) * 2;
  const radius = 45;
  const circumference = 2 * Math.PI * radius;

  return (
    <div className="relative h-full w-full">
      <svg className="h-full w-full -rotate-90" viewBox="0 0 100 100">
        <circle
          className="stroke-current opacity-20"
          cx="50"
          cy="50"
          r={radius}
          fill="none"
          strokeWidth={strokeWidth}
        />
        {determinate ? (
          <motion.circle
            className="stroke-current"
            cx="50"
            cy="50"
            r={radius}
            fill="none"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{
              strokeDashoffset: circumference - (progress / 100) * circumference,
            }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
          />
        ) : (
          <motion.circle
            className="stroke-current"
            cx="50"
            cy="50"
            r={radius}
            fill="none"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={`${circumference * 0.25} ${circumference * 0.75}`}
            animate={{ rotate: 360 }}
            transition={{
              duration: 1.5,
              repeat: Number.POSITIVE_INFINITY,
              ease: 'linear',
            }}
            style={{ transformOrigin: 'center' }}
          />
        )}
        {determinate && (
          <text
            x="50"
            y="50"
            textAnchor="middle"
            dominantBaseline="middle"
            className="fill-current text-xs font-medium"
          >
            {`${Math.round(progress)}%`}
          </text>
        )}
      </svg>
    </div>
  );
};

export { Loader };

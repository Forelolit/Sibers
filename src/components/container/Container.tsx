import clsx from 'clsx';
import type { FC } from 'react';

interface ContainerProps {
    children: React.ReactNode;
    className?: string;
}

/**
 * Container component
 * Wraps content in a fixed-width centered container with horizontal padding.
 * Accepts additional className for custom styling.
 */

export const Container: FC<ContainerProps> = ({ children, className = '' }) => {
    return <div className={clsx(className, 'w-[1000px] mx-auto px-5')}>{children}</div>;
};

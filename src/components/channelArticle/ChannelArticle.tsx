import type { FC } from 'react';
import { Avatar, AvatarFallback, AvatarImage, Separator } from '@/components';
import { Link } from 'react-router';
import type { ChannelType } from '@/types/channeInterface';
import { paths } from '@/constants/constans';

interface ChannelArticleProps {
    data: ChannelType;
    variant?: 'base' | 'outline';
}

/**
 * ChannelArticle component
 * Displays a single channel as an article with avatar and link username.
 * Supports two variants:
 *  - 'base': larger card with border and separator
 *  - 'outline': compact version
 */

export const ChannelArticle: FC<ChannelArticleProps> = ({ data, variant = 'base' }) => {
    return (
        <>
            {/* Base variant: larger card with border */}
            {variant === 'base' && (
                <article key={data.id} className="flex gap-2 items-center border border-neutral-300 p-4 rounded-4xl">
                    <Avatar className="size-12">
                        <AvatarImage src="" />
                        <AvatarFallback>{data.name.slice(0, 2).toUpperCase()}</AvatarFallback>
                    </Avatar>

                    <Separator orientation="vertical" />

                    <Link to={`${paths.channels}/${data.id}`}>
                        <p className="text-gray-700 text-2xl font-bold">{data.name}</p>
                    </Link>
                </article>
            )}

            {/* Outline variant: compact card without border */}
            {variant === 'outline' && (
                <article key={data.id} className="flex gap-2 items-center p-1">
                    <Avatar className="size-8">
                        <AvatarImage src="" />
                        <AvatarFallback className="text-sm">{data.name.slice(0, 2).toUpperCase()}</AvatarFallback>
                    </Avatar>

                    <Link to={`${paths.channels}/${data.id}`}>
                        <p className="text-gray-800 text-xl font-bold">{data.name}</p>
                    </Link>
                </article>
            )}
        </>
    );
};

import type { FC } from 'react';
import { Avatar, AvatarFallback, AvatarImage, Separator } from '@/components';
import { Link } from 'react-router';
import type { ChannelType } from '@/types/channeInterface';
import { paths } from '@/constants/constans';

interface ChatArticleProps {
    data: ChannelType;
}

export const ChatArticle: FC<ChatArticleProps> = ({ data }) => {
    return (
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
    );
};

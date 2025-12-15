import { Button } from '@/components';
import { paths } from '@/constants/constans';
import type { FC } from 'react';
import { Link } from 'react-router';

export const NotFoundPage: FC = () => {
    return (
        <section className="h-[700px]flex flex-col gap-4 justify-center items-center">
            <h1 className="text-3xl font-bold text-neutral-800">Page not found</h1>
            <Link to={paths.home}>
                <Button>Return to home page</Button>
            </Link>
        </section>
    );
};

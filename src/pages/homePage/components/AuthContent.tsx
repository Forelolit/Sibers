import { Button } from '@/components';
import { paths } from '@/constants/constans';
import type { FC } from 'react';
import { Link } from 'react-router';

export const AuthContent: FC = () => (
    <div className="flex flex-col gap-4">
        <div>
            <h1 className="text-gray-800 text-3xl font-bold">Manage your channels</h1>
            <p className="text-gray-500 text-base mt-1">Create a new communication space or join an existing one.</p>
        </div>

        <div className="flex gap-4 items-center">
            <Link to={paths.channels}>
                <Button>Go to channel</Button>
            </Link>
        </div>
    </div>
);

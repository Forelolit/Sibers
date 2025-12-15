import { paths } from '@/constants/constans';
import type { FC } from 'react';
import { Link } from 'react-router';
import { Button } from '@/components/index';

export const RegisterRequired: FC = () => {
    return (
        <div className="flex min-h-screen items-center justify-center">
            <div className="w-full max-w-sm rounded-2xl bg-white p-8 shadow-lg text-center">
                <h1 className="mb-2 text-2xl font-semibold text-gray-800">Authentication Required</h1>

                <p className="mb-6 text-sm text-gray-500">You must be signed in to access this app.</p>

                <Link to={paths.login} className="block">
                    <Button className="w-full">Sign in</Button>
                </Link>
            </div>
        </div>
    );
};

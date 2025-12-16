import { paths } from '@/constants/constans';
import type { FC } from 'react';
import { Link } from 'react-router';
import { Button } from '@/components/index';

/**
 * RegisterRequired component
 * Displays a full-screen message prompting the user to sign in.
 * Includes a button that navigates to the login page.
 */

export const RegisterRequired: FC = () => {
    return (
        <div className="flex min-h-screen items-center justify-center">
            {/* Card container for authentication message */}
            <div className="w-full max-w-sm rounded-2xl bg-white p-8 shadow-lg text-center">
                <h1 className="mb-2 text-2xl font-semibold text-gray-800">Authentication Required</h1>

                <p className="mb-6 text-sm text-gray-500">You must be signed in to access this app.</p>

                {/* Button linking to login page */}
                <Link to={paths.login} className="block">
                    <Button className="w-full">Sign in</Button>
                </Link>
            </div>
        </div>
    );
};

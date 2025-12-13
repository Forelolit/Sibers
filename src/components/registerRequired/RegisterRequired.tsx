import { paths } from '@/constants/constans';
import type { FC } from 'react';
import { Link } from 'react-router';
import { Button } from '@/components/index';

export const RegisterRequired: FC = () => {
    return (
        <div className="grid gap-4">
            <h1 className="text-gray-700 text-3xl font-bold">You need to register or login for chatting</h1>

            <div className="grid gap-2 grid-cols-2">
                <Link to={paths.register}>
                    <Button className="w-full">Registration</Button>
                </Link>

                <Link to={paths.login}>
                    <Button className="w-full" variant="outline">
                        Login
                    </Button>
                </Link>
            </div>
        </div>
    );
};

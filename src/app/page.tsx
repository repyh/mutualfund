'use client';

import { useState, useEffect, Suspense } from 'react';
import Main from '@/app/sections/Main';
import LoadingSection from '@/app/sections/Loading';

import { SessionProvider } from 'next-auth/react';

export default function Home() {
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(false);
    }, [])

    return (
        <div className="w-full flex items-center justify-center scroll-smooth">
            <Main />
        </div>
    );
}

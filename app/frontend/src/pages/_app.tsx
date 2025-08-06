import React, { useEffect } from 'react';
import type { AppProps } from 'next/app';
import { useRouter } from 'next/router';
import AuthProvider, { useAuth } from '../hooks/authProvider';
import NavBar from '../components/navbar';
import Layout from '../components/layout';

const publicPaths = ['/', '/login', '/register'];

function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { token, loading } = useAuth();

  useEffect(() => {
    if (!loading && !token && !publicPaths.includes(router.pathname)) {
      router.push('/login');
    }
  }, [loading, token, router]);

  if (loading) return <div>Loading...</div>;

  if (!token && !publicPaths.includes(router.pathname)) return null;

  return <>{children}</>;
}

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <AuthProvider>
      <AuthGuard>
        <Layout>
        <Component {...pageProps} />
        </Layout>
      </AuthGuard>
    </AuthProvider>
  );
}

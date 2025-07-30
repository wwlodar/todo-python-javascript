import { useRouter } from 'next/router';
import { ReactNode, useEffect } from 'react';
import { useAuth}  from '../hooks/authProvider';

interface Props {
  children: ReactNode;
}

export default function ProtectedRoute({ children }: Props) {
  const router = useRouter();
  const { token, loading } = useAuth();

  useEffect(() => {
    if (!loading && !token) {
      router.push('/login');
    }
  }, [token, loading, router]);

  if (loading || !token) return <p>Loading...</p>;

  return <>{children}</>;
}

import { GetServerSidePropsContext, GetServerSidePropsResult } from 'next';

export function requireAuth(
  gssp: (context: GetServerSidePropsContext) => Promise<GetServerSidePropsResult<any>>
) {
  return async (context: GetServerSidePropsContext) => {
    const { req } = context;
    const token = req.cookies['auth-token'];
    const isAuthenticated = token === 'valid-token';

    if (!isAuthenticated) {
      return {
        redirect: {
          destination: '/login',
          permanent: false,
        },
      };
    }

    return await gssp(context);
  };
}
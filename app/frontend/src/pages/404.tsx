// pages/404.tsx
import React from 'react';
import Link from 'next/link';

const Custom404: React.FC = () => {
  return (
    <div style={{ textAlign: 'center', marginTop: '5rem' }}>
      <h1>404 - Page Not Found</h1>
      <p>Sorry, we couldn't find the page you're looking for.</p>
      <Link href="/">
        <a style={{ color: 'blue', textDecoration: 'underline' }}>Go back home</a>
      </Link>
    </div>
  );
};

export default Custom404;

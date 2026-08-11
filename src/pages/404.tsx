import React from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Layout from '@/components/layout/Layout';

const NotFoundPage: React.FC = () => {
  return (
    <>
      <Head>
        <title>Page not found | Quantum Computing Club, IIT Indore</title>
        <meta name="robots" content="noindex" />
      </Head>
      <Layout isHomePage={false}>
        <section
          style={{
            minHeight: '60vh',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            padding: '4rem 2rem',
            maxWidth: 640,
            margin: '0 auto',
          }}
        >
          <p
            style={{
              fontFamily: "'IBM Plex Mono', monospace",
              color: '#0f62fe',
              fontSize: '0.85rem',
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              marginBottom: '1rem',
            }}
          >
            Error 404
          </p>
          <h1
            style={{
              fontFamily: "'IBM Plex Sans', sans-serif",
              fontWeight: 600,
              fontSize: 'clamp(2rem, 5vw, 3rem)',
              margin: '0 0 1rem',
              color: '#161616',
            }}
          >
            This state doesn&apos;t exist.
          </h1>
          <p style={{ color: '#525252', fontSize: '1.1rem', lineHeight: 1.6, marginBottom: '2rem' }}>
            The page you&apos;re looking for has either moved or was never here &mdash;
            like measuring a qubit and finding it collapsed to the wrong basis.
          </p>
          <div>
            <Link
              href="/"
              style={{
                display: 'inline-block',
                background: '#0f62fe',
                color: '#fff',
                padding: '0.95rem 1.5rem',
                textDecoration: 'none',
                fontWeight: 500,
              }}
            >
              Back to home &rarr;
            </Link>
          </div>
        </section>
      </Layout>
    </>
  );
};

export default NotFoundPage;

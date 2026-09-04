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
        <section className="mx-auto flex min-h-[60vh] max-w-[640px] flex-col justify-center px-8 py-16">
          <p className="mb-4 font-plexMono text-[0.85rem] uppercase tracking-[0.08em] text-ibm-blue">
            Error 404
          </p>
          <h1 className="m-0 mb-4 font-plexSans text-[clamp(2rem,5vw,3rem)] font-semibold text-ibm-black">
            This state doesn&apos;t exist.
          </h1>
          <p className="mb-8 text-[1.1rem] leading-[1.6] text-ibm-gray-70">
            The page you&apos;re looking for has either moved or was never here &mdash;
            like measuring a qubit and finding it collapsed to the wrong basis.
          </p>
          <div>
            <Link
              href="/"
              className="inline-block bg-ibm-blue px-6 py-[0.95rem] font-medium text-white no-underline"
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

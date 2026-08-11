import React from "react";
import Head from "next/head";
import Layout from "@/components/layout/Layout";
import Team from "@/components/content/Team";

const TeamPage: React.FC = () => {
  return (
    <div className="homepage">
      <Head>
        <title>Our Team | Quantum Computing Club, IIT Indore</title>
        <meta
          name="description"
          content="Meet the leadership and core team behind the Quantum Computing Club at IIT Indore."
        />
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
      </Head>
      <Layout isHomePage={false}>
        <Team />
      </Layout>
    </div>
  );
};

export default TeamPage;

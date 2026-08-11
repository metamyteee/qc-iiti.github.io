import React from "react";
import Head from "next/head";
import Layout from "@/components/layout/Layout";
import HeroSection from "@/components/content/HeroSection";

const HomePage: React.FC = () => {
  return (
    <div className="homepage">
      <Head>
        <title>Quantum Computing Club | IIT Indore</title>
        <meta
          name="description"
          content="QC IITI is a student-led community at IIT Indore advancing quantum computation and information theory through projects, resources, and events."
        />
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
      </Head>
      <Layout isHomePage={true}>
        <HeroSection />
      </Layout>
    </div>
  );
};

export default HomePage;

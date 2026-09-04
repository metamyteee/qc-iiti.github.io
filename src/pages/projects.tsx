import React from 'react';
import Head from 'next/head';
import Layout from '@/components/layout/Layout';

import fs from 'fs';
import path from 'path';
import Papa from 'papaparse';

type Project = {
  id: string;
  title: string;
  description: string;
  members: string;
  tags: string;
  github_url?: string;
  demo_url?: string;
};

interface ProjectsPageProps {
  projects: Project[];
}

const ProjectsPage: React.FC<ProjectsPageProps> = ({ projects }) => {
  return (
    <>
      <Head>
        <title>Projects | Quantum Computing Club, IIT Indore</title>
        <meta
          name="description"
          content="A showcase of quantum computing projects built by members of the QC Club at IIT Indore."
        />
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
      </Head>
      <Layout isHomePage={false}>
        <div>
          <section className="mx-auto max-w-[1200px] border-b border-ibm-gray-20 bg-ibm-gray-10 px-8 pb-16 pt-20 text-left text-ibm-black">
            <h1 className="mb-2 font-plexSans text-[clamp(2rem,4vw,2.75rem)] font-semibold tracking-[-0.01em]">
              Our Innovations
            </h1>
            <p className="text-[1.1rem] text-ibm-gray-70">
              A showcase of projects built by members of the QC Club.
            </p>
          </section>

          {projects.length === 0 && (
            <p className="mx-auto max-w-[1200px] px-8 pt-12 text-center text-base text-ibm-gray-70">
              No projects listed yet &mdash; check back soon, or be the first to add one!
            </p>
          )}

          {projects.length > 0 && (
            <main className="mx-auto grid max-w-[1200px] grid-cols-[repeat(auto-fit,minmax(320px,1fr))] gap-px border border-t-0 border-ibm-gray-20 bg-ibm-gray-20 p-0">
              {projects.map((project) => (
                <div
                  key={project.id}
                  className="flex flex-col border-0 bg-white p-8 text-ibm-black transition-colors duration-150 ease-in-out hover:bg-ibm-gray-10"
                >
                  <div className="mb-4 flex flex-wrap gap-2">
                    {/* Added a safety check for project.tags to handle auto-added data */}
                    {project.tags &&
                      project.tags.split(',').map(
                        (tag, index) =>
                          tag.trim() && (
                            <span
                              key={`${project.id}-${index}`}
                              className="bg-[#edf5ff] px-[0.65rem] py-[0.2rem] font-plexMono text-[0.75rem] font-semibold text-[#0043ce]"
                            >
                              {tag.trim()}
                            </span>
                          )
                      )}
                  </div>
                  <h3 className="mb-2 mt-2 font-plexSans text-[1.3rem] font-semibold text-ibm-black">
                    {project.title}
                  </h3>
                  <p className="flex-grow text-[0.95rem] leading-[1.6] text-ibm-gray-70">
                    {project.description}
                  </p>
                  <div className="mt-5 flex gap-6">
                    {project.github_url && (
                      <a
                        href={project.github_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[0.9rem] font-semibold text-ibm-blue no-underline hover:text-ibm-blue-hover hover:underline"
                      >
                        GitHub Repo
                      </a>
                    )}
                    {project.demo_url && (
                      <a
                        href={project.demo_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[0.9rem] font-semibold text-ibm-blue no-underline hover:text-ibm-blue-hover hover:underline"
                      >
                        Live Demo
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </main>
          )}

          <section className="mx-auto max-w-[1200px] bg-ibm-gray-10 px-8 py-16 text-left">
            <h2 className="font-plexSans text-[1.75rem] font-semibold text-ibm-black">
              Have a Project to Share?
            </h2>
            <p className="mb-6 max-w-[40rem] text-ibm-gray-70">
              To add your project, create a new branch and update the projects.csv file or just add it to our GitHub Org!
            </p>
            <a
              href="https://github.com/qc-iiti/qc-iiti.github.io/issues"
              className="inline-block bg-ibm-blue px-6 py-[0.9rem] font-medium text-white no-underline transition-colors duration-150 ease-in-out hover:bg-ibm-blue-hover"
            >
              Learn How
            </a>
          </section>
        </div>
      </Layout>
    </>
  );
};

export async function getStaticProps() {
  // 1. Fetch CSV Data (Featured/Manual Projects)
  const filePath = path.join(process.cwd(), 'src', 'data', 'projects.csv');
  const fileContent = fs.readFileSync(filePath, 'utf8');
  const { data: csvProjects } = Papa.parse(fileContent, { header: true, skipEmptyLines: true });

  // 2. Define the exact sub-paths for the academic years
  const yearFolders = ['AY24', 'AY25'];
  let autoProjects: Project[] = [];

  // GITHUB_TOKEN is optional — the repo is public, so unauthenticated
  // requests work fine (just with a lower rate limit). Only attach the
  // header when a token is actually configured, so we never send a
  // literal "Bearer undefined".
  const authHeaders: Record<string, string> = {
    Accept: 'application/vnd.github.v3+json',
  };
  if (process.env.GITHUB_TOKEN) {
    authHeaders.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
  }

  try {
    // We iterate through both folders to collect projects
    for (const year of yearFolders) {
      const response = await fetch(
        `https://api.github.com/repos/qc-iiti/Projects/contents/projects/${year}?ref=main`,
        { headers: authHeaders }
      );

      if (!response.ok) {
        console.warn(`GitHub API returned ${response.status} for ${year}; skipping.`);
        continue;
      }

      const contents = await response.json();

      if (Array.isArray(contents)) {
        const mapped = contents
          .filter(item => item.type === 'file'&& item.name.toLowerCase().endsWith('.md'))
          .map((item: any) => ({
            id: `gh-${item.sha}`,
            title: item.name.replace(/\.md$/i, '').replace(/-/g, ' '), // "variational-eigensolver" -> "variational eigensolver"
            description: `Project developed during the ${year} session.`,
            members: "QC Club Members",
            tags: `Quantum, ${year}`, // Automatically tags it with AY24 or AY25
            github_url: item.html_url,
          }));

        autoProjects = [...autoProjects, ...mapped];
      }
    }
  } catch (error) {
    console.error("Error fetching nested GitHub projects:", error);
  }

  return {
    props: {
      // Merge CSV first, then the auto-fetched projects
      projects: [...(csvProjects as Project[]), ...autoProjects],
    },
    // NOTE: no `revalidate` here — ISR isn't supported when the site is
    // statically exported for GitHub Pages (`output: 'export'`). The
    // GitHub-sourced project list is refreshed on every rebuild instead.
  };
}

export default ProjectsPage;

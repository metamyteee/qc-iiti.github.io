import React, { useEffect, useState, FC } from 'react';
import Papa from 'papaparse';

// --- INTERFACES ---
interface Member {
  initials: string;
  name: string;
  role: string;
  team_title: string;
}

interface CsvRow {
  name: string;
  role: string;
  initials: string;
  team_title: string;
}

const MOCK_CSV_DATA = `name,role,initials,team_title
Jane Doe,President,JD,Executive
John Smith,Co-President,JS,Executive
Anya Taylor,Head of Development,AT,Core
Marcus Chen,Marketing Lead,MC,Volunteer
Elara Vance,Community Manager,EV,Volunteer
Leo Johnson,Financial Officer,LJ,Executive`;

// Preferred display order for team groups; anything else falls back
// to alphabetical order after these. Matching is prefix-based so
// sub-groups like "Core I", "Core II", "Core III" in the CSV all
// group together under "Core" instead of splintering into separate,
// oddly-ordered sections.
const GROUP_ORDER = ['Executive', 'Core', 'Volunteer'];

const groupRank = (name: string): number => {
  const index = GROUP_ORDER.findIndex((g) => name.startsWith(g));
  return index === -1 ? GROUP_ORDER.length : index;
};

const MemberCard: FC<{ member: Member }> = ({ member }) => {
  return (
    <div className="flex min-h-[180px] w-full flex-col items-start bg-white p-7 text-left text-ibm-black transition-colors duration-150 ease-in-out hover:bg-ibm-gray-10">
      <div className="mb-6 flex h-14 w-14 items-center justify-center bg-ibm-blue font-plexMono text-[1.15rem] font-semibold text-white">
        {member.initials}
      </div>
      <div>
        <h3 className="m-0 text-[1.2rem] font-semibold text-ibm-black">{member.name}</h3>
        <p className="mt-[0.4rem] text-[0.95rem] font-normal text-ibm-gray-70">{member.role}</p>
      </div>
    </div>
  );
};

const TeamPage: FC = () => {
  const [teamData, setTeamData] = useState<Member[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      let csvText = MOCK_CSV_DATA;

      try {
        const response = await fetch('/team.csv');
        if (response.ok) {
          csvText = await response.text();
        } else {
          console.warn("Could not fetch 'team.csv', using mock data for demonstration.");
        }

        Papa.parse<CsvRow>(csvText, {
          header: true,
          skipEmptyLines: true,
          complete: (results) => {
            const allMembers: Member[] = results.data.map((row) => ({
              initials: row.initials,
              name: row.name,
              role: row.role,
              team_title: row.team_title || 'Team',
            }));

            setTeamData(allMembers.sort((a, b) => a.name.localeCompare(b.name)));
          },
          error: (err: Error) => {
            throw new Error(err.message);
          },
        });
      } catch (e: any) {
        setError(`Failed to process team data. Please ensure 'team.csv' is correctly formatted. Error: ${e.message}`);
        console.error(e);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Group members by their normalized team bucket ("Core I" / "Core II"
  // all collapse into "Core"), ordered by GROUP_ORDER first, then
  // alphabetically for any groups that aren't in that list.
  const groupedTeam = teamData.reduce<Record<string, Member[]>>((acc, member) => {
    const bucket = GROUP_ORDER.find((g) => member.team_title.startsWith(g)) || member.team_title;
    (acc[bucket] ||= []).push(member);
    return acc;
  }, {});

  const groupNames = Object.keys(groupedTeam).sort((a, b) => {
    const ai = groupRank(a);
    const bi = groupRank(b);
    if (ai !== bi) return ai - bi;
    return a.localeCompare(b);
  });

  return (
    <div className="flex w-full flex-col items-center bg-white p-0 font-plexSans text-ibm-black">
      <div className="w-full border-b border-ibm-gray-20 bg-ibm-gray-10 px-4 pb-12 pt-14 text-center md:pb-16 md:pt-20">
        <p className="mx-auto mb-3 max-w-[600px] font-plexMono text-[0.85rem] uppercase tracking-[0.06em] text-ibm-blue">
          Our team
        </p>
        <h1 className="m-0 text-[2rem] font-semibold tracking-[-0.01em] md:text-[2.75rem]">
          Club Leadership and Core Team
        </h1>
      </div>

      <section className="w-full max-w-[1200px] px-6 pb-20 pt-12">
        {loading && <p className="text-center">Loading team members...</p>}
        {error && <p className="text-center font-bold text-ibm-red">{error}</p>}

        {!loading &&
          !error &&
          groupNames.map((groupName) => (
            <div className="mb-12 last:mb-0" key={groupName}>
              <h2 className="mb-5 border-b-2 border-ibm-blue pb-3 text-[1.4rem] font-semibold text-ibm-black">
                {groupName}
              </h2>
              <div className="grid grid-cols-[repeat(auto-fit,minmax(260px,1fr))] justify-items-stretch gap-px border border-ibm-gray-20 bg-ibm-gray-20">
                {groupedTeam[groupName].map((member) => (
                  <MemberCard key={`${groupName}-${member.name}`} member={member} />
                ))}
              </div>
            </div>
          ))}
      </section>
    </div>
  );
};

export default TeamPage;

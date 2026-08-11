import React, { useEffect, useState, FC } from 'react';
import Papa from 'papaparse';

const TeamPageStyles = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:ital,wght@0,400;0,500;0,600;0,700;1,400&family=IBM+Plex+Mono:wght@400;500&display=swap');

    .pageContainer {
      color: #161616;
      font-family: 'IBM Plex Sans', sans-serif;
      display: flex;
      flex-direction: column;
      align-items: center;
      width: 100%;
      padding: 0;
      box-sizing: border-box;
      background-color: #ffffff;
    }

    .titleBanner {
      width: 100%;
      background-color: #f4f4f4;
      color: #161616;
      text-align: center;
      padding: 5rem 1rem 4rem;
      margin-bottom: 0;
      border-bottom: 1px solid #e0e0e0;
    }

    .titleBanner h1 {
      font-size: 2.75rem;
      font-weight: 600;
      margin: 0;
      letter-spacing: -0.01em;
    }

    .titleBanner p {
      font-family: 'IBM Plex Mono', monospace;
      font-size: 0.85rem;
      text-transform: uppercase;
      letter-spacing: 0.06em;
      color: #0f62fe;
      max-width: 600px;
      margin: 0 auto 0.75rem;
    }

    .teamSection {
      width: 100%;
      max-width: 1200px;
      padding: 3rem 1.5rem 5rem;
    }

    .teamGroup {
      margin-bottom: 3rem;
    }
    .teamGroup:last-child {
      margin-bottom: 0;
    }

    .teamGroupTitle {
      font-size: 1.4rem;
      font-weight: 600;
      color: #161616;
      margin: 0 0 1.25rem;
      padding-bottom: 0.75rem;
      border-bottom: 2px solid #0f62fe;
    }

    .memberGrid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
      gap: 1px;
      background-color: #e0e0e0;
      border: 1px solid #e0e0e0;
      justify-items: stretch;
    }

    /* Member Card: flat, square-cornered IBM-style tile */
    .memberCard {
      width: 100%;
      min-height: 180px;
      padding: 1.75rem;
      box-sizing: border-box;
      background: #ffffff;
      color: #161616;
      border-radius: 0;
      transition: background-color 0.15s ease;
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      text-align: left;
    }

    .memberCard:hover {
      background-color: #f4f4f4;
    }

    .memberAvatar {
      width: 56px;
      height: 56px;
      border-radius: 0;
      background: #0f62fe;
      color: #fff;
      display: flex;
      align-items: center;
      justify-content: center;
      font-family: 'IBM Plex Mono', monospace;
      font-size: 1.15rem;
      font-weight: 600;
      margin-bottom: 1.5rem;
    }

    .memberInfo h3 {
      margin: 0;
      font-size: 1.2rem;
      font-weight: 600;
      color: #161616;
    }

    .memberInfo p {
      margin: 0.4rem 0 0;
      font-size: 0.95rem;
      color: #525252;
      font-weight: 400;
    }

    @media (max-width: 768px) {
      .titleBanner h1 {
        font-size: 2rem;
      }
      .titleBanner {
        padding: 3.5rem 1rem 3rem;
      }
    }
  `}</style>
);

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
    <div className="memberCard">
      <div className="memberAvatar">{member.initials}</div>
      <div className="memberInfo">
        <h3>{member.name}</h3>
        <p>{member.role}</p>
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
    <>
      <TeamPageStyles />
      <div className="pageContainer">
        <div className="titleBanner">
          <p>Our team</p>
          <h1>Club Leadership and Core Team</h1>
        </div>

        <section className="teamSection">
          {loading && <p style={{ textAlign: 'center' }}>Loading team members...</p>}
          {error && <p style={{ color: '#da1e28', fontWeight: 'bold', textAlign: 'center' }}>{error}</p>}

          {!loading && !error && groupNames.map((groupName) => (
            <div className="teamGroup" key={groupName}>
              <h2 className="teamGroupTitle">{groupName}</h2>
              <div className="memberGrid">
                {groupedTeam[groupName].map((member) => (
                  <MemberCard key={`${groupName}-${member.name}`} member={member} />
                ))}
              </div>
            </div>
          ))}
        </section>
      </div>
    </>
  );
};

export default TeamPage;

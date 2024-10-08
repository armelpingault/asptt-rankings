'use client';
import { useEffect, useState } from 'react';
import Slider from 'react-slick';

interface Ranking {
  position: string;
  team: string;
  points: string;
  matchesPlayed: string;
  wins: string;
  draws: string;
  losses: string;
  goalsFor: string;
  goalsAgainst: string;
  goalDifference: string;
}

interface RankingsResponse {
  title: string;
  rankings: Ranking[];
}

export default function Home() {
  const [rankings, setRankings] = useState<RankingsResponse[] | null>(null);

  // useEffect(() => {
  //   const fetchRankings = async () => {
  //     try {
  //       const response = await fetch('/api/fetchRankings');
  //       const data: RankingsResponse[] = await response.json();
  //       setRankings(data);
  //     } catch (error) {
  //       console.error('Error fetching rankings:', error);
  //     }
  //   };

  //   fetchRankings();
  // }, []);

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000, // Change slides every 3 seconds
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      {rankings ? (
        <Slider {...settings}>
          {rankings.map((rankingGroup, groupIndex) => (
            <div key={groupIndex} className="min-w-full">
              <h1 className="text-3xl font-bold mb-6 text-center">{rankingGroup.title}</h1> {/* Display title from <h1> */}
              <table className="min-w-full bg-white shadow-md rounded-lg">
                <thead>
                  <tr className="bg-blue-600 text-white">
                    <th className="p-4 text-left">Position</th>
                    <th className="p-4 text-left">Équipe</th>
                    <th className="p-4 text-left">Points</th>
                    <th className="p-4 text-left">Joués</th>
                    <th className="p-4 text-left">Victoires</th>
                    <th className="p-4 text-left">Nuls</th>
                    <th className="p-4 text-left">Défaites</th>
                    <th className="p-4 text-left">Buts Pour</th>
                    <th className="p-4 text-left">Buts Contre</th>
                    <th className="p-4 text-left">Différence de Buts</th>
                  </tr>
                </thead>
                <tbody>
                  {rankingGroup.rankings.map((ranking, index) => (
                    <tr
                      key={index}
                      className={`border-t ${/^AS PTT CAEN/i.test(ranking.team) ? 'bg-yellow-200 font-bold' : 'bg-white'} hover:bg-gray-100 transition-colors duration-200`}
                    >
                      <td className="p-4">{ranking.position}</td>
                      <td className="p-4">{ranking.team}</td>
                      <td className="p-4">{ranking.points}</td>
                      <td className="p-4">{ranking.matchesPlayed}</td>
                      <td className="p-4">{ranking.wins}</td>
                      <td className="p-4">{ranking.draws}</td>
                      <td className="p-4">{ranking.losses}</td>
                      <td className="p-4">{ranking.goalsFor}</td>
                      <td className="p-4">{ranking.goalsAgainst}</td>
                      <td className="p-4">{ranking.goalDifference}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ))}
        </Slider>
      ) : (
        <p className="text-center text-gray-500">Chargement...</p>
      )}
    </div>
  );
}

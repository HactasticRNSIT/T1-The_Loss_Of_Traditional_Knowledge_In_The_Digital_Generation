import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Trophy, RefreshCw } from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { useAuth } from '../../hooks/AuthContext';
import { getLeaderboard, type LeaderboardEntry } from '../../services/leaderboardService';

export const LeaderboardPage = () => {
  const { user } = useAuth();
  const [leaders, setLeaders] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      setLoading(true);
      const { data, error: err } = await getLeaderboard();
      if (err) setError(err);
      else setLeaders(data ?? []);
      setLoading(false);
    })();
  }, []);

  if (loading) {
    return (
      <div className="p-6 md:p-8 max-w-4xl mx-auto space-y-8 animate-pulse">
        <div className="flex flex-col items-center gap-4">
          <div className="w-20 h-20 rounded-full bg-earth-200 dark:bg-earth-800" />
          <div className="h-10 w-48 rounded-xl bg-earth-200 dark:bg-earth-800" />
        </div>
        <div className="space-y-4">{[1,2,3,4,5].map(i => <div key={i} className="h-20 rounded-2xl bg-earth-100 dark:bg-earth-800/50" />)}</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 flex flex-col items-center justify-center min-h-[50vh] gap-4">
        <p className="text-terracotta-600 text-lg">{error}</p>
        <button onClick={() => window.location.reload()} className="flex items-center gap-2 text-forest-600 font-semibold"><RefreshCw className="h-4 w-4" /> Retry</button>
      </div>
    );
  }

  return (
    <div className="p-6 md:p-8 max-w-4xl mx-auto space-y-8 pb-24">
      <div className="text-center space-y-4">
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', bounce: 0.5 }} className="mx-auto w-20 h-20 bg-yellow-100 dark:bg-yellow-900/50 rounded-full flex items-center justify-center shadow-inner">
          <Trophy className="h-10 w-10 text-yellow-500" />
        </motion.div>
        <h1 className="font-serif text-3xl md:text-4xl font-bold text-earth-900 dark:text-earth-50">Village Leaders</h1>
        <p className="text-earth-600 dark:text-earth-400 max-w-lg mx-auto">The most dedicated learners preserving our cultural heritage.</p>
      </div>

      {leaders.length === 0 ? (
        <Card className="p-12 text-center"><p className="text-earth-500 text-lg">No leaderboard data yet. Be the first!</p></Card>
      ) : (
        <div className="space-y-4 mt-12">
          {leaders.map((entry, idx) => {
            const rank = idx + 1;
            const isCurrent = user?.id === entry.id;
            return (
              <motion.div key={entry.id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: idx * 0.1 }}>
                <Card className={`flex items-center gap-4 p-4 md:p-6 transition-all ${isCurrent ? 'border-terracotta-400 shadow-md ring-1 ring-terracotta-400/50 bg-terracotta-50/50 dark:bg-terracotta-900/10' : ''}`}>
                  <div className={`w-8 font-bold text-lg text-center ${rank === 1 ? 'text-yellow-500' : rank === 2 ? 'text-gray-400' : rank === 3 ? 'text-orange-400' : 'text-earth-400'}`}>#{rank}</div>
                  <div className="relative">
                    {entry.avatar_url ? (
                      <img src={entry.avatar_url} alt={entry.name} className="w-12 h-12 rounded-full object-cover border-2 border-white dark:border-earth-800 shadow-sm" />
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-forest-200 dark:bg-forest-800 flex items-center justify-center border-2 border-white dark:border-earth-800 shadow-sm">
                        <span className="font-bold text-forest-600 dark:text-forest-400">{entry.name.charAt(0).toUpperCase()}</span>
                      </div>
                    )}
                    {rank === 1 && <div className="absolute -top-3 -right-2 text-xl">👑</div>}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-earth-900 dark:text-earth-100">{entry.name} {isCurrent && <span className="text-xs font-normal text-terracotta-600 ml-2">(You)</span>}</h3>
                    <p className="text-sm text-earth-500">Level {entry.level ?? 1}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-earth-900 dark:text-earth-100">{entry.xp_points.toLocaleString()}</p>
                    <p className="text-xs font-semibold text-earth-400 uppercase tracking-wide">XP</p>
                  </div>
                </Card>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
};

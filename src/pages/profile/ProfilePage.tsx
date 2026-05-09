import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Award, Flame, Star, BookOpen, RefreshCw } from 'lucide-react';
import { useAuth } from '../../hooks/AuthContext';
import { getAchievements, type Achievement } from '../../services/achievementService';
import { getAllModules } from '../../services/moduleService';

export const ProfilePage = () => {
  const { user, profile } = useAuth();
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [moduleCount, setModuleCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const [achRes, modRes] = await Promise.all([getAchievements(), getAllModules()]);
        if (achRes.error) throw new Error(achRes.error);
        setAchievements(achRes.data ?? []);
        setModuleCount((modRes.data ?? []).length);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load profile data.');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const displayName = profile?.name || user?.name || 'Traveler';
  const xp = profile?.xp_points ?? user?.x_points ?? 0;
  const level = profile?.level ?? user?.level ?? 1;
  const streak = profile?.streak ?? user?.streak ?? 0;
  const joinDate = user?.created_at ? new Date(user.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long' }) : '';

  const stats = [
    { label: 'Total XP', value: xp.toLocaleString(), icon: Star, color: 'text-yellow-600 dark:text-yellow-400', bg: 'bg-yellow-100 dark:bg-yellow-900/50' },
    { label: 'Day Streak', value: String(streak), icon: Flame, color: 'text-terracotta-600 dark:text-terracotta-400', bg: 'bg-terracotta-100 dark:bg-terracotta-900/50' },
    { label: 'Modules', value: String(moduleCount), icon: BookOpen, color: 'text-forest-600 dark:text-forest-400', bg: 'bg-forest-100 dark:bg-forest-900/50' },
    { label: 'Badges', value: String(achievements.length), icon: Award, color: 'text-earth-600 dark:text-earth-400', bg: 'bg-earth-100 dark:bg-earth-900/50' },
  ];

  if (loading) {
    return (
      <div className="p-6 md:p-8 max-w-5xl mx-auto space-y-8 animate-pulse">
        <div className="h-48 rounded-2xl bg-earth-100 dark:bg-earth-800/50" />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">{[1,2,3,4].map(i => <div key={i} className="h-32 rounded-2xl bg-earth-100 dark:bg-earth-800/50" />)}</div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">{[1,2,3,4].map(i => <div key={i} className="h-36 rounded-2xl bg-earth-100 dark:bg-earth-800/50" />)}</div>
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
    <div className="p-6 md:p-8 max-w-5xl mx-auto space-y-8 pb-24">
      {/* Profile Header */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <Card className="flex flex-col md:flex-row items-center gap-6 p-8 bg-gradient-to-br from-earth-50 to-white dark:from-earth-900/30 dark:to-earth-900/10">
          <div className="relative">
            <div className="h-32 w-32 rounded-full bg-forest-200 dark:bg-forest-800 flex items-center justify-center overflow-hidden border-4 border-white dark:border-earth-800 shadow-xl">
              {profile?.avatar_url ? (
                <img src={profile.avatar_url} alt="Avatar" className="w-full h-full object-cover" />
              ) : (
                <span className="text-4xl font-bold text-forest-600 dark:text-forest-400">{displayName.charAt(0).toUpperCase()}</span>
              )}
            </div>
            <div className="absolute -bottom-2 -right-2 bg-yellow-500 text-white font-bold h-10 w-10 rounded-full flex items-center justify-center border-2 border-white dark:border-earth-800 shadow-sm">
              L{level}
            </div>
          </div>
          <div className="flex-1 text-center md:text-left">
            <h1 className="font-serif text-3xl font-bold text-earth-900 dark:text-earth-50 mb-1">{displayName}</h1>
            {joinDate && <p className="text-earth-600 dark:text-earth-400 mb-4">Joined {joinDate}</p>}
            <div className="flex flex-wrap justify-center md:justify-start gap-2">
              <Badge variant="level">Level {level} Learner</Badge>
              <Badge variant="achievement">{achievements.length} Achievements</Badge>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((stat, idx) => (
          <motion.div key={idx} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 + idx * 0.05 }}>
            <Card className="text-center p-6 flex flex-col items-center justify-center h-full">
              <div className={`h-12 w-12 rounded-full ${stat.bg} ${stat.color} flex items-center justify-center mb-3`}>
                <stat.icon className="h-6 w-6" />
              </div>
              <p className="text-2xl font-bold text-earth-900 dark:text-earth-100">{stat.value}</p>
              <p className="text-sm font-semibold text-earth-500 uppercase tracking-wide">{stat.label}</p>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Achievements */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
        <h2 className="font-serif text-2xl font-bold text-earth-900 dark:text-earth-50 mb-6">Achievements</h2>
        {achievements.length === 0 ? (
          <Card className="p-8 text-center"><p className="text-earth-500">No achievements yet. Keep learning!</p></Card>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {achievements.map((ach) => (
              <Card key={ach.id} hoverable className="text-center p-6 border-earth-200 dark:border-earth-800">
                <div className="text-5xl mb-4">🏆</div>
                <h3 className="font-bold text-earth-900 dark:text-earth-100 mb-2">{ach.title}</h3>
                <p className="text-sm text-earth-600 dark:text-earth-400">{ach.description}</p>
              </Card>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
};

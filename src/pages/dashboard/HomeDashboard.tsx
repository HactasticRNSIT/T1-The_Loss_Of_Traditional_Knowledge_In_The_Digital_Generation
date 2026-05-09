import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { ProgressBar } from '../../components/ui/ProgressBar';
import { Play, Award, Flame, RefreshCw } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/AuthContext';
import { getAllModules, type LearningModule } from '../../services/moduleService';

export const HomeDashboard = () => {
  const navigate = useNavigate();
  const { user, profile } = useAuth();
  const [modules, setModules] = useState<LearningModule[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const { data, error: modErr } = await getAllModules();
        if (modErr) throw new Error(modErr);
        setModules(data ?? []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load dashboard data.');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const displayName = profile?.name || user?.name || 'Traveler';
  const xpPoints = profile?.xp_points ?? user?.x_points ?? 0;
  const streak = profile?.streak ?? user?.streak ?? 0;

  // Pick the first module as "continue learning" and the rest as "recommended"
  const continueModule = modules[0] ?? null;
  const recommendedModules = modules.slice(1, 4);

  if (loading) {
    return (
      <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-8">
        <div className="animate-pulse space-y-8">
          <div className="h-12 w-64 rounded-xl bg-earth-200 dark:bg-earth-800" />
          <div className="h-40 rounded-2xl bg-earth-100 dark:bg-earth-800/50" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map(i => <div key={i} className="h-48 rounded-2xl bg-earth-100 dark:bg-earth-800/50" />)}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 md:p-8 max-w-7xl mx-auto flex flex-col items-center justify-center min-h-[50vh] gap-4">
        <p className="text-terracotta-600 dark:text-terracotta-400 text-lg">{error}</p>
        <button onClick={() => window.location.reload()} className="flex items-center gap-2 text-forest-600 hover:text-forest-700 font-semibold">
          <RefreshCw className="h-4 w-4" /> Retry
        </button>
      </div>
    );
  }

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-8">
      {/* Welcome Header */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row md:items-end justify-between gap-4"
      >
        <div>
          <h1 className="font-serif text-4xl font-bold text-earth-900 dark:text-earth-50">Welcome back, {displayName}</h1>
          <p className="mt-2 text-earth-600 dark:text-earth-400">The village elders have new knowledge to share with you.</p>
        </div>
        <div className="flex gap-4">
          <Card className="flex items-center gap-3 p-4 shrink-0">
            <div className="rounded-full bg-yellow-100 p-2 dark:bg-yellow-900/50">
              <Award className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase text-earth-500">Total XP</p>
              <p className="text-xl font-bold text-earth-900 dark:text-earth-100">{xpPoints.toLocaleString()}</p>
            </div>
          </Card>
          <Card className="flex items-center gap-3 p-4 shrink-0">
            <div className="rounded-full bg-terracotta-100 p-2 dark:bg-terracotta-900/50">
              <Flame className="h-6 w-6 text-terracotta-600 dark:text-terracotta-400" />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase text-earth-500">Day Streak</p>
              <p className="text-xl font-bold text-earth-900 dark:text-earth-100">{streak}</p>
            </div>
          </Card>
        </div>
      </motion.div>

      {/* Continue Learning */}
      {continueModule && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <h2 className="font-serif text-2xl font-semibold text-earth-900 dark:text-earth-100 mb-4">Continue Learning</h2>
          <Card hoverable className="flex flex-col md:flex-row gap-6 items-center p-6 bg-gradient-to-r from-forest-50 to-white dark:from-forest-900/20 dark:to-earth-900/40" onClick={() => navigate(`/modules/${continueModule.id}`)}>
            <div className="flex-1 w-full space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Badge variant="category">{continueModule.difficulty}</Badge>
                  <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-forest-100/50 dark:bg-forest-900/50 border border-forest-200 dark:border-forest-800">
                    <Play className="h-3 w-3 text-forest-600 dark:text-forest-400" />
                    <span className="text-[10px] font-bold uppercase tracking-wider text-forest-700 dark:text-forest-300">Resume</span>
                  </div>
                </div>
                <Badge variant="xp">+{continueModule.xp_reward} XP</Badge>
              </div>
              <h3 className="font-serif text-2xl font-bold text-earth-900 dark:text-earth-100">{continueModule.title}</h3>
              <p className="text-earth-600 dark:text-earth-400 line-clamp-2 italic font-serif">"{continueModule.description}"</p>
              <div className="pt-2">
                <ProgressBar progress={0} variant="success" showLabel />
              </div>
            </div>
          </Card>
        </motion.div>
      )}

      {/* Recommended Modules */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-serif text-2xl font-semibold text-earth-900 dark:text-earth-100">Recommended for You</h2>
          <button onClick={() => navigate('/modules')} className="text-sm font-semibold text-forest-600 hover:text-forest-700 dark:text-forest-400">View All</button>
        </div>
        {recommendedModules.length === 0 ? (
          <Card className="p-8 text-center">
            <p className="text-earth-500 dark:text-earth-400">No modules available yet. Check back soon!</p>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recommendedModules.map((mod) => (
              <Card hoverable key={mod.id} className="flex flex-col gap-4 cursor-pointer" onClick={() => navigate(`/modules/${mod.id}`)}>
                <div className="flex-1 space-y-3">
                  <Badge variant="category">{mod.difficulty}</Badge>
                  <h3 className="font-serif text-lg font-bold text-earth-900 dark:text-earth-100">{mod.title}</h3>
                  <p className="text-sm text-earth-600 dark:text-earth-400">{mod.description}</p>
                </div>
                <ProgressBar progress={0} variant="warning" />
              </Card>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
};

import { useEffect, useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { ProgressBar } from '../../components/ui/ProgressBar';
import { Search, Filter, BookOpen, RefreshCw } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { getAllModules, type LearningModule } from '../../services/moduleService';

export const ModulesPage = () => {
  const navigate = useNavigate();
  const [modules, setModules] = useState<LearningModule[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    (async () => {
      setLoading(true);
      const { data, error: err } = await getAllModules();
      if (err) setError(err);
      else setModules(data ?? []);
      setLoading(false);
    })();
  }, []);

  const filtered = useMemo(() => {
    if (!searchQuery.trim()) return modules;
    const q = searchQuery.toLowerCase();
    return modules.filter(m => m.title.toLowerCase().includes(q) || m.description.toLowerCase().includes(q));
  }, [modules, searchQuery]);

  if (loading) {
    return (
      <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-8 animate-pulse">
        <div className="h-10 w-48 rounded-xl bg-earth-200 dark:bg-earth-800" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1,2,3,4,5,6].map(i => <div key={i} className="h-56 rounded-2xl bg-earth-100 dark:bg-earth-800/50" />)}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 md:p-8 max-w-7xl mx-auto flex flex-col items-center justify-center min-h-[50vh] gap-4">
        <p className="text-terracotta-600 text-lg">{error}</p>
        <button onClick={() => window.location.reload()} className="flex items-center gap-2 text-forest-600 font-semibold"><RefreshCw className="h-4 w-4" /> Retry</button>
      </div>
    );
  }

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="font-serif text-3xl font-bold text-earth-900 dark:text-earth-50">Learning Modules</h1>
          <p className="mt-2 text-earth-600 dark:text-earth-400">Discover and master the ways of the ancestors.</p>
        </div>
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-earth-400" />
            <input type="text" placeholder="Search knowledge..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="w-full rounded-xl border border-earth-200 bg-white/50 pl-10 pr-4 py-2 text-sm outline-none focus:border-earth-500 focus:ring-2 focus:ring-earth-500/20 dark:border-earth-700 dark:bg-earth-900/50 dark:text-earth-100" />
          </div>
          <button className="flex items-center justify-center rounded-xl border border-earth-200 bg-white/50 p-2.5 text-earth-600 hover:bg-earth-100 dark:border-earth-700 dark:bg-earth-900/50 dark:text-earth-300 dark:hover:bg-earth-800">
            <Filter className="h-4 w-4" />
          </button>
        </div>
      </div>
      {filtered.length === 0 && (
        <Card className="p-12 text-center"><p className="text-earth-500 text-lg">{searchQuery ? 'No modules match your search.' : 'No modules yet.'}</p></Card>
      )}
      <motion.div initial="hidden" animate="visible" variants={{ hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.1 } } }} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map(mod => (
          <motion.div key={mod.id} variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}>
            <Card hoverable className="h-full flex flex-col group" onClick={() => navigate(`/modules/${mod.id}`)}>
              <div className="flex-1 flex flex-col">
                <div className="flex items-center justify-between mb-4">
                  <Badge variant="category">{mod.difficulty}</Badge>
                  <Badge variant="xp">+{mod.xp_reward} XP</Badge>
                </div>
                <h3 className="font-serif text-xl font-bold text-earth-900 dark:text-earth-100 mb-2">{mod.title}</h3>
                <p className="text-sm text-earth-600 dark:text-earth-400 mb-6 flex-1">{mod.description}</p>
                <ProgressBar progress={0} showLabel variant="warning" />
              </div>
            </Card>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};

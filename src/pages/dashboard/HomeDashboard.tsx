import { motion } from 'framer-motion';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { ProgressBar } from '../../components/ui/ProgressBar';
import { Play, Award, Flame } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const HomeDashboard = () => {
  const navigate = useNavigate();

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-8">
      {/* Welcome Header */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row md:items-end justify-between gap-4"
      >
        <div>
          <h1 className="font-serif text-4xl font-bold text-earth-900 dark:text-earth-50">Welcome back, Traveler</h1>
          <p className="mt-2 text-earth-600 dark:text-earth-400">The village elders have new knowledge to share with you.</p>
        </div>
        <div className="flex gap-4">
          <Card className="flex items-center gap-3 p-4 shrink-0">
            <div className="rounded-full bg-yellow-100 p-2 dark:bg-yellow-900/50">
              <Award className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase text-earth-500">Total XP</p>
              <p className="text-xl font-bold text-earth-900 dark:text-earth-100">2,450</p>
            </div>
          </Card>
          <Card className="flex items-center gap-3 p-4 shrink-0">
            <div className="rounded-full bg-terracotta-100 p-2 dark:bg-terracotta-900/50">
              <Flame className="h-6 w-6 text-terracotta-600 dark:text-terracotta-400" />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase text-earth-500">Day Streak</p>
              <p className="text-xl font-bold text-earth-900 dark:text-earth-100">12</p>
            </div>
          </Card>
        </div>
      </motion.div>

      {/* Continue Learning */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <h2 className="font-serif text-2xl font-semibold text-earth-900 dark:text-earth-100 mb-4">Continue Learning</h2>
        <Card hoverable className="flex flex-col md:flex-row gap-6 items-center p-6 bg-gradient-to-r from-forest-50 to-white dark:from-forest-900/20 dark:to-earth-900/40" onClick={() => navigate('/lesson/1')}>
          <div className="h-32 w-full md:w-48 shrink-0 rounded-xl bg-forest-200 dark:bg-forest-800 overflow-hidden relative">
             <div className="absolute inset-0 bg-black/20 flex items-center justify-center transition-opacity hover:opacity-100 opacity-0 cursor-pointer">
               <div className="h-12 w-12 bg-white/30 backdrop-blur-md rounded-full flex items-center justify-center">
                 <Play className="h-6 w-6 text-white ml-1" />
               </div>
             </div>
          </div>
          <div className="flex-1 w-full space-y-3">
            <div className="flex items-center justify-between">
              <Badge variant="category">Herbal Medicine</Badge>
              <Badge variant="xp">+50 XP</Badge>
            </div>
            <h3 className="font-serif text-xl font-semibold text-earth-900 dark:text-earth-100">The Healing Properties of Neem</h3>
            <p className="text-sm text-earth-600 dark:text-earth-400 line-clamp-2">Learn about the ancient uses of the Neem tree in traditional remedies and modern applications.</p>
            <ProgressBar progress={65} variant="success" showLabel />
          </div>
        </Card>
      </motion.div>

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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            { title: "Traditional Farming", desc: "Sustainable agriculture practices.", progress: 0, category: "Agriculture" },
            { title: "Ancient Water Conservation", desc: "Stepwells and rainwater harvesting.", progress: 20, category: "Engineering" },
            { title: "Folk Stories & Morals", desc: "Oral traditions passed down generations.", progress: 100, category: "Culture" },
          ].map((mod, idx) => (
            <Card hoverable key={idx} className="flex flex-col gap-4 cursor-pointer" onClick={() => navigate('/modules/2')}>
              <div className="h-40 w-full rounded-xl bg-earth-200 dark:bg-earth-800" />
              <div className="flex-1 space-y-2">
                <Badge variant="category">{mod.category}</Badge>
                <h3 className="font-serif text-lg font-semibold text-earth-900 dark:text-earth-100">{mod.title}</h3>
                <p className="text-sm text-earth-600 dark:text-earth-400">{mod.desc}</p>
              </div>
              <ProgressBar progress={mod.progress} variant={mod.progress === 100 ? 'default' : 'warning'} />
            </Card>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

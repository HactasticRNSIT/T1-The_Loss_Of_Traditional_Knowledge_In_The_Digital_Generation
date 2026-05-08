import { motion } from 'framer-motion';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { ProgressBar } from '../../components/ui/ProgressBar';
import { Search, Filter, BookOpen } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const MOCK_MODULES = [
  { id: 1, title: 'Traditional Farming', desc: 'Sustainable agriculture practices based on ancient rhythms.', category: 'Agriculture', progress: 0, xp: 500, time: '2h' },
  { id: 2, title: 'Herbal Medicine', desc: 'The healing properties of native flora and roots.', category: 'Medicine', progress: 65, xp: 450, time: '3h' },
  { id: 3, title: 'Ancient Water Conservation', desc: 'Stepwells, rainwater harvesting, and desert survival.', category: 'Engineering', progress: 20, xp: 600, time: '4h' },
  { id: 4, title: 'Folk Stories & Morals', desc: 'Oral traditions passed down generations for moral education.', category: 'Culture', progress: 100, xp: 300, time: '1h' },
  { id: 5, title: 'Traditional Crafts', desc: 'Pottery, weaving, and sustainable material crafting.', category: 'Arts', progress: 0, xp: 700, time: '5h' },
  { id: 6, title: 'Astronomy & Navigation', desc: 'Reading the stars without modern instruments.', category: 'Science', progress: 0, xp: 800, time: '4h' },
];

export const ModulesPage = () => {
  const navigate = useNavigate();

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-8">
      {/* Header & Search */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="font-serif text-3xl font-bold text-earth-900 dark:text-earth-50">Learning Modules</h1>
          <p className="mt-2 text-earth-600 dark:text-earth-400">Discover and master the ways of the ancestors.</p>
        </div>
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-earth-400" />
            <input
              type="text"
              placeholder="Search knowledge..."
              className="w-full rounded-xl border border-earth-200 bg-white/50 pl-10 pr-4 py-2 text-sm outline-none focus:border-earth-500 focus:ring-2 focus:ring-earth-500/20 dark:border-earth-700 dark:bg-earth-900/50 dark:text-earth-100"
            />
          </div>
          <button className="flex items-center justify-center rounded-xl border border-earth-200 bg-white/50 p-2.5 text-earth-600 hover:bg-earth-100 dark:border-earth-700 dark:bg-earth-900/50 dark:text-earth-300 dark:hover:bg-earth-800">
            <Filter className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Grid */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={{
          hidden: { opacity: 0 },
          visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
        }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {MOCK_MODULES.map((mod) => (
          <motion.div
            key={mod.id}
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0 },
            }}
          >
            <Card hoverable className="h-full flex flex-col group" onClick={() => navigate(`/modules/${mod.id}`)}>
              <div className="flex-1 flex flex-col">
                <div className="flex items-center justify-between mb-4">
                  <Badge variant="category" className="w-fit">{mod.category}</Badge>
                  <div className="flex items-center gap-2">
                    <span className="flex items-center text-[10px] font-bold uppercase tracking-wider text-earth-500 dark:text-earth-400">
                      <BookOpen className="h-3 w-3 mr-1" /> {mod.time}
                    </span>
                    <Badge variant="xp" className="bg-terracotta-500/10 text-terracotta-600 border-terracotta-200 dark:bg-terracotta-500/20 dark:text-terracotta-400 dark:border-terracotta-800">
                      +{mod.xp} XP
                    </Badge>
                  </div>
                </div>
                <h3 className="font-serif text-xl font-bold text-earth-900 dark:text-earth-100 mb-2">{mod.title}</h3>
                <p className="text-sm text-earth-600 dark:text-earth-400 mb-6 flex-1">{mod.desc}</p>
                <ProgressBar progress={mod.progress} showLabel variant={mod.progress === 100 ? 'default' : 'warning'} />
              </div>
            </Card>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};

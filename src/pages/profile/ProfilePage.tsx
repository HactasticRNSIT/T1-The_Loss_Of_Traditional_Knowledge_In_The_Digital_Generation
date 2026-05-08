import { motion } from 'framer-motion';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Award, Flame, Star, BookOpen } from 'lucide-react';

const ACHIEVEMENTS = [
  { id: 1, title: 'First Harvest', desc: 'Complete your first agricultural lesson.', icon: '🌾' },
  { id: 2, title: 'Village Elder', desc: 'Reach level 10 and guide others.', icon: '👑' },
  { id: 3, title: 'Healer Apprentice', desc: 'Master the basics of Herbal Medicine.', icon: '🌿' },
  { id: 4, title: 'Water Saver', desc: 'Learn about ancient stepwells.', icon: '💧' },
];

export const ProfilePage = () => {
  return (
    <div className="p-6 md:p-8 max-w-5xl mx-auto space-y-8 pb-24">
      {/* Profile Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Card className="flex flex-col md:flex-row items-center gap-6 p-8 bg-gradient-to-br from-earth-50 to-white dark:from-earth-900/30 dark:to-earth-900/10">
          <div className="relative">
            <div className="h-32 w-32 rounded-full bg-forest-200 dark:bg-forest-800 flex items-center justify-center overflow-hidden border-4 border-white dark:border-earth-800 shadow-xl">
              <img src="https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&q=80&w=200" alt="Avatar" className="w-full h-full object-cover" />
            </div>
            <div className="absolute -bottom-2 -right-2 bg-yellow-500 text-white font-bold h-10 w-10 rounded-full flex items-center justify-center border-2 border-white dark:border-earth-800 shadow-sm">
              L5
            </div>
          </div>
          
          <div className="flex-1 text-center md:text-left">
            <h1 className="font-serif text-3xl font-bold text-earth-900 dark:text-earth-50 mb-1">Anand Traveler</h1>
            <p className="text-earth-600 dark:text-earth-400 mb-4">Joined in the season of monsoon, 2026</p>
            <div className="flex flex-wrap justify-center md:justify-start gap-2">
               <Badge variant="level">Level 5 Learner</Badge>
               <Badge variant="achievement">12 Achievements</Badge>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Total XP", value: "2,450", icon: Star, color: "text-yellow-600 dark:text-yellow-400", bg: "bg-yellow-100 dark:bg-yellow-900/50" },
          { label: "Day Streak", value: "12", icon: Flame, color: "text-terracotta-600 dark:text-terracotta-400", bg: "bg-terracotta-100 dark:bg-terracotta-900/50" },
          { label: "Modules", value: "4", icon: BookOpen, color: "text-forest-600 dark:text-forest-400", bg: "bg-forest-100 dark:bg-forest-900/50" },
          { label: "Badges", value: "8", icon: Award, color: "text-earth-600 dark:text-earth-400", bg: "bg-earth-100 dark:bg-earth-900/50" },
        ].map((stat, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 + idx * 0.05 }}
          >
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
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <h2 className="font-serif text-2xl font-bold text-earth-900 dark:text-earth-50 mb-6">Recent Achievements</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {ACHIEVEMENTS.map((ach) => (
            <Card key={ach.id} hoverable className="text-center p-6 border-earth-200 dark:border-earth-800">
              <div className="text-5xl mb-4 grayscale-[30%]">{ach.icon}</div>
              <h3 className="font-bold text-earth-900 dark:text-earth-100 mb-2">{ach.title}</h3>
              <p className="text-sm text-earth-600 dark:text-earth-400">{ach.desc}</p>
            </Card>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Play, Lock, CheckCircle2 } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';

export const ModuleDetailsPage = () => {
  const navigate = useNavigate();

  const lessons = [
    { id: 1, title: 'Introduction to Neem', status: 'completed', type: 'reading' },
    { id: 2, title: 'Extracting Neem Oil', status: 'unlocked', type: 'video' },
    { id: 3, title: 'Neem in Agriculture', status: 'locked', type: 'quiz' },
    { id: 4, title: 'Final Assessment', status: 'locked', type: 'quiz' },
  ];

  return (
    <div className="pb-24">
      {/* Hero Banner */}
      <div className="relative h-64 md:h-80 w-full bg-forest-900 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-earth-900/90 to-transparent z-10" />
        <img 
          src="https://images.unsplash.com/photo-1590412200988-a436970781fa?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80" 
          alt="Neem"
          className="absolute inset-0 w-full h-full object-cover opacity-50 mix-blend-overlay"
        />
        <div className="absolute top-4 left-4 z-20">
          <button 
            onClick={() => navigate('/modules')}
            className="flex items-center justify-center h-10 w-10 rounded-full bg-white/20 text-white backdrop-blur-md hover:bg-white/30 transition-colors"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
        </div>
        <div className="absolute bottom-0 left-0 w-full p-6 md:p-8 z-20">
          <div className="max-w-4xl mx-auto flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <Badge variant="category" className="bg-forest-500/30 text-white border-forest-400/50 mb-3 backdrop-blur-sm">Herbal Medicine</Badge>
              <h1 className="font-serif text-3xl md:text-5xl font-bold text-white mb-2">The Healing Properties of Neem</h1>
              <p className="text-earth-200 text-lg max-w-xl">Learn about the ancient uses of the Neem tree in traditional remedies and modern applications.</p>
            </div>
            <div className="flex items-center gap-4 bg-black/30 backdrop-blur-md p-4 rounded-xl border border-white/10 shrink-0">
              <div className="text-center">
                <p className="text-xs text-earth-300 uppercase font-semibold">Progress</p>
                <p className="text-xl font-bold text-white">25%</p>
              </div>
              <div className="h-10 w-px bg-white/20 mx-2" />
              <div className="text-center">
                <p className="text-xs text-earth-300 uppercase font-semibold">Reward</p>
                <p className="text-xl font-bold text-terracotta-400">+450 XP</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-6 md:p-8 mt-4">
        {/* Cultural Quote */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card className="bg-earth-100/50 dark:bg-earth-900/30 border-l-4 border-l-terracotta-500 rounded-l-none">
            <p className="font-serif text-lg italic text-earth-800 dark:text-earth-200">
              "The neem tree is the village pharmacy. Its shade cools the body, its leaves heal the skin, and its roots protect the soil."
            </p>
            <p className="text-sm font-semibold text-earth-500 mt-2">— Traditional Indian Proverb</p>
          </Card>
        </motion.div>

        {/* Journey/Timeline */}
        <div className="mt-12">
          <h2 className="font-serif text-2xl font-bold text-earth-900 dark:text-earth-50 mb-8">Your Journey</h2>
          
          <div className="space-y-6">
            {lessons.map((lesson, idx) => (
              <motion.div
                key={lesson.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="relative pl-10"
              >
                {/* Connecting Line */}
                {idx !== lessons.length - 1 && (
                  <div className={`absolute left-4 top-10 bottom-[-24px] w-0.5 ${lesson.status === 'completed' ? 'bg-forest-500' : 'bg-earth-200 dark:bg-earth-800'}`} />
                )}
                
                {/* Node Icon */}
                <div className={`absolute left-0 top-1 h-8 w-8 rounded-full border-2 flex items-center justify-center bg-white dark:bg-earth-950 z-10
                  ${lesson.status === 'completed' ? 'border-forest-500 text-forest-500' : 
                    lesson.status === 'unlocked' ? 'border-terracotta-500 text-terracotta-500 shadow-[0_0_10px_rgba(208,82,56,0.3)]' : 
                    'border-earth-300 text-earth-300 dark:border-earth-700 dark:text-earth-700'}`}
                >
                  {lesson.status === 'completed' && <CheckCircle2 className="h-5 w-5" />}
                  {lesson.status === 'unlocked' && <Play className="h-4 w-4 ml-0.5" />}
                  {lesson.status === 'locked' && <Lock className="h-4 w-4" />}
                </div>

                <Card 
                  hoverable={lesson.status !== 'locked'} 
                  className={`p-5 transition-all ${lesson.status === 'locked' ? 'opacity-60 grayscale' : ''} ${lesson.status === 'unlocked' ? 'border-terracotta-200 dark:border-terracotta-900/50' : ''}`}
                  onClick={() => lesson.status !== 'locked' && navigate(`/lesson/${lesson.id}`)}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-semibold text-earth-500 uppercase tracking-wide mb-1">Lesson {idx + 1}</p>
                      <h3 className="font-serif text-xl font-bold text-earth-900 dark:text-earth-100">{lesson.title}</h3>
                    </div>
                    {lesson.status === 'unlocked' && (
                      <Button size="sm">Start</Button>
                    )}
                    {lesson.status === 'completed' && (
                      <Button size="sm" variant="ghost">Review</Button>
                    )}
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

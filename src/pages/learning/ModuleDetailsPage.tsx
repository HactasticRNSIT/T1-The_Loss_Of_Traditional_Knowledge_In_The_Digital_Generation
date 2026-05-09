import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, useParams } from 'react-router-dom';
import { ChevronLeft, Play, Lock, CheckCircle2, RefreshCw } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { useAuth } from '../../hooks/AuthContext';
import { getModuleById, getModuleLessons, getModuleQuizzes, type LearningModule, type Lesson, type Quiz } from '../../services/moduleService';
import { getUserLessonProgress } from '../../services/lessonService';

interface LessonWithStatus extends Lesson {
  status: 'completed' | 'unlocked' | 'locked';
}

export const ModuleDetailsPage = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const [mod, setMod] = useState<LearningModule | null>(null);
  const [lessons, setLessons] = useState<LessonWithStatus[]>([]);
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    (async () => {
      setLoading(true);
      setError(null);
      try {
        const [modRes, lessRes, quizRes] = await Promise.all([
          getModuleById(id),
          getModuleLessons(id),
          getModuleQuizzes(id),
        ]);
        if (modRes.error) throw new Error(modRes.error);
        setMod(modRes.data);
        setQuizzes(quizRes.data ?? []);

        // Determine lesson statuses
        const rawLessons = lessRes.data ?? [];
        const lessonsWithStatus: LessonWithStatus[] = [];
        let prevCompleted = true;
        for (const lesson of rawLessons) {
          let status: 'completed' | 'unlocked' | 'locked' = 'locked';
          if (user) {
            const { data: prog } = await getUserLessonProgress(user.id, lesson.id);
            if (prog?.completed) {
              status = 'completed';
            } else if (prevCompleted) {
              status = 'unlocked';
            }
            prevCompleted = status === 'completed';
          } else {
            status = lessonsWithStatus.length === 0 ? 'unlocked' : 'locked';
            prevCompleted = false;
          }
          lessonsWithStatus.push({ ...lesson, status });
        }
        setLessons(lessonsWithStatus);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load module.');
      } finally {
        setLoading(false);
      }
    })();
  }, [id, user]);

  const completedCount = lessons.filter(l => l.status === 'completed').length;
  const progressPct = lessons.length > 0 ? Math.round((completedCount / lessons.length) * 100) : 0;

  if (loading) {
    return (
      <div className="pb-24 animate-pulse">
        <div className="h-64 w-full bg-earth-200 dark:bg-earth-800" />
        <div className="max-w-4xl mx-auto p-6 space-y-6">
          {[1,2,3].map(i => <div key={i} className="h-24 rounded-2xl bg-earth-100 dark:bg-earth-800/50" />)}
        </div>
      </div>
    );
  }

  if (error || !mod) {
    return (
      <div className="p-6 flex flex-col items-center justify-center min-h-[50vh] gap-4">
        <p className="text-terracotta-600 text-lg">{error || 'Module not found.'}</p>
        <button onClick={() => navigate('/modules')} className="flex items-center gap-2 text-forest-600 font-semibold"><RefreshCw className="h-4 w-4" /> Back to Modules</button>
      </div>
    );
  }

  return (
    <div className="pb-24">
      {/* Hero Banner */}
      <div className="relative h-64 md:h-80 w-full bg-forest-900 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-earth-900/90 to-transparent z-10" />
        <div className="absolute top-4 left-4 z-20">
          <button onClick={() => navigate('/modules')} className="flex items-center justify-center h-10 w-10 rounded-full bg-white/20 text-white backdrop-blur-md hover:bg-white/30 transition-colors">
            <ChevronLeft className="h-6 w-6" />
          </button>
        </div>
        <div className="absolute bottom-0 left-0 w-full p-6 md:p-8 z-20">
          <div className="max-w-4xl mx-auto flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <Badge variant="category" className="bg-forest-500/30 text-white border-forest-400/50 mb-3 backdrop-blur-sm">{mod.difficulty}</Badge>
              <h1 className="font-serif text-3xl md:text-5xl font-bold text-white mb-2">{mod.title}</h1>
              <p className="text-earth-200 text-lg max-w-xl">{mod.description}</p>
            </div>
            <div className="flex items-center gap-4 bg-black/30 backdrop-blur-md p-4 rounded-xl border border-white/10 shrink-0">
              <div className="text-center">
                <p className="text-xs text-earth-300 uppercase font-semibold">Progress</p>
                <p className="text-xl font-bold text-white">{progressPct}%</p>
              </div>
              <div className="h-10 w-px bg-white/20 mx-2" />
              <div className="text-center">
                <p className="text-xs text-earth-300 uppercase font-semibold">Reward</p>
                <p className="text-xl font-bold text-terracotta-400">+{mod.xp_reward} XP</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-6 md:p-8 mt-4">
        {/* Journey/Timeline */}
        <div className="mt-4">
          <h2 className="font-serif text-2xl font-bold text-earth-900 dark:text-earth-50 mb-8">Your Journey</h2>
          <div className="space-y-6">
            {lessons.map((lesson, idx) => (
              <motion.div key={lesson.id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: idx * 0.1 }} className="relative pl-10">
                {idx !== lessons.length - 1 && (
                  <div className={`absolute left-4 top-10 bottom-[-24px] w-0.5 ${lesson.status === 'completed' ? 'bg-forest-500' : 'bg-earth-200 dark:bg-earth-800'}`} />
                )}
                <div className={`absolute left-0 top-1 h-8 w-8 rounded-full border-2 flex items-center justify-center bg-white dark:bg-earth-950 z-10
                  ${lesson.status === 'completed' ? 'border-forest-500 text-forest-500' : 
                    lesson.status === 'unlocked' ? 'border-terracotta-500 text-terracotta-500 shadow-[0_0_10px_rgba(208,82,56,0.3)]' : 
                    'border-earth-300 text-earth-300 dark:border-earth-700 dark:text-earth-700'}`}>
                  {lesson.status === 'completed' && <CheckCircle2 className="h-5 w-5" />}
                  {lesson.status === 'unlocked' && <Play className="h-4 w-4 ml-0.5" />}
                  {lesson.status === 'locked' && <Lock className="h-4 w-4" />}
                </div>
                <Card hoverable={lesson.status !== 'locked'} className={`p-5 transition-all ${lesson.status === 'locked' ? 'opacity-60 grayscale' : ''} ${lesson.status === 'unlocked' ? 'border-terracotta-200 dark:border-terracotta-900/50' : ''}`} onClick={() => lesson.status !== 'locked' && navigate(`/lesson/${lesson.id}`)}>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-semibold text-earth-500 uppercase tracking-wide mb-1">Lesson {idx + 1}</p>
                      <h3 className="font-serif text-xl font-bold text-earth-900 dark:text-earth-100">{lesson.title}</h3>
                    </div>
                    {lesson.status === 'unlocked' && <Button size="sm">Start</Button>}
                    {lesson.status === 'completed' && <Button size="sm" variant="ghost">Review</Button>}
                  </div>
                </Card>
              </motion.div>
            ))}

            {/* Quiz entry */}
            {quizzes.length > 0 && (
              <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: lessons.length * 0.1 }} className="relative pl-10">
                <div className={`absolute left-0 top-1 h-8 w-8 rounded-full border-2 flex items-center justify-center bg-white dark:bg-earth-950 z-10 ${progressPct === 100 ? 'border-terracotta-500 text-terracotta-500' : 'border-earth-300 text-earth-300 dark:border-earth-700 dark:text-earth-700'}`}>
                  {progressPct === 100 ? <Play className="h-4 w-4 ml-0.5" /> : <Lock className="h-4 w-4" />}
                </div>
                <Card hoverable={progressPct === 100} className={`p-5 transition-all ${progressPct < 100 ? 'opacity-60 grayscale' : 'border-terracotta-200 dark:border-terracotta-900/50'}`} onClick={() => progressPct === 100 && navigate(`/quiz/${mod.id}`)}>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-semibold text-earth-500 uppercase tracking-wide mb-1">Final Assessment</p>
                      <h3 className="font-serif text-xl font-bold text-earth-900 dark:text-earth-100">{quizzes[0].title}</h3>
                    </div>
                    {progressPct === 100 && <Button size="sm" variant="secondary">Take Quiz</Button>}
                  </div>
                </Card>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useParams } from 'react-router-dom';
import { X, Check, Award, RefreshCw } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { ProgressBar } from '../../components/ui/ProgressBar';
import { useAuth } from '../../hooks/AuthContext';
import { getLessonById, completeLesson, type Lesson } from '../../services/lessonService';
import { updateXP } from '../../services/userService';

export const LessonPage = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { user, refreshProfile } = useAuth();
  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [completing, setCompleting] = useState(false);
  const [showReward, setShowReward] = useState(false);

  useEffect(() => {
    if (!id) return;
    (async () => {
      setLoading(true);
      const { data, error: err } = await getLessonById(id);
      if (err) setError(err);
      else setLesson(data);
      setLoading(false);
    })();
  }, [id]);

  const handleComplete = async () => {
    if (!user || !lesson) return;
    setCompleting(true);
    try {
      await completeLesson(user.id, lesson.id);
      await updateXP(user.id, 50);
      await refreshProfile();
      setShowReward(true);
      setTimeout(() => navigate(`/modules/${lesson.module_id}`), 3000);
    } catch {
      setError('Failed to complete lesson.');
    } finally {
      setCompleting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen animate-pulse">
        <div className="sticky top-0 z-40 bg-white/80 dark:bg-earth-900/80 backdrop-blur-md border-b border-earth-200 dark:border-earth-800 px-4 py-3 h-14" />
        <div className="max-w-3xl mx-auto px-6 py-12 space-y-6">
          <div className="h-10 w-96 rounded-xl bg-earth-200 dark:bg-earth-800" />
          <div className="h-64 rounded-2xl bg-earth-100 dark:bg-earth-800/50" />
        </div>
      </div>
    );
  }

  if (error || !lesson) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <p className="text-terracotta-600 text-lg">{error || 'Lesson not found.'}</p>
          <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-forest-600 font-semibold mx-auto"><RefreshCw className="h-4 w-4" /> Go Back</button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-paper-light dark:bg-paper-dark">
      {/* Navbar for Lesson */}
      <div className="sticky top-0 z-40 bg-white/80 dark:bg-earth-900/80 backdrop-blur-md border-b border-earth-200 dark:border-earth-800 px-4 py-3 flex items-center justify-between">
        <button onClick={() => navigate(-1)} className="p-2 text-earth-500 hover:bg-earth-100 rounded-full dark:hover:bg-earth-800">
          <X className="h-6 w-6" />
        </button>
        <div className="flex-1 max-w-xl mx-4">
          <ProgressBar progress={100} variant="success" />
        </div>
        <div className="text-sm font-bold text-forest-600 dark:text-forest-400">
          {lesson.title}
        </div>
      </div>

      {/* Content */}
      <div className="max-w-3xl mx-auto px-6 py-12 pb-32">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
          <h1 className="font-serif text-4xl font-bold text-earth-900 dark:text-earth-50">{lesson.title}</h1>
          <div className="prose prose-lg dark:prose-invert prose-earth max-w-none font-sans text-earth-700 dark:text-earth-300" dangerouslySetInnerHTML={{ __html: lesson.content }} />
        </motion.div>
      </div>

      {/* Bottom Bar */}
      <div className="fixed bottom-0 w-full bg-white dark:bg-earth-900 border-t border-earth-200 dark:border-earth-800 p-4 z-40">
        <div className="max-w-3xl mx-auto flex justify-end">
          <Button size="lg" onClick={handleComplete} isLoading={completing} disabled={completing}>
            <Check className="mr-2 h-5 w-5" /> Mark Complete
          </Button>
        </div>
      </div>

      {/* Reward Overlay */}
      <AnimatePresence>
        {showReward && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
            <motion.div initial={{ scale: 0.8, y: 50 }} animate={{ scale: 1, y: 0 }} className="bg-white dark:bg-earth-900 p-8 rounded-3xl text-center max-w-sm mx-4 shadow-2xl">
              <div className="mx-auto w-24 h-24 bg-yellow-100 dark:bg-yellow-900/50 rounded-full flex items-center justify-center mb-6 shadow-inner">
                <Award className="h-12 w-12 text-yellow-500" />
              </div>
              <h2 className="font-serif text-3xl font-bold text-earth-900 dark:text-earth-50 mb-2">Lesson Complete!</h2>
              <p className="text-earth-600 dark:text-earth-400 mb-6">You've unlocked the next part of your journey.</p>
              <div className="inline-flex items-center justify-center px-4 py-2 bg-terracotta-100 dark:bg-terracotta-900/50 text-terracotta-600 dark:text-terracotta-400 rounded-full font-bold text-xl">+50 XP</div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

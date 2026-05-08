import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { X, Check, Award } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { ProgressBar } from '../../components/ui/ProgressBar';

export const LessonPage = () => {
  const navigate = useNavigate();
  const [showReward, setShowReward] = useState(false);

  const handleComplete = () => {
    setShowReward(true);
    setTimeout(() => {
      navigate('/modules/1');
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-paper-light dark:bg-paper-dark">
      {/* Navbar for Lesson */}
      <div className="sticky top-0 z-40 bg-white/80 dark:bg-earth-900/80 backdrop-blur-md border-b border-earth-200 dark:border-earth-800 px-4 py-3 flex items-center justify-between">
        <button onClick={() => navigate(-1)} className="p-2 text-earth-500 hover:bg-earth-100 rounded-full dark:hover:bg-earth-800">
          <X className="h-6 w-6" />
        </button>
        <div className="flex-1 max-w-xl mx-4">
          <ProgressBar progress={75} variant="success" />
        </div>
        <div className="text-sm font-bold text-forest-600 dark:text-forest-400">
          3/4
        </div>
      </div>

      {/* Content */}
      <div className="max-w-3xl mx-auto px-6 py-12 pb-32">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-8"
        >
          <h1 className="font-serif text-4xl font-bold text-earth-900 dark:text-earth-50">
            Extracting Neem Oil
          </h1>
          
          <img 
            src="https://images.unsplash.com/photo-1611078516599-2782e2c07ef9?auto=format&fit=crop&q=80&w=800" 
            alt="Mortar and pestle" 
            className="w-full h-64 md:h-96 object-cover rounded-2xl shadow-md"
          />

          <div className="prose prose-lg dark:prose-invert prose-earth max-w-none font-sans text-earth-700 dark:text-earth-300">
            <p>
              The extraction of Neem oil is an ancient practice that requires patience and respect for the material. 
              The seeds, which contain the highest concentration of the active compound <strong>Azadirachtin</strong>, 
              are traditionally cold-pressed to retain their medicinal properties.
            </p>
            
            <Card className="my-8 bg-forest-50/50 dark:bg-forest-900/20 border-forest-200 dark:border-forest-800">
              <h3 className="font-serif text-xl font-bold text-forest-800 dark:text-forest-200 mb-4">The Cold Press Method</h3>
              <ol className="space-y-4 list-decimal list-inside">
                <li>Harvest ripe neem fruits during the monsoon season.</li>
                <li>Depulp the fruits and wash the seeds thoroughly.</li>
                <li>Dry the seeds under a shade (not direct sunlight, which destroys active compounds).</li>
                <li>Crush the dried seeds in a traditional wooden ghani (mortar) to extract the pure oil.</li>
              </ol>
            </Card>

            <p>
              Unlike industrial extraction methods that use chemical solvents like hexane, the traditional cold-press 
              method ensures that the resulting oil is rich, dark brown, and retains its strong garlic-sulfur odor — 
              a sign of its potency.
            </p>
          </div>
        </motion.div>
      </div>

      {/* Bottom Bar */}
      <div className="fixed bottom-0 w-full bg-white dark:bg-earth-900 border-t border-earth-200 dark:border-earth-800 p-4 z-40">
        <div className="max-w-3xl mx-auto flex justify-end">
          <Button size="lg" onClick={handleComplete}>
            <Check className="mr-2 h-5 w-5" /> Mark Complete
          </Button>
        </div>
      </div>

      {/* Reward Overlay */}
      <AnimatePresence>
        {showReward && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.8, y: 50 }}
              animate={{ scale: 1, y: 0 }}
              className="bg-white dark:bg-earth-900 p-8 rounded-3xl text-center max-w-sm mx-4 shadow-2xl"
            >
              <div className="mx-auto w-24 h-24 bg-yellow-100 dark:bg-yellow-900/50 rounded-full flex items-center justify-center mb-6 shadow-inner">
                <Award className="h-12 w-12 text-yellow-500" />
              </div>
              <h2 className="font-serif text-3xl font-bold text-earth-900 dark:text-earth-50 mb-2">Lesson Complete!</h2>
              <p className="text-earth-600 dark:text-earth-400 mb-6">You've unlocked the next part of your journey.</p>
              <div className="inline-flex items-center justify-center px-4 py-2 bg-terracotta-100 dark:bg-terracotta-900/50 text-terracotta-600 dark:text-terracotta-400 rounded-full font-bold text-xl">
                +150 XP
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useParams } from 'react-router-dom';
import { X, CheckCircle2, XCircle, Award, RefreshCw } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { ProgressBar } from '../../components/ui/ProgressBar';
import { useAuth } from '../../hooks/AuthContext';
import { getQuizByModule, getQuizQuestions, submitQuizResult, type QuizQuestion } from '../../services/quizService';
import { updateXP } from '../../services/userService';

export const QuizPage = () => {
  const navigate = useNavigate();
  const { moduleId } = useParams<{ moduleId: string }>();
  const { user, refreshProfile } = useAuth();

  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [quizId, setQuizId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentQ, setCurrentQ] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);

  useEffect(() => {
    if (!moduleId) return;
    (async () => {
      setLoading(true);
      try {
        const { data: quiz, error: qErr } = await getQuizByModule(moduleId);
        if (qErr || !quiz) throw new Error(qErr || 'Quiz not found.');
        setQuizId(quiz.id);
        const { data: qs, error: qsErr } = await getQuizQuestions(quiz.id);
        if (qsErr) throw new Error(qsErr);
        setQuestions(qs ?? []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load quiz.');
      } finally {
        setLoading(false);
      }
    })();
  }, [moduleId]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center animate-pulse">
        <div className="max-w-2xl w-full p-4 space-y-8">
          <div className="h-4 rounded-full bg-earth-200 dark:bg-earth-800" />
          <div className="h-20 rounded-2xl bg-earth-100 dark:bg-earth-800/50" />
          <div className="space-y-3">{[1,2,3,4].map(i => <div key={i} className="h-14 rounded-2xl bg-earth-100 dark:bg-earth-800/50" />)}</div>
        </div>
      </div>
    );
  }

  if (error || questions.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <p className="text-terracotta-600 text-lg">{error || 'No questions found.'}</p>
          <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-forest-600 font-semibold mx-auto"><RefreshCw className="h-4 w-4" /> Go Back</button>
        </div>
      </div>
    );
  }

  const question = questions[currentQ];
  const progress = (currentQ / questions.length) * 100;
  const options = question.options ?? [];
  const correctAnswer = question.correct_answer;

  const handleOptionClick = (idx: number) => {
    if (isAnswered) return;
    setSelectedOption(idx);
  };

  const handleNext = async () => {
    if (!isAnswered) {
      setIsAnswered(true);
      if (selectedOption !== null && options[selectedOption] === correctAnswer) {
        setCorrectCount(c => c + 1);
      }
    } else {
      if (currentQ < questions.length - 1) {
        setCurrentQ(c => c + 1);
        setSelectedOption(null);
        setIsAnswered(false);
      } else {
        // Submit results
        const finalCorrect = correctCount;
        const score = Math.round((finalCorrect / questions.length) * 100);
        const passed = score >= 50;
        if (user && quizId) {
          try {
            await submitQuizResult({ user_id: user.id, quiz_id: quizId, score, total_questions: questions.length, passed });
            if (passed) {
              await updateXP(user.id, score >= 80 ? 200 : 100);
              await refreshProfile();
            }
          } catch { /* best effort */ }
        }
        setShowResults(true);
      }
    }
  };

  const scorePct = Math.round((correctCount / questions.length) * 100);
  const xpEarned = scorePct >= 80 ? 200 : scorePct >= 50 ? 100 : 0;

  if (showResults) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-center max-w-md w-full">
          <Card className="p-8">
            <div className="mx-auto w-24 h-24 bg-terracotta-100 dark:bg-terracotta-900/50 rounded-full flex items-center justify-center mb-6">
              <Award className="h-12 w-12 text-terracotta-500" />
            </div>
            <h2 className="font-serif text-3xl font-bold text-earth-900 dark:text-earth-50 mb-2">Quiz Complete!</h2>
            <p className="text-earth-600 dark:text-earth-400 mb-6">You answered {correctCount} out of {questions.length} correctly.</p>
            <div className="flex justify-center gap-4 mb-8">
              <div className="text-center">
                <p className="text-sm font-semibold text-earth-500">Score</p>
                <p className="text-2xl font-bold text-earth-900 dark:text-earth-100">{scorePct}%</p>
              </div>
              <div className="w-px bg-earth-200 dark:bg-earth-800" />
              <div className="text-center">
                <p className="text-sm font-semibold text-earth-500">XP Earned</p>
                <p className="text-2xl font-bold text-terracotta-500">+{xpEarned}</p>
              </div>
            </div>
            <Button className="w-full" size="lg" onClick={() => navigate(`/modules/${moduleId}`)}>Return to Module</Button>
          </Card>
        </motion.div>
      </div>
    );
  }

  const isCorrectSelected = selectedOption !== null && options[selectedOption] === correctAnswer;

  return (
    <div className="min-h-screen flex flex-col">
      <div className="p-4 flex items-center gap-4 max-w-3xl mx-auto w-full">
        <button onClick={() => navigate(-1)} className="p-2 text-earth-500 hover:bg-earth-100 rounded-full dark:hover:bg-earth-800"><X className="h-6 w-6" /></button>
        <ProgressBar progress={progress} className="flex-1" />
      </div>
      <div className="flex-1 max-w-2xl mx-auto w-full p-4 flex flex-col justify-center">
        <AnimatePresence mode="wait">
          <motion.div key={currentQ} initial={{ x: 50, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -50, opacity: 0 }} className="space-y-8">
            <h2 className="font-serif text-2xl md:text-3xl font-bold text-earth-900 dark:text-earth-50 leading-snug">{question.question}</h2>
            <div className="space-y-3">
              {options.map((opt, idx) => {
                const isSelected = selectedOption === idx;
                const isCorrect = opt === correctAnswer;
                let btnStyle = "border-earth-200 dark:border-earth-700 bg-white dark:bg-earth-900/50 hover:bg-earth-50 dark:hover:bg-earth-800 text-earth-800 dark:text-earth-200";
                if (isAnswered) {
                  if (isCorrect) btnStyle = "border-forest-500 bg-forest-50 dark:bg-forest-900/20 text-forest-700 dark:text-forest-300";
                  else if (isSelected && !isCorrect) btnStyle = "border-terracotta-500 bg-terracotta-50 dark:bg-terracotta-900/20 text-terracotta-700 dark:text-terracotta-300";
                  else btnStyle = "opacity-50 border-earth-200 dark:border-earth-700 bg-transparent";
                } else if (isSelected) {
                  btnStyle = "border-earth-500 bg-earth-50 dark:bg-earth-800 text-earth-900 dark:text-earth-100 ring-2 ring-earth-500/20";
                }
                return (
                  <button key={idx} onClick={() => handleOptionClick(idx)} disabled={isAnswered} className={`w-full text-left p-4 rounded-2xl border-2 transition-all duration-200 font-medium text-lg flex justify-between items-center ${btnStyle}`}>
                    <span>{opt}</span>
                    {isAnswered && isCorrect && <CheckCircle2 className="h-6 w-6 text-forest-500" />}
                    {isAnswered && isSelected && !isCorrect && <XCircle className="h-6 w-6 text-terracotta-500" />}
                  </button>
                );
              })}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
      <div className={`border-t p-4 transition-colors duration-300 ${isAnswered ? (isCorrectSelected ? 'bg-forest-50 dark:bg-forest-900/20 border-forest-200 dark:border-forest-800' : 'bg-terracotta-50 dark:bg-terracotta-900/20 border-terracotta-200 dark:border-terracotta-800') : 'bg-white dark:bg-earth-900 border-earth-200 dark:border-earth-800'}`}>
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <div>
            {isAnswered && (
              <h3 className={`font-bold text-xl ${isCorrectSelected ? 'text-forest-600 dark:text-forest-400' : 'text-terracotta-600 dark:text-terracotta-400'}`}>
                {isCorrectSelected ? 'Excellent!' : 'Not quite.'}
              </h3>
            )}
          </div>
          <Button size="lg" onClick={handleNext} disabled={!isAnswered && selectedOption === null} className={`min-w-[150px] ${isAnswered ? (isCorrectSelected ? 'bg-forest-500 hover:bg-forest-600' : 'bg-terracotta-500 hover:bg-terracotta-600') : ''}`}>
            {isAnswered ? 'Continue' : 'Check'}
          </Button>
        </div>
      </div>
    </div>
  );
};

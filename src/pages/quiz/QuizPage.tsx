import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { X, CheckCircle2, XCircle, Award } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { ProgressBar } from '../../components/ui/ProgressBar';

const QUESTIONS = [
  {
    id: 1,
    text: "Which part of the Neem tree is typically used for cold-pressed oil extraction?",
    options: ["Leaves", "Bark", "Seeds", "Roots"],
    correct: 2,
  },
  {
    id: 2,
    text: "What is the primary active compound found in Neem?",
    options: ["Curcumin", "Azadirachtin", "Allicin", "Menthol"],
    correct: 1,
  },
];

export const QuizPage = () => {
  const navigate = useNavigate();
  const [currentQ, setCurrentQ] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [showResults, setShowResults] = useState(false);

  const question = QUESTIONS[currentQ];
  const progress = ((currentQ) / QUESTIONS.length) * 100;

  const handleOptionClick = (idx: number) => {
    if (isAnswered) return;
    setSelectedOption(idx);
  };

  const handleNext = () => {
    if (!isAnswered) {
      setIsAnswered(true);
    } else {
      if (currentQ < QUESTIONS.length - 1) {
        setCurrentQ(c => c + 1);
        setSelectedOption(null);
        setIsAnswered(false);
      } else {
        setShowResults(true);
      }
    }
  };

  if (showResults) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-center max-w-md w-full"
        >
          <Card className="p-8">
            <div className="mx-auto w-24 h-24 bg-terracotta-100 dark:bg-terracotta-900/50 rounded-full flex items-center justify-center mb-6">
              <Award className="h-12 w-12 text-terracotta-500" />
            </div>
            <h2 className="font-serif text-3xl font-bold text-earth-900 dark:text-earth-50 mb-2">Quiz Complete!</h2>
            <p className="text-earth-600 dark:text-earth-400 mb-6">You've mastered the basics of Neem extraction.</p>
            <div className="flex justify-center gap-4 mb-8">
              <div className="text-center">
                <p className="text-sm font-semibold text-earth-500">Score</p>
                <p className="text-2xl font-bold text-earth-900 dark:text-earth-100">100%</p>
              </div>
              <div className="w-px bg-earth-200 dark:bg-earth-800" />
              <div className="text-center">
                <p className="text-sm font-semibold text-earth-500">XP Earned</p>
                <p className="text-2xl font-bold text-terracotta-500">+200</p>
              </div>
            </div>
            <Button className="w-full" size="lg" onClick={() => navigate('/modules/1')}>
              Return to Module
            </Button>
          </Card>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <div className="p-4 flex items-center gap-4 max-w-3xl mx-auto w-full">
        <button onClick={() => navigate(-1)} className="p-2 text-earth-500 hover:bg-earth-100 rounded-full dark:hover:bg-earth-800">
          <X className="h-6 w-6" />
        </button>
        <ProgressBar progress={progress} className="flex-1" />
      </div>

      {/* Question */}
      <div className="flex-1 max-w-2xl mx-auto w-full p-4 flex flex-col justify-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentQ}
            initial={{ x: 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -50, opacity: 0 }}
            className="space-y-8"
          >
            <h2 className="font-serif text-2xl md:text-3xl font-bold text-earth-900 dark:text-earth-50 leading-snug">
              {question.text}
            </h2>

            <div className="space-y-3">
              {question.options.map((opt, idx) => {
                const isSelected = selectedOption === idx;
                const isCorrect = idx === question.correct;
                
                let btnStyle = "border-earth-200 dark:border-earth-700 bg-white dark:bg-earth-900/50 hover:bg-earth-50 dark:hover:bg-earth-800 text-earth-800 dark:text-earth-200";
                
                if (isAnswered) {
                  if (isCorrect) {
                    btnStyle = "border-forest-500 bg-forest-50 dark:bg-forest-900/20 text-forest-700 dark:text-forest-300";
                  } else if (isSelected && !isCorrect) {
                    btnStyle = "border-terracotta-500 bg-terracotta-50 dark:bg-terracotta-900/20 text-terracotta-700 dark:text-terracotta-300";
                  } else {
                    btnStyle = "opacity-50 border-earth-200 dark:border-earth-700 bg-transparent";
                  }
                } else if (isSelected) {
                  btnStyle = "border-earth-500 bg-earth-50 dark:bg-earth-800 text-earth-900 dark:text-earth-100 ring-2 ring-earth-500/20";
                }

                return (
                  <button
                    key={idx}
                    onClick={() => handleOptionClick(idx)}
                    disabled={isAnswered}
                    className={`w-full text-left p-4 rounded-2xl border-2 transition-all duration-200 font-medium text-lg flex justify-between items-center ${btnStyle}`}
                  >
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

      {/* Footer */}
      <div className={`border-t p-4 transition-colors duration-300 ${isAnswered ? (selectedOption === question.correct ? 'bg-forest-50 dark:bg-forest-900/20 border-forest-200 dark:border-forest-800' : 'bg-terracotta-50 dark:bg-terracotta-900/20 border-terracotta-200 dark:border-terracotta-800') : 'bg-white dark:bg-earth-900 border-earth-200 dark:border-earth-800'}`}>
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <div>
            {isAnswered && (
              <h3 className={`font-bold text-xl ${selectedOption === question.correct ? 'text-forest-600 dark:text-forest-400' : 'text-terracotta-600 dark:text-terracotta-400'}`}>
                {selectedOption === question.correct ? 'Excellent!' : 'Not quite.'}
              </h3>
            )}
          </div>
          <Button 
            size="lg" 
            onClick={handleNext}
            disabled={!isAnswered && selectedOption === null}
            className={`min-w-[150px] ${isAnswered ? (selectedOption === question.correct ? 'bg-forest-500 hover:bg-forest-600' : 'bg-terracotta-500 hover:bg-terracotta-600') : ''}`}
          >
            {isAnswered ? 'Continue' : 'Check'}
          </Button>
        </div>
      </div>
    </div>
  );
};

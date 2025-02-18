import { createContext, useContext, useState, useEffect } from 'react';
import { openDB } from 'idb';

const QuizContext = createContext();

const initDB = async () => {
  const db = await openDB('quizDB', 1, {
    upgrade(db) {
      db.createObjectStore('attempts', { keyPath: 'id', autoIncrement: true });
    },
  });
  return db;
};

export const QuizProvider = ({ children }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [isQuizActive, setIsQuizActive] = useState(false);
  const [userAnswers, setUserAnswers] = useState([]);
  
  const questions = [
    {
      question: "What is React.js?",
      options: [
        "A JavaScript framework",
        "A JavaScript library for building user interfaces",
        "A programming language",
        "A database management system"
      ],
      correctAnswer: 1
    },
    {
      question: "What is JSX?",
      options: [
        "A JavaScript extension for XML syntax",
        "A new programming language",
        "A database query language",
        "A styling framework"
      ],
      correctAnswer: 0
    },
    {
      question: "What is the virtual DOM?",
      options: [
        "A complete copy of the actual DOM",
        "A lightweight copy of the actual DOM in memory",
        "A browser feature",
        "A JavaScript engine"
      ],
      correctAnswer: 1
    },
    {
      question: "Which hook is used for side effects in React?",
      options: [
        "useState",
        "useEffect",
        "useContext",
        "useReducer"
      ],
      correctAnswer: 1
    },
    {
      question: "What is the purpose of React Router?",
      options: [
        "To manage state in React applications",
        "To handle HTTP requests",
        "To handle navigation in React applications",
        "To optimize React performance"
      ],
      correctAnswer: 2
    },
    {
      question: "What is the purpose of the useState hook?",
      options: [
        "To handle side effects",
        "To manage component state",
        "To handle routing",
        "To optimize performance"
      ],
      correctAnswer: 1
    },
    {
      question: "What is a controlled component in React?",
      options: [
        "A component with error boundaries",
        "A component that controls its child components",
        "A form element whose value is controlled by React state",
        "A component with lifecycle methods"
      ],
      correctAnswer: 2
    },
    {
      question: "What is the purpose of the key prop in React lists?",
      options: [
        "To style list items",
        "To help React identify which items have changed",
        "To make lists sortable",
        "To add event listeners"
      ],
      correctAnswer: 1
    }
  ];

  const startQuiz = () => {
    setCurrentQuestion(0);
    setScore(0);
    setTimeLeft(30);
    setIsQuizActive(true);
    setUserAnswers([]);
  };

  const submitAnswer = async (selectedAnswer) => {
    const isCorrect = selectedAnswer === questions[currentQuestion].correctAnswer;
    if (isCorrect) setScore(score + 1);
    
    setUserAnswers([...userAnswers, { 
      question: currentQuestion,
      selected: selectedAnswer,
      isCorrect
    }]);

    if (currentQuestion + 1 < questions.length) {
      setCurrentQuestion(currentQuestion + 1);
      setTimeLeft(30);
    } else {
      endQuiz();
    }
  };

  const endQuiz = async () => {
    setIsQuizActive(false);
    const attempt = {
      date: new Date().toISOString(),
      score,
      totalQuestions: questions.length,
      answers: userAnswers
    };

    try {
      const db = await initDB();
      await db.add('attempts', attempt);
    } catch (error) {
      console.error('Error saving attempt:', error);
    }
  };

  useEffect(() => {
    let timer;
    if (isQuizActive && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && isQuizActive) {
      submitAnswer(-1); // Submit -1 for timeout
    }
    return () => clearInterval(timer);
  }, [timeLeft, isQuizActive]);

  const value = {
    currentQuestion,
    questions,
    score,
    timeLeft,
    isQuizActive,
    userAnswers,
    startQuiz,
    submitAnswer,
    endQuiz
  };

  return (
    <QuizContext.Provider value={value}>
      {children}
    </QuizContext.Provider>
  );
};

export const useQuiz = () => {
  const context = useContext(QuizContext);
  if (!context) {
    throw new Error('useQuiz must be used within a QuizProvider');
  }
  return context;
};

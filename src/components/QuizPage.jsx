import { useQuiz } from '../context/QuizContext';
import styled from 'styled-components';

const QuizContainer = styled.div`
  max-width: 800px;
  margin: 2rem auto;
  padding: 2rem;
  background: white;
  border-radius: 10px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const Timer = styled.div`
  text-align: center;
  font-size: 1.5rem;
  margin-bottom: 1rem;
  color: ${props => props.$timeLeft <= 10 ? 'var(--error-color)' : 'var(--text-color)'};
`;

const Question = styled.h2`
  margin-bottom: 1.5rem;
  font-size: 1.25rem;
`;

const OptionsGrid = styled.div`
  display: grid;
  gap: 1rem;
  margin-bottom: 1.5rem;
`;

const Option = styled.button`
  padding: 1rem;
  background: ${props => props.$selected ? 'var(--primary-color)' : 'white'};
  color: ${props => props.$selected ? 'white' : 'var(--text-color)'};
  border: 2px solid var(--primary-color);
  border-radius: 8px;
  font-size: 1rem;
  transition: all 0.2s;

  &:hover {
    background: var(--primary-color);
    color: white;
  }
`;

const StartButton = styled.button`
  background: var(--primary-color);
  color: white;
  border: none;
  padding: 1rem 2rem;
  border-radius: 8px;
  font-size: 1.1rem;
  width: 100%;
  transition: background 0.2s;

  &:hover {
    background: var(--secondary-color);
  }
`;

const Progress = styled.div`
  margin-bottom: 1rem;
  text-align: center;
  color: var(--text-color);
`;

const ScoreCard = styled.div`
  text-align: center;
  padding: 2rem;

  h2 {
    color: var(--primary-color);
    margin-bottom: 1rem;
  }

  p {
    font-size: 1.2rem;
    margin-bottom: 1.5rem;
  }
`;

const QuizPage = () => {
  const {
    currentQuestion,
    questions,
    score,
    timeLeft,
    isQuizActive,
    startQuiz,
    submitAnswer
  } = useQuiz();

  if (!isQuizActive) {
    return (
      <QuizContainer>
        {score > 0 ? (
          <ScoreCard>
            <h2>Quiz Completed!</h2>
            <p>Your score: {score} out of {questions.length}</p>
            <StartButton onClick={startQuiz}>Try Again</StartButton>
          </ScoreCard>
        ) : (
          <StartButton onClick={startQuiz}>Start Quiz</StartButton>
        )}
      </QuizContainer>
    );
  }

  const question = questions[currentQuestion];

  return (
    <QuizContainer>
      <Timer $timeLeft={timeLeft}>Time Left: {timeLeft}s</Timer>
      <Progress>
        Question {currentQuestion + 1} of {questions.length}
      </Progress>
      <Question>{question.question}</Question>
      <OptionsGrid>
        {question.options.map((option, index) => (
          <Option
            key={index}
            onClick={() => submitAnswer(index)}
          >
            {option}
          </Option>
        ))}
      </OptionsGrid>
    </QuizContainer>
  );
};

export default QuizPage;

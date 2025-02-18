import { useQuiz } from '../context/QuizContext';
import styled from 'styled-components';

const QuizContainer = styled.div`
  max-width: 800px;
  margin: 2rem auto;
  padding: 2rem;
  background: var(--card-background);
  border-radius: 20px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  animation: fadeIn 0.5s ease-out;
  border: 1px solid var(--card-border);
`;

const Timer = styled.div`
  text-align: center;
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 1.5rem;
  color: ${props => {
    if (props.$timeLeft <= 5) return 'var(--error-color)';
    if (props.$timeLeft <= 10) return 'var(--secondary-color)';
    return 'var(--primary-color)';
  }};
  transition: color 0.3s ease;

  span {
    display: inline-block;
    min-width: 3rem;
    padding: 0.5rem 1rem;
    background: rgba(99, 102, 241, 0.1);
    border-radius: 12px;
    animation: ${props => props.$timeLeft <= 5 ? 'pulse 1s infinite' : 'none'};
  }
`;

const Question = styled.h2`
  margin-bottom: 2rem;
  font-size: 1.5rem;
  color: var(--text-color);
  line-height: 1.5;
  text-align: center;
  animation: fadeIn 0.5s ease-out;
`;

const OptionsGrid = styled.div`
  display: grid;
  gap: 1rem;
  margin-bottom: 2rem;
`;

const Option = styled.button`
  padding: 1.2rem;
  background: ${props => props.$selected ? 'linear-gradient(135deg, var(--gradient-start), var(--gradient-end))' : 'white'};
  color: ${props => props.$selected ? 'white' : 'var(--text-color)'};
  border: 2px solid ${props => props.$selected ? 'transparent' : 'var(--card-border)'};
  border-radius: 12px;
  font-size: 1.1rem;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(99, 102, 241, 0.2);
    border-color: ${props => props.$selected ? 'transparent' : 'var(--primary-color)'};
  }

  &:active {
    transform: translateY(0);
  }

  &::before {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    width: 0;
    height: 0;
    background: rgba(255, 255, 255, 0.2);
    border-radius: 50%;
    transform: translate(-50%, -50%);
    transition: width 0.6s ease, height 0.6s ease;
  }

  &:hover::before {
    width: 300px;
    height: 300px;
  }
`;

const StartButton = styled.button`
  background: linear-gradient(135deg, var(--gradient-start), var(--gradient-end));
  color: white;
  border: none;
  padding: 1.2rem 2.5rem;
  border-radius: 12px;
  font-size: 1.2rem;
  font-weight: 600;
  width: 100%;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(99, 102, 241, 0.2);
  }

  &:active {
    transform: translateY(0);
  }

  &::before {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    width: 0;
    height: 0;
    background: rgba(255, 255, 255, 0.2);
    border-radius: 50%;
    transform: translate(-50%, -50%);
    transition: width 0.6s ease, height 0.6s ease;
  }

  &:hover::before {
    width: 300px;
    height: 300px;
  }
`;

const Progress = styled.div`
  margin-bottom: 2rem;
  text-align: center;
  color: var(--text-color);
  font-size: 1.1rem;
  
  span {
    color: var(--primary-color);
    font-weight: 600;
  }
`;

const ScoreCard = styled.div`
  text-align: center;
  padding: 2rem;
  animation: fadeIn 0.5s ease-out;

  h2 {
    background: linear-gradient(135deg, var(--gradient-start), var(--gradient-end));
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    font-size: 2rem;
    margin-bottom: 1.5rem;
  }

  p {
    font-size: 1.3rem;
    margin-bottom: 2rem;
    color: var(--text-color);
  }

  .score {
    font-size: 3rem;
    font-weight: 700;
    color: var(--primary-color);
    margin-bottom: 2rem;
    display: block;
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
            <h2>Quiz Completed! 🎉</h2>
            <span className="score">{score}/{questions.length}</span>
            <p>Great job! Would you like to try again?</p>
            <StartButton onClick={startQuiz}>Take Another Quiz</StartButton>
          </ScoreCard>
        ) : (
          <>
            <h2 style={{ marginBottom: '2rem', textAlign: 'center', fontSize: '1.5rem' }}>
              Ready to test your knowledge?
            </h2>
            <StartButton onClick={startQuiz}>Start Quiz</StartButton>
          </>
        )}
      </QuizContainer>
    );
  }

  const question = questions[currentQuestion];

  return (
    <QuizContainer>
      <Timer $timeLeft={timeLeft}>
        <span>{timeLeft}</span>s
      </Timer>
      <Progress>
        Question <span>{currentQuestion + 1}</span> of <span>{questions.length}</span>
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

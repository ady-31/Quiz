import { useState, useEffect } from 'react';
import { openDB } from 'idb';
import styled from 'styled-components';

const HistoryContainer = styled.div`
  max-width: 800px;
  margin: 2rem auto;
  padding: 2rem;
  animation: fadeIn 0.5s ease-out;
`;

const AttemptCard = styled.div`
  background: var(--card-background);
  border-radius: 16px;
  padding: 1.5rem;
  margin-bottom: 1.5rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  border: 1px solid var(--card-border);
  transition: all 0.3s ease;
  animation: fadeIn 0.5s ease-out;
  animation-delay: ${props => props.$index * 0.1}s;
  opacity: 0;
  animation-fill-mode: forwards;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
  }

  h3 {
    background: linear-gradient(135deg, var(--gradient-start), var(--gradient-end));
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    font-size: 1.5rem;
    margin-bottom: 1rem;
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }
`;

const ScoreDisplay = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;
  font-size: 1.2rem;
`;

const ScoreBar = styled.div`
  flex-grow: 1;
  height: 10px;
  background: rgba(99, 102, 241, 0.1);
  border-radius: 999px;
  overflow: hidden;
  position: relative;

  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    width: ${props => (props.$score / props.$total) * 100}%;
    background: linear-gradient(135deg, var(--gradient-start), var(--gradient-end));
    border-radius: 999px;
    transition: width 1s ease-out;
  }
`;

const ScoreText = styled.span`
  font-weight: 600;
  color: ${props => {
    const percentage = (props.$score / props.$total) * 100;
    if (percentage >= 80) return 'var(--success-color)';
    if (percentage >= 60) return 'var(--primary-color)';
    return 'var(--error-color)';
  }};
`;

const DateDisplay = styled.p`
  color: #666;
  font-size: 0.9rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;

  svg {
    width: 16px;
    height: 16px;
    opacity: 0.6;
  }
`;

const NoAttempts = styled.div`
  text-align: center;
  color: var(--text-color);
  padding: 4rem 2rem;
  background: var(--card-background);
  border-radius: 16px;
  border: 1px solid var(--card-border);
  animation: fadeIn 0.5s ease-out;

  h3 {
    font-size: 1.5rem;
    margin-bottom: 1rem;
    background: linear-gradient(135deg, var(--gradient-start), var(--gradient-end));
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }

  p {
    font-size: 1.1rem;
    color: #666;
  }
`;

const PageTitle = styled.h2`
  text-align: center;
  margin-bottom: 2rem;
  font-size: 2rem;
  background: linear-gradient(135deg, var(--gradient-start), var(--gradient-end));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
`;

// Clock icon component
const ClockIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

// Trophy icon component
const TrophyIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
  </svg>
);

const History = () => {
  const [attempts, setAttempts] = useState([]);

  useEffect(() => {
    const loadAttempts = async () => {
      try {
        const db = await openDB('quizDB', 1);
        const allAttempts = await db.getAll('attempts');
        setAttempts(allAttempts.reverse()); // Show newest first
      } catch (error) {
        console.error('Error loading attempts:', error);
      }
    };

    loadAttempts();
  }, []);

  if (attempts.length === 0) {
    return (
      <HistoryContainer>
        <NoAttempts>
          <h3>No Quiz Attempts Yet</h3>
          <p>Take your first quiz to see your progress here!</p>
        </NoAttempts>
      </HistoryContainer>
    );
  }

  return (
    <HistoryContainer>
      <PageTitle>Your Quiz History</PageTitle>
      {attempts.map((attempt, index) => (
        <AttemptCard key={index} $index={index}>
          <h3>
            <TrophyIcon /> Attempt #{attempts.length - index}
          </h3>
          <ScoreDisplay>
            <ScoreText $score={attempt.score} $total={attempt.totalQuestions}>
              {attempt.score}/{attempt.totalQuestions}
            </ScoreText>
            <ScoreBar $score={attempt.score} $total={attempt.totalQuestions} />
          </ScoreDisplay>
          <DateDisplay>
            <ClockIcon />
            {new Date(attempt.date).toLocaleString()}
          </DateDisplay>
        </AttemptCard>
      ))}
    </HistoryContainer>
  );
};

export default History;

import { useState, useEffect } from 'react';
import { openDB } from 'idb';
import styled from 'styled-components';

const HistoryContainer = styled.div`
  max-width: 800px;
  margin: 2rem auto;
  padding: 2rem;
`;

const AttemptCard = styled.div`
  background: white;
  border-radius: 8px;
  padding: 1.5rem;
  margin-bottom: 1rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);

  h3 {
    color: var(--primary-color);
    margin-bottom: 1rem;
  }
`;

const ScoreDisplay = styled.p`
  font-size: 1.1rem;
  margin-bottom: 0.5rem;
  color: ${props => props.$score >= props.$total / 2 ? 'var(--success-color)' : 'var(--error-color)'};
`;

const DateDisplay = styled.p`
  color: #666;
  font-size: 0.9rem;
`;

const NoAttempts = styled.p`
  text-align: center;
  color: #666;
  font-size: 1.1rem;
`;

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
        <NoAttempts>No quiz attempts yet. Try taking a quiz first!</NoAttempts>
      </HistoryContainer>
    );
  }

  return (
    <HistoryContainer>
      <h2>Quiz Attempt History</h2>
      {attempts.map((attempt, index) => (
        <AttemptCard key={index}>
          <h3>Attempt #{attempts.length - index}</h3>
          <ScoreDisplay 
            $score={attempt.score} 
            $total={attempt.totalQuestions}
          >
            Score: {attempt.score}/{attempt.totalQuestions}
          </ScoreDisplay>
          <DateDisplay>
            {new Date(attempt.date).toLocaleString()}
          </DateDisplay>
        </AttemptCard>
      ))}
    </HistoryContainer>
  );
};

export default History;

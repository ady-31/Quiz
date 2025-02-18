import { useState, useEffect } from 'react';
import { openDB } from 'idb';
import styled from 'styled-components';

const HistoryContainer = styled.div`
  max-width: 800px;
  margin: 2rem auto;
  padding: 2rem;
  animation: fadeIn 0.5s ease-out;
`;

const StatsContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin-bottom: 2rem;
`;

const StatCard = styled.div`
  background: var(--card-background);
  padding: 1.5rem;
  border-radius: 16px;
  border: 1px solid var(--card-border);
  text-align: center;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);

  h4 {
    color: var(--text-color);
    font-size: 0.9rem;
    margin-bottom: 0.5rem;
    opacity: 0.8;
  }

  .value {
    font-size: 1.8rem;
    font-weight: 700;
    background: linear-gradient(135deg, var(--gradient-start), var(--gradient-end));
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }
`;

const AttemptCard = styled.div`
  background: var(--card-background);
  border-radius: 16px;
  padding: 1.5rem;
  margin-bottom: 1.5rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  border: 1px solid var(--card-border);
  transition: all 0.3s ease;
  animation: fadeIn 0.5s ease-out;
  animation-delay: ${props => props.$index * 0.1}s;
  opacity: 0;
  animation-fill-mode: forwards;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
  }
`;

const AttemptHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;

  h3 {
    font-size: 1.3rem;
    color: var(--text-color);
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }
`;

const ScoreSection = styled.div`
  background: rgba(99, 102, 241, 0.05);
  padding: 1rem;
  border-radius: 12px;
  margin-bottom: 1rem;
`;

const ScoreDisplay = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;
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
    background: ${props => {
      const percentage = (props.$score / props.$total) * 100;
      if (percentage >= 80) return 'var(--success-color)';
      if (percentage >= 60) return 'var(--primary-color)';
      return 'var(--error-color)';
    }};
    border-radius: 999px;
    transition: width 1s ease-out;
  }
`;

const ScoreText = styled.div`
  text-align: center;
  min-width: 80px;

  .score {
    font-size: 1.4rem;
    font-weight: 700;
    color: ${props => {
      const percentage = (props.$score / props.$total) * 100;
      if (percentage >= 80) return 'var(--success-color)';
      if (percentage >= 60) return 'var(--primary-color)';
      return 'var(--error-color)';
    }};
  }

  .percentage {
    font-size: 0.9rem;
    color: var(--text-color);
    opacity: 0.7;
  }
`;

const DateDisplay = styled.div`
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

// Icons
const ClockIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const TrophyIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
  </svg>
);

const History = () => {
  const [attempts, setAttempts] = useState([]);
  const [stats, setStats] = useState({
    totalAttempts: 0,
    averageScore: 0,
    bestScore: 0,
    totalQuestions: 0
  });

  useEffect(() => {
    const loadAttempts = async () => {
      try {
        const db = await openDB('quizDB', 1);
        const allAttempts = await db.getAll('attempts');
        setAttempts(allAttempts.reverse()); // Show newest first

        // Calculate stats
        if (allAttempts.length > 0) {
          const totalAttempts = allAttempts.length;
          const scores = allAttempts.map(a => (a.score / a.totalQuestions) * 100);
          const averageScore = scores.reduce((a, b) => a + b, 0) / totalAttempts;
          const bestScore = Math.max(...scores);
          const totalQuestions = allAttempts.reduce((sum, attempt) => sum + attempt.totalQuestions, 0);

          setStats({
            totalAttempts,
            averageScore: Math.round(averageScore),
            bestScore: Math.round(bestScore),
            totalQuestions
          });
        }
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
      <PageTitle>Your Quiz Journey</PageTitle>
      
      <StatsContainer>
        <StatCard>
          <h4>Total Attempts</h4>
          <div className="value">{stats.totalAttempts}</div>
        </StatCard>
        <StatCard>
          <h4>Average Score</h4>
          <div className="value">{stats.averageScore}%</div>
        </StatCard>
        <StatCard>
          <h4>Best Score</h4>
          <div className="value">{stats.bestScore}%</div>
        </StatCard>
        <StatCard>
          <h4>Questions Answered</h4>
          <div className="value">{stats.totalQuestions}</div>
        </StatCard>
      </StatsContainer>

      {attempts.map((attempt, index) => {
        const percentage = Math.round((attempt.score / attempt.totalQuestions) * 100);
        return (
          <AttemptCard key={index} $index={index}>
            <AttemptHeader>
              <h3>
                <TrophyIcon /> Quiz Attempt #{attempts.length - index}
              </h3>
              <DateDisplay>
                <ClockIcon />
                {new Date(attempt.date).toLocaleString()}
              </DateDisplay>
            </AttemptHeader>
            
            <ScoreSection>
              <ScoreDisplay>
                <ScoreText $score={attempt.score} $total={attempt.totalQuestions}>
                  <div className="score">{attempt.score}/{attempt.totalQuestions}</div>
                  <div className="percentage">{percentage}%</div>
                </ScoreText>
                <ScoreBar $score={attempt.score} $total={attempt.totalQuestions} />
              </ScoreDisplay>
            </ScoreSection>
          </AttemptCard>
        );
      })}
    </HistoryContainer>
  );
};

export default History;

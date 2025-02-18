import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import QuizPage from './components/QuizPage';
import History from './components/History';
import Navbar from './components/Navbar';
import { QuizProvider } from './context/QuizContext';
import styled from 'styled-components';

const AppContainer = styled.div`
  min-height: 100vh;
  background: #f5f5f5;
`;

function App() {
  return (
    <QuizProvider>
      <Router>
        <AppContainer>
          <Navbar />
          <Routes>
            <Route path="/" element={<QuizPage />} />
            <Route path="/history" element={<History />} />
          </Routes>
        </AppContainer>
      </Router>
    </QuizProvider>
  );
}

export default App;

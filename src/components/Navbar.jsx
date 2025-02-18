import { Link, useLocation } from 'react-router-dom';
import styled from 'styled-components';

const Nav = styled.nav`
  background: var(--card-background);
  padding: 1rem 0;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  position: sticky;
  top: 0;
  z-index: 1000;
  backdrop-filter: blur(8px);
  background: rgba(255, 255, 255, 0.9);
`;

const NavContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Logo = styled.h1`
  background: linear-gradient(135deg, var(--gradient-start), var(--gradient-end));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  font-size: 1.8rem;
  font-weight: 800;
  margin: 0;
  transition: transform 0.3s ease;

  &:hover {
    transform: scale(1.05);
  }
`;

const NavLinks = styled.div`
  display: flex;
  gap: 1rem;
`;

const NavLink = styled(Link)`
  text-decoration: none;
  color: var(--text-color);
  font-weight: 500;
  padding: 0.5rem 1.2rem;
  border-radius: 9999px;
  transition: all 0.3s ease;
  position: relative;
  background: ${props => props.$active ? 'linear-gradient(135deg, var(--gradient-start), var(--gradient-end))' : 'transparent'};
  color: ${props => props.$active ? 'white' : 'var(--text-color)'};

  &:hover {
    transform: translateY(-2px);
    background: ${props => props.$active ? 
      'linear-gradient(135deg, var(--gradient-start), var(--gradient-end))' : 
      'rgba(99, 102, 241, 0.1)'};
  }

  &::after {
    content: '';
    position: absolute;
    bottom: -2px;
    left: 0;
    width: 100%;
    height: 2px;
    background: linear-gradient(135deg, var(--gradient-start), var(--gradient-end));
    transform: scaleX(0);
    transition: transform 0.3s ease;
  }

  &:hover::after {
    transform: ${props => props.$active ? 'scaleX(0)' : 'scaleX(1)'};
  }
`;

const Navbar = () => {
  const location = useLocation();

  return (
    <Nav>
      <NavContainer>
        <Logo>QuizMaster</Logo>
        <NavLinks>
          <NavLink to="/" $active={location.pathname === '/'}>
            Take Quiz
          </NavLink>
          <NavLink to="/history" $active={location.pathname === '/history'}>
            My Progress
          </NavLink>
        </NavLinks>
      </NavContainer>
    </Nav>
  );
};

export default Navbar;

import { Link, useLocation } from 'react-router-dom';
import styled from 'styled-components';

const Nav = styled.nav`
  background: white;
  padding: 1rem 0;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
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
  color: var(--primary-color);
  font-size: 1.5rem;
  margin: 0;
`;

const NavLinks = styled.div`
  display: flex;
  gap: 1rem;
`;

const NavLink = styled(Link)`
  text-decoration: none;
  color: ${props => props.$active ? 'var(--primary-color)' : 'var(--text-color)'};
  font-weight: ${props => props.$active ? '600' : '400'};
  padding: 0.5rem 1rem;
  border-radius: 4px;
  transition: all 0.2s;

  &:hover {
    color: var(--primary-color);
    background: rgba(37, 99, 235, 0.1);
  }
`;

const Navbar = () => {
  const location = useLocation();

  return (
    <Nav>
      <NavContainer>
        <Logo>Quiz Platform</Logo>
        <NavLinks>
          <NavLink to="/" $active={location.pathname === '/'}>
            Quiz
          </NavLink>
          <NavLink to="/history" $active={location.pathname === '/history'}>
            History
          </NavLink>
        </NavLinks>
      </NavContainer>
    </Nav>
  );
};

export default Navbar;

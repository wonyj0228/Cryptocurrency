import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSun, faMoon } from '@fortawesome/free-solid-svg-icons';
import styled from 'styled-components';
import { useState } from 'react';

const Container = styled.div`
  width: 100%;
  padding: 15px 20px;

  display: flex;
  justify-content: space-between;
  align-items: center;
  box-sizing: border-box;
`;

const Home = styled.span`
  font-weight: bold;
  font-size: 40px;
  color: ${(props) => props.theme.accentColor};
`;

const MoveBar = styled.div`
  background-color: ${(props) => props.theme.accentColor};
  width: 25px;
  height: 25px;
  border-radius: 50%;

  position: absolute;
  left: 7px;

  transition: transform 0.2s ease;
`;

const ChkBox = styled.input.attrs({ type: 'checkbox' })`
  display: none;
  &:checked {
    & ~ ${MoveBar} {
      transform: translateX(32px);
    }
  }
`;

const Toggle = styled.div`
  background-color: ${(props) => props.theme.grayColor};
  width: 70px;
  height: 30px;
  border-radius: 20px;
  padding: 2px 5px;

  display: grid;
  grid-template-columns: 30px 30px;
  gap: 3px;
  align-items: center;
  justify-items: center;

  position: relative;
  cursor: pointer;

  svg {
    z-index: 0;
    font-size: 12px;
    color: ${(props) => props.theme.themeSunColor};
    &:last-child {
      color: ${(props) => props.theme.themeMoonColor};
    }
  }
`;

const Header = () => {
  const [isChecked, setIsChecked] = useState(false);

  const changeTheme = () => {
    setIsChecked((prev) => !prev);
  };
  return (
    <Container>
      <Home>CRYPTOCURRENCY</Home>
      <Toggle onClick={changeTheme}>
        <ChkBox checked={isChecked} readOnly={true} />
        <MoveBar />
        <FontAwesomeIcon icon={faSun} />
        <FontAwesomeIcon icon={faMoon} />
      </Toggle>
    </Container>
  );
};

export default Header;

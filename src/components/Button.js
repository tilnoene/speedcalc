import styled from 'styled-components';

const StyledButton = styled.button`
    width: 120px;
    height: 40px;
    background-color: orangered;
`;

const Button = ({ children, onClick, disabled=false }) => (
    <StyledButton disabled={disabled} onClick={onClick} >
        {children}
    </StyledButton>
);

export default Button;
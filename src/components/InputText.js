import styled from 'styled-components';

const StyledInput = styled.input`
    outline: none;
`;

const InputText = ({ value, handleChange }) => (
    <StyledInput 
        type='text'
        value={value} 
        onChange={e => handleChange(e.target.value)}
    />
);

export default InputText;
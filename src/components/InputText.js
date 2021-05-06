import styled from 'styled-components';

const StyledInput = styled.input`
    outline: none;
    border: none;
    width: 180px;
    height: 30px;
    font-size: 16px;
    padding-left: 7px;
    border-radius: 7px;

    ::-webkit-inner-spin-button {
        -webkit-appearance: none;
    }
`;

const InputText = ({ value, handleChange, onKeyPress }) => (
    <StyledInput 
        type='number'
        value={value}
        onKeyPress={e => {
            if (e.key === 'Enter')
                onKeyPress(value);
        }}
        onChange={e => handleChange(e.target.value)}
    />
);

export default InputText;
import { buildQueries } from '@testing-library/dom';
import styled from 'styled-components';

const ContainerKeyboard = styled.div`
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    grid-template-rows: 1fr 1fr 1fr 1fr;

    width: 210px;
    height: 280px;
    gap: 6px;
`;

const KeyboardButton = styled.button`
    background-color: orange;
    color: black;
    border-radius: 20px;
`;

const Keyboard = ({ value, handleChange, handleSubmit }) => {
    const buttons = [
        '1', '2', '3',
        '4', '5', '6',
        '7', '8', '9',
        'X', '0', 'S'
    ];

    const pressKey = ( key, value ) => {
        if (key === 'X')
            handleChange(value.slice(0, -1));
        else if (key === 'S')
            handleSubmit(value);
        else
            handleChange(value + key);
    }

    return (
        <ContainerKeyboard>
            {buttons.map(button => 
                <KeyboardButton onClick={() => pressKey(button, value)} key={button}>{button}</KeyboardButton>
            )}
        </ContainerKeyboard>
    );
};

export default Keyboard;
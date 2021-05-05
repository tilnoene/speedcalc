import styled from 'styled-components';

const Question = ({ question }) => {
    let operation = question.operation;

    if (operation === '*') operation = 'x';
    else if (operation === '/') operation = '/'; // símbolo da divisão

    return (
        <div>
            {question.first} {operation} {question.second}
        </div>
    );
}

export default Question;
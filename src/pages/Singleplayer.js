import { useEffect, useState } from 'react';
import styled from 'styled-components';
import { generateQuestions } from '../services/game';
import { sleep } from '../services/functions';

import Countdown from '../components/Countdown';
import Background from '../components/Background';
import Question from '../components/Question';
import InputText from '../components/InputText';
import Keyboard from '../components/Keyboard';
import Button from '../components/Button';

const Singleplayer = ({ level=1 }) => {
    const [keyboardOpened, setKeyboardOpened] = useState(window.innerWidth <= 768);
    const [countdown, setCountdown] = useState(3);
    const [questions, setQuestions] = useState([]);

    // user stats
    const [errors, setErrors] = useState(0);
    const [currentQuestion, setCurrentQuestion] = useState(1);
    const [userAnswer, setUserAnswer] = useState('');

    const submitAnswer = ( value ) => {
        if (value == questions[currentQuestion].answer)
            setCurrentQuestion(currentQuestion+1);
        else
            setErrors(errors+1);

        setUserAnswer('');
    }

    useEffect(() => {
        setQuestions(generateQuestions(level));
    }, []);
    
    // countdown
    useEffect(() => {
        if (countdown > 0) {
            setCountdown(countdown-1);
            //sleep(1000);
        }
    }, [countdown]);

    if (countdown > 0) return <Countdown number={countdown} />;
    
    if (currentQuestion === questions.length) return <div>FIM! estatísticas</div>;
    
    return (
        <Background>
            {currentQuestion} / {questions.length}

            <Question question={questions[currentQuestion]} />
            <InputText 
                handleChange={setUserAnswer} 
                value={userAnswer} 
                onKeyPress={submitAnswer}
            />
            {keyboardOpened && 
                <Keyboard 
                    handleChange={setUserAnswer} 
                    value={userAnswer}
                    handleSubmit={submitAnswer}
                />
            }
        </Background>
    );
}

export default Singleplayer;
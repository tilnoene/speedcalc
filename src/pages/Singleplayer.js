import { useEffect, useState } from 'react';
import styled from 'styled-components';
import { generateQuestions } from '../services/game';
import { sleep } from '../services/functions';

import Countdown from '../components/Countdown';
import Background from '../components/Background';
import Question from '../components/Question';
import InputText from '../components/InputText';
import Keyboard from '../components/Keyboard';

const Singleplayer = ({ level=1 }) => {
    const [countdown, setCountdown] = useState(3);
    const [questions, setQuestions] = useState([]);
    const [loadingQuestions, setLoadingQuestions] = useState(true);

    // user stats
    const [errors, setErrors] = useState(0);
    const [currentQuestion, setCurrentQuestion] = useState(1);

    const nextQuestion = () => {
        setCurrentQuestion(currentQuestion+1);
        setLoadingQuestions(false);
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
    
    if (!loadingQuestions && currentQuestion === questions.length+1) return <div>FIM! estatísticas</div>;

    return (
        <Background>
            {currentQuestion} / {questions.length}

            <Question question={questions[currentQuestion]} />
            <InputText />
            <Keyboard />
        </Background>
    );
}

export default Singleplayer;
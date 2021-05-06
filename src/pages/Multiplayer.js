import { useEffect, useState } from 'react';
import { Link, useParams, useHistory } from 'react-router-dom';
import { sleep } from '../services/functions';
import styled from 'styled-components';

import Background from '../components/Background';
import Button from '../components/Button';
import InputText from '../components/InputText';
import Question from '../components/Question';
import Keyboard from '../components/Keyboard';
import Countdown from '../components/Countdown';

const Multiplayer = () => {
    let history = useHistory();

    const [ws, setWs] = useState(new WebSocket('ws://localhost:9090'));
    const [clientId, setClientId] = useState(null);
    const [ownerId, setOwnerId] = useState(null);
    const [gameId, setGameId] = useState(useParams().room);
    const [inputValue, setInputValue] = useState('');
    const [gameState, setGameState] = useState('waiting');
    const [nickname, setNickName] = useState('matuê');
    const [playersFinished, setPlayersFinished] = useState(0);
    const [playersPosition, setPlayersPosition] = useState([]);

    // game
    const [players, setPlayers] = useState([]);
    const [questions, setQuestions] = useState([]);
    const [keyboardOpened, setKeyboardOpened] = useState(window.innerWidth <= 768);
    const [countdown, setCountdown] = useState(3);

    // player stats
    const [errors, setErrors] = useState(0);
    const [currentQuestion, setCurrentQuestion] = useState(1);
    const [userAnswer, setUserAnswer] = useState('');

    const createRoom = () => {
        const payLoad = {
            'method': 'create',
            'clientId': clientId
        }

        ws.send(JSON.stringify(payLoad));
        setOwnerId(clientId);
    }

    const joinGame = () => {
        if (gameId === null)
            gameId = inputValue;

        const payLoad = {
            'method': 'join',
            'clientId': clientId,
            'nickname': nickname,
            'gameId': gameId
        }

        ws.send(JSON.stringify(payLoad));
    }
    // update de acordo com a sala
    const startGame = () => {
        const payLoad = {
            'method': 'start',
            'gameId': gameId
        }

        ws.send(JSON.stringify(payLoad));
    }

    const finishGame = () => {
        const payLoad = {
            'method': 'finish',
            'gameId': gameId
        }

        ws.send(JSON.stringify(payLoad));
    }

    useEffect(() => {
        if (playersFinished > 0 && playersFinished === players.length)
            finishGame();
    }, [playersFinished]);

    /*useEffect(() => {
        if (elapsedTime >= totalTime)
            finishGame();
    }, [elapsedTime]);*/

    const submitAnswer = ( value ) => {
        let payLoad = {
            'method': 'play',
            'gameId': gameId,
            'clientId': clientId,
            'isError': false
        }

        if (value == questions[currentQuestion].answer) {
            setCurrentQuestion(currentQuestion+1);
        } else {
            setErrors(errors+1);
            payLoad.isError = true;
        }

        setUserAnswer('');
        ws.send(JSON.stringify(payLoad));
    }
    
    // process "create" only one time
    useEffect(() => {
        ws.onmessage = message => {
            const response = JSON.parse(message.data);
    
            // connect
            if (response.method === 'connect') {
                setClientId(response.clientId);
            }
        }
    }, []);

    ws.onmessage = message => {
        const response = JSON.parse(message.data);

        if (response.method === 'create') {
            setGameId(response.game.id);

            history.push(`/${response.game.id}`);
        }

        if (response.method === 'update') {
            setGameState(response.status);

            let playersFinished = 0;
            let playersPosition = [];
            for (let player in response.state){
                let currentPlayerQuestion = response.state[player].currentQuestion;
                
                if (currentPlayerQuestion === questions.length)
                    playersFinished += 1;
                
                playersPosition.push({'nickname': response.state[player].nickname, currentPlayerQuestion});
            }
            
            console.log(playersPosition);
            setPlayersFinished(playersFinished);
            setPlayersPosition(playersPosition);
        }

        if (response.method === 'join') {
            setPlayers(response.game.clients);
            setQuestions(response.game.questions);
        }
    }

    useEffect(() => {
        if (gameId !== 'multiplayer' && clientId) {
            joinGame();
        }
    }, [clientId, gameId]);

    useEffect(() => {
        if (gameState === 'running') {
            console.log('iniciou');
            setCountdown(2);
        }
    }, [gameState]);

    // countdown
    useEffect(() => {
        if (countdown > 0 && countdown < 3) {
            setCountdown(countdown-1);
            sleep(1000);
        }
    }, [countdown]);

    // verifica se existe uma sala na URL
    if (gameId === 'multiplayer') {
        return (
            <Background>
                <Button onClick={() => createRoom()}>CRIAR NOVA SALA</Button>
                <InputText value={inputValue} handleChange={setInputValue} />
                <Link to={`/${inputValue}`}><Button onClick={() => setGameId(inputValue)}>ENTRAR NA SALA</Button></Link>
            </Background>
        );
    }

    // existe uma sala, verificar se ela existe

    // jogo está rodando
    if (gameState === 'running') {
        if (countdown > 0) return <Countdown number={countdown} />;
    
        if (currentQuestion === questions.length) return <div>FIM! estatísticas</div>;
        
        return (
            <Background>
                <p>posições:</p>
                {playersPosition.map(player => (
                    <p>{player.nickname}: {player.currentPlayerQuestion}</p>
                ))}

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

    // jogo finalizado / estatísticas
    if (gameState === 'finished') {
        return (
            <div>
                finalizado
            </div>
        );
    }

    // waiting for start
    return (
        <Background>
            Jogadores atuais:

            aguardando o líder da sala iniciar o jogo...

            <p>jogadores:</p>
            {players.map(cp => <p key={cp.clientId}>player {cp.nickname}</p>)}

            {ownerId === clientId && <Button onClick={() => startGame()}>PLAY</Button>}
        </Background>
    );
}

export default Multiplayer;
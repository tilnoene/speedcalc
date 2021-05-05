import { useEffect, useState } from 'react';
import { Link, useParams, useHistory } from 'react-router-dom';
import styled from 'styled-components';

import Background from '../components/Background';
import Button from '../components/Button';
import InputText from '../components/InputText';

const Multiplayer = () => {
    let history = useHistory();

    const [inputValue, setInputValue] = useState('');
    const [clientId, setClientId] = useState(null);
    const [ownerId, setOwnerId] = useState(null);
    const [gameId, setGameId] = useState(useParams().room);
    const [ws, setWs] = useState(new WebSocket('ws://localhost:9090'));
    const [gameState, setGameState] = useState('waiting');
    // nickname too

    const [players, setPlayers] = useState([]);
    const [questions, setQuestions] = useState([]);
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [errors, setErrors] = useState(0);
    const [game, setGame] = useState({});

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
            'nickname': 'matuê',
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
        return (
            <Background>
                running
            </Background>
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
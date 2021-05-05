import { useState } from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';

import Background from '../components/Background';
import Button from '../components/Button';
import Singleplayer from './Singleplayer';

const HomePage = () => {
    const [singleplayer, setSingleplayer] = useState(false);

    // Singleplayer mode
    if (singleplayer) return <Singleplayer />;

    // default HomePage
    return (
        <Background>
            <Button onClick={() => setSingleplayer(true)} >SINGLEPLAYER</Button>
            <Link to='/multiplayer'><Button>MULTIPLAYER</Button></Link>
            <Button disabled>RANKING</Button>
        </Background>
    );
}

export default HomePage;
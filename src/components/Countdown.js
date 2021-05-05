import styled from 'styled-components';
import Background from './Background';

const Countdown = ({ number }) => (
    <Background>
        {number}
    </Background>
);

export default Countdown;
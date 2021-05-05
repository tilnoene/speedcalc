import { BrowserRouter, Route, Switch } from 'react-router-dom';

import HomePage from '../pages/HomePage';
import Multiplayer from '../pages/Multiplayer';

const Routes = () => (
    <BrowserRouter>
        <Switch>
            <Route exact path='/' component={() => <HomePage />} />
            <Route path='/:room' component={() => <Multiplayer />} />
        </Switch>
    </BrowserRouter>
);

export default Routes;
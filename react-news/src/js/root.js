import React from 'react';
import ReactDOM from 'react-dom';

import MediaQuery from 'react-responsive';
import PCIndex from './components/PC_index';
import MobileIndex from './components/mobile_index';
import MobileNewsDetails from './components/moblie_news_details';
import PCNewsDetails from './components/PC_news_details';
import PCUserCenter from './components/PC_usercenter';
import MobileUserCenter from './components/mobile_usercenter';
import { Route, Switch, HashRouter } from 'react-router-dom';

class Root extends React.Component {
    render() {
        return (
            <div>
                <MediaQuery query='(min-device-width:1224px)'>
                    <HashRouter  >
                        <Switch>
                            <Route exact path="/" component={PCIndex}></Route>
                            <Route path="/details/:realtype/:uniquekey" component={PCNewsDetails}></Route>
                            <Route path="/PCUserCenter" component={PCUserCenter}></Route>
                        </Switch>
                    </HashRouter>
                </MediaQuery>
                <MediaQuery query='(max-device-width:1224px)'>
                    <HashRouter  >
                        <Switch>
                            <Route exact path="/" component={MobileIndex}></Route>
                            <Route path="/details/:realtype/:uniquekey" component={MobileNewsDetails}></Route>
                            <Route path="/MobileUserCenter" component={MobileUserCenter}></Route>
                        </Switch>
                    </HashRouter>
                </MediaQuery>

            </div>
        );
    };
};

ReactDOM.render(<Root />, document.getElementById("app")
);
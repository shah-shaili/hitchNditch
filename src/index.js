import React from "react";
import ReactDOM from "react-dom";
import {BrowserRouter as Router, Route} from "react-router-dom";
import CssBaseline from "@material-ui/core/CssBaseline";

import Login from "./pages/login";
import Reserve from "./pages/reserve";
import DriverRider from "./pages/driver-rider";

class App extends React.Component {
    render() {
        return (
            <CssBaseline>
                <Router>
                    <Route path="/" exact component={Login} />
                    <Route path="/reserve" component={Reserve} />
                    <Route path="/driver-rider" component={DriverRider} />
                </Router>
            </CssBaseline>
        );
    }
}

ReactDOM.render(
    <App />,
    document.getElementById("app")
);
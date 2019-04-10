import React, { Component } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Navbar from "../navbar/Navbar";
import Home from "../home/Home";
import PageNotFound from "../404/PageNotFound";
import "../../styles/App.css";

class App extends Component {
  render() {
    return (
      <Router>
        <Navbar />
        <Switch>
          <Route path="/" exact component={Home} />
          <Route component={PageNotFound} />
        </Switch>
      </Router>
    );
  }
}

export default App;

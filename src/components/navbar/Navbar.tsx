import React, { Component } from "react";
import { Link } from "react-router-dom";
import AppBar from "@material-ui/core/AppBar";
import Button from "@material-ui/core/Button";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import "../../styles/Navbar.css";

class Navbar extends Component {
  render() {
    return (
      <header>
        <AppBar position="static" color="primary">
          <Toolbar>
            <Typography variant="h6" color="inherit">
              SmartChainDB
            </Typography>
            <div className="navbar-buttons">
              <Button component={() => <Link to="/" />} color="inherit">
                Home
              </Button>
            </div>
          </Toolbar>
        </AppBar>
      </header>
    );
  }
}
export default Navbar;

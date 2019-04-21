import {
  AppBar,
  Button,
  Icon,
  IconButton,
  Toolbar,
  Typography
} from '@material-ui/core';
import {
  Theme,
  withStyles,
  WithStyles,
  withTheme,
  WithTheme
} from '@material-ui/core/styles';
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import '../../styles/Navbar.css';

type NavbarProps = {
  onThemeChange: (darkMode: boolean) => void;
} & WithStyles &
  WithTheme;

const styles = (theme: Theme) => ({
  grow: {
    flexGrow: 1
  },
  iconButton: {
    margin: theme.spacing.unit
  }
});

class Navbar extends Component<NavbarProps> {
  changeTheme = () => {
    if (!!this.props.onThemeChange) {
      this.props.onThemeChange(this.props.theme.palette.type === 'light');
    }
  };

  render() {
    const { classes } = this.props;

    return (
      <header>
        <AppBar position="static" color="primary">
          <Toolbar>
            <Typography variant="h6" color="inherit">
              SmartChainDB
            </Typography>
            <div className="navbar-buttons">
              <Button
                component={({ innerRef, ...props }) => (
                  <Link {...props} to="/" />
                )}
                color="inherit"
              >
                Home
              </Button>
            </div>
            <div className={classes.grow} />
            <IconButton
              className={classes.iconButton}
              onClick={this.changeTheme}
            >
              <Icon>wb_incandescent</Icon>
            </IconButton>
          </Toolbar>
        </AppBar>
      </header>
    );
  }
}

export default withTheme()(withStyles(styles)(Navbar));

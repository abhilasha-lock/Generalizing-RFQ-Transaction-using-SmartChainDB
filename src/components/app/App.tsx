import { CssBaseline } from '@material-ui/core';
import {
  createMuiTheme,
  MuiThemeProvider,
  withTheme,
  WithTheme
} from '@material-ui/core/styles';
import React, { lazy, Suspense } from 'react';
import ContentLoader from 'react-content-loader';
import { MemoryRouter as Router, Route, Switch } from 'react-router-dom';

import '../../styles/App.css';
import PageNotFound from '../404/PageNotFound';
import Navbar from '../navbar/Navbar';

const Home = lazy(() => import('../home/Home'));

function ContentLoaderComponent() {
  return <ContentLoader speed={1} />;
}

function LazyComponent(Component: any) {
  return (props: any) => (
    <Suspense fallback={ContentLoaderComponent()}>
      <Component {...props} />
    </Suspense>
  );
}

const theme = createMuiTheme({
  typography: {
    useNextVariants: true
  }
});

class App extends React.Component<WithTheme> {
  onThemeChange = (darkMode: boolean) => {
    console.log(darkMode);
  };

  render() {
    return (
      <MuiThemeProvider theme={theme}>
        <React.Fragment>
          <CssBaseline />
          <Router>
            <Navbar onThemeChange={this.onThemeChange} />
            <Switch>
              <Route path="/" exact component={LazyComponent(Home)} />
              <Route component={PageNotFound} />
            </Switch>
          </Router>
        </React.Fragment>
      </MuiThemeProvider>
    );
  }
}

export default withTheme()(App);

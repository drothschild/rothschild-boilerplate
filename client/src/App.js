import React, { Component } from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

import ApolloClient, { createNetworkInterface } from 'apollo-client';
import { ApolloProvider } from 'react-apollo';

import Header from './components/Header';
import LoginForm from './components/LoginForm';
import SignupForm from './components/SignupForm';
import EditAccountForm from './components/EditAccountForm';
import Dashboard from './components/Dashboard';
import TokenLogin from './components/TokenLogin';
import requireAuth from './components/requireAuth';
import './App.css';

const networkInterface = createNetworkInterface({
  uri: '/graphql',
  opts: {
    credentials: 'same-origin',
  },
});

const client = new ApolloClient({
  networkInterface,
  dataIdFromObject: o => o.id,
});

class App extends Component {
  render() {
    return (
      <ApolloProvider client={client}>
        <MuiThemeProvider>
          <Router>
            <div>
              <Header />
              <Route path="/login" component={LoginForm} />
              <Route path="/signup" component={SignupForm} />
              <Route path="/editAccount" component={requireAuth(EditAccountForm)} />
              <Route path="/token/:token" component={TokenLogin} />
              <Route path="/dashboard" component={requireAuth(Dashboard)} />
            </div>
          </Router>
        </MuiThemeProvider>
      </ApolloProvider>
    );
  }
}

export default App;

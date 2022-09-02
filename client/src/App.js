import React from 'react';
import { ApolloClient, ApolloProvider, createHttpLink, InMemoryCache } from '@apollo/client';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { setContext } from '@apollo/client/link/context';

import Detail from './pages/Detail';
import Home from './pages/Home';
import Login from './pages/Login';
import Nav from './components/Nav';
import NoMatch from './pages/NoMatch';
import OrderHistory from './pages/OrderHistory';
import Signup from './pages/Signup';
import Success from './pages/Success';

const httpLink = createHttpLink({
  uri: '/graphql',
});

const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem('id_token');
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${ token }` : '',
    },
  };
});

const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});

function App() {
  return (
    <ApolloProvider client={ client }>
      <Router>
        <div>
          <Nav/>
          <Switch>
            <Route exact path="/" component={ Home }/>
            <Route exact path="/login" component={ Login }/>
            <Route exact path="/signup" component={ Signup }/>
            <Route exact path="/orderHistory" component={ OrderHistory }/>
            <Route exact path="/products/:id" component={ Detail }/>
            <Route exact path="/success" component={ Success }/>
            <Route component={ NoMatch }/>
          </Switch>
        </div>
      </Router>
    </ApolloProvider>
  );
}

export default App;

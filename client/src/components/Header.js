import React, { Component } from 'react';
import { graphql } from 'react-apollo';
import query from '../queries/CurrentUser';
import mutation from '../mutations/Logout';
import AppBar from 'material-ui/AppBar';
import FlatButton from 'material-ui/FlatButton';
class Header extends Component {
  onLogoutClick() {
    this.props.mutate({
      refetchQueries: [{ query }],
    });
  }

  renderButtons() {
    const { loading, user } = this.props.data;
    if (loading) {
      return <div>Loading...</div>;
    }

    if (user) {
      return (
        <div>
          {user.email}
          <FlatButton label="Edit Account" href="/editaccount" />
          <FlatButton onClick={this.onLogoutClick.bind(this)} label="Logout" />
        </div>
      );
    }
    return (
      <div>
        <FlatButton label="Sign Up" href="/signup" />
        <FlatButton label="Login" href="/login" />
      </div>
    );
  }

  render() {
    return <AppBar title="App" iconElementRight={this.renderButtons()} />;
  }
}

export default graphql(mutation)(graphql(query)(Header));

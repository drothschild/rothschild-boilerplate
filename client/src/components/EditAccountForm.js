import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import AuthForm from './AuthForm';
import mutation from '../mutations/UpdateAccount';
import { graphql } from 'react-apollo';
import query from '../queries/CurrentUser';

class EditAccountForm extends Component {
  constructor(props) {
    super(props);
    this.state = { errors: [] };
  }

  onSubmit({ email, password }) {
    const id = this.props.data.user.id;
    this.props
      .mutate({
        variables: { id, email, password },
        refetchQueries: [{ query }],
      })
      .catch(res => {
        const errors = res.graphQLErrors.map(error => error.message);
        this.setState({ errors });
      });
  }

  render() {
    const { user } = this.props.data;
    if (!user) {
      return <div>Loading...</div>;
    }
    return (
      <div>
        <h3>Edit Your Account</h3>
        <AuthForm errors={this.state.errors} onSubmit={this.onSubmit.bind(this)} email={this.props.data.user.email} />
      </div>
    );
  }
}

export default withRouter(graphql(query)(graphql(mutation)(EditAccountForm)));

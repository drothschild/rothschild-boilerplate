import React, { Component } from "react";
import mutation from "../mutations/LoginWithLink";
import { graphql } from "react-apollo";
import query from "../queries/CurrentUser";
import { withRouter } from "react-router-dom";

class TokenLogin extends Component {
  constructor(props) {
    super(props);
    this.state = { errors: [] };
  }

  componentWillUpdate(nextProps) {
    if (!this.props.data.user && nextProps.data.user) {
      this.props.history.push("/dashboard");
    }
  }

  componentDidMount() {
    const token = this.props.match.params.token;
    this.props
      .mutate({
        variables: { token },
        refetchQueries: [{ query }]
      })
      .catch(res => {
        const errors = res.graphQLErrors.map(error => error.message);
        this.setState({ errors });
      });
  }

  render() {
    if (!this.props.data) {
      return <div>Checking Token...</div>;
    }
    if (this.state.errors) {
      return (
        <div className="errors">
          {this.state.errors.map(error => <div key={error}>{error}</div>)}
        </div>
      );
    }
    return <div>Logging you in...</div>;
  }
}

export default withRouter(graphql(query)(graphql(mutation)(TokenLogin)));

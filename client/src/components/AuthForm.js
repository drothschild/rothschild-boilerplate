import React, { Component } from 'react';
import TextField from 'material-ui/TextField';
class AuthForm extends Component {
  constructor(props) {
    super(props);
    let email = '';
    if (props.email) {
      email = props.email;
    }
    this.state = { email, password: '' };
  }

  onSubmit(event) {
    event.preventDefault();

    this.props.onSubmit(this.state);
  }

  render() {
    return (
      <div className="row">
        <form onSubmit={this.onSubmit.bind(this)} className="col s6">
          <TextField
            hintText="Email"
            value={this.state.email}
            onChange={e => this.setState({ email: e.target.value })}
          />
          <div>
            <TextField
              hintText="Password"
              type="password"
              value={this.state.password}
              onChange={e => this.setState({ password: e.target.value })}
            />
          </div>
          <div className="errors">{this.props.errors.map(error => <div key={error}>{error}</div>)}</div>
          <button className="btn">Submit</button>
        </form>
      </div>
    );
  }
}

export default AuthForm;

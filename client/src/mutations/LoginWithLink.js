import gql from 'graphql-tag';

export default gql`
  mutation LoginWithLink($token: String) {
    loginWithLink(token: $token) {
      id
      email
    }
  }
`;

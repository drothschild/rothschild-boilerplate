import gql from 'graphql-tag';

export default gql`
  mutation Update($id: ID, $email: String, $password: String) {
    update(id: $id, email: $email, password: $password) {
      id
    }
  }
`;

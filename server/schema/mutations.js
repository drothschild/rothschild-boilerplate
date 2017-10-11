const graphql = require('graphql');

const { GraphQLObjectType, GraphQLString, GraphQLID } = graphql;
const UserType = require('./types/user_type');
const AuthService = require('../services/auth');

const mutation = new GraphQLObjectType({
  name: 'Mutation',
  fields: {
    signup: {
      type: UserType,
      args: {
        email: { type: GraphQLString },
        password: { type: GraphQLString },
      },
      resolve(parentValue, { email, password }, req) {
        return AuthService.signup({ email, password, req });
      },
    },
    logout: {
      type: UserType,
      resolve(parentValue, args, req) {
        const { user } = req;
        req.logout();
        return user;
      },
    },
    login: {
      type: UserType,
      args: {
        email: { type: GraphQLString },
        password: { type: GraphQLString },
      },
      resolve(parentValue, { email, password }, req) {
        return AuthService.login({ email, password, req });
      },
    },
    loginWithLink: {
      type: UserType,
      args: { token: { type: GraphQLString } },

      resolve(parentValue, { token }, req) {
        return AuthService.loginWithLink({ token, req });
      },
    },
    update: {
      type: UserType,
      args: {
        email: { type: GraphQLString },
        password: { type: GraphQLString },
        id: { type: GraphQLID },
      },
      resolve(parentValue, { id, email, password }) {
        return AuthService.updateAccount({ id, email, password });
      },
    },
  },
});

module.exports = mutation;

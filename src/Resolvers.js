import { PubSub, UserInputError, withFilter } from 'apollo-server';
import { find, filter } from 'lodash';
import { users } from './Constants';
import CheckAuthorization from './CheckAuthorization';

const pubsub = new PubSub();
const USER_CREATED = 'USER_CREATED';
const USER_DELETED = 'USER_DELETED';
const GET_USER = 'GET_USER';

export const resolvers = {
  Query: {
    user: (obj, args) => {filter(users, { _id: args._id })},
    // users: () => users,
    users: async (obj, args, context) => {
      const { dataSources } = context;
      const { limit, skip } = args;
      const response = await dataSources.trainee.getTrainees(limit, skip);
      return response.data.records;
    },
  },

  Mutation: {
    async createUser(parent, args, context) {
      const { _id, name, role, email, createdAt } = args;

      const foundUser = await find(users, { _id });
      if (foundUser) throw new Error('User already Exist');
      await users.push({ _id, name, role, email, createdAt });

      const foundNewUser = await find(users, { _id });

      const temp = { ...foundNewUser };

      pubsub.publish(USER_CREATED, {
        userCreated: temp,
      });

      pubsub.publish(GET_USER, {
        getUser: temp,
      });

      return temp;
    },

    async deleteUser(parent, args, context) {
      const { _id } = args;
      const { token } = context;
      const foundOldUser = await find(users, { _id });

      if (!foundOldUser) throw new UserInputError('Invalid data for deletion');
      const flag = await CheckAuthorization(token);
      if (flag) {
        await users.map(key => (
          key._id === _id
            ? users.pop({ _id })
            : ''
        ));

        const temp = { ...foundOldUser };

        pubsub.publish(USER_DELETED, {
          userDeleted: temp,
        });

        return temp;
      } else {
        throw new Error('User not Authenticate !');
      }
    },

    async updateUser(parent, args) {
      const { _id, name } = args;
      const foundUser = await find(users, { _id });
      if (!foundUser) throw new Error('User does not Exist');
      foundUser._id = _id;
      foundUser.name = name;
      return foundUser;
    },
  },

  Subscription: {
    userCreated: {
      subscribe: () => pubsub.asyncIterator([USER_CREATED]),
    },

    userDeleted: {
      subscribe: () => pubsub.asyncIterator([USER_DELETED]),
    },

    getUser: {
      subscribe: withFilter(
        () => pubsub.asyncIterator([GET_USER]),
        (payload, variable) => {
          return payload.getUser._id === variable._id
        },
      )
    },
  },
};

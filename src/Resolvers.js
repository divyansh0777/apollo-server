import { PubSub } from 'apollo-server';
import { find, filter } from 'lodash';
import { users, roles, errorList } from './Constants';
import { CheckAuthorization } from './CheckAuthorization';

const pubsub = new PubSub();
const USER_CREATED = 'USER_CREATED';

export const resolvers = {
  Query: {
    getError: () => errorList,
    user: (obj, args) => filter(users, { id: args.id }),
    role: (obj, args) => filter(roles, { role: args.role }),
    users: () => users,
    roles: () => roles,
  },

  User: {
    role: parent => find(roles, { id: parent.id }),
  },

  Roles: {
    user: parent => filter(users, { id: parent.id }),
  },

  Mutation: {
    async createUser(parent, args) {
      const { id, name, role } = args;

      const foundUser = await find(users, { id });
      if (foundUser) throw new Error('User already Exist');
      await users.push({ id, name });

      const foundRole = await find(roles, { id });
      if (foundRole) throw new Error('User created but role already exists for this user');
      await roles.push({ id, role });

      const foundNewUser = await find(users, { id });
      const foundNewRole = await find(roles, { id });

      const temp = { ...foundNewUser, role: { ...foundNewRole } };

      pubsub.publish(USER_CREATED, {
        userCreated: temp,
      });

      return temp;
    },

    async deleteUser(parent, args, context) {
      const { id } = args;
      const { token } = context;
      const foundOldUser = await find(users, { id });
      const foundOldRole = await find(roles, { id });

      if (!foundOldUser && !foundOldRole) throw new Error('User not found');
      console.log('>>', CheckAuthorization);
      const flag = await CheckAuthorization(token);
      if (flag) {
        await users.map(key => (
          key.id === id
            ? users.pop({ id })
            : ''
        ));

        await roles.map(key => (
          key.id === id
            ? roles.pop({ id })
            : ''
        ));
        const temp = { ...foundOldUser, role: { ...foundOldRole } };

        return temp;
      } else {
        throw new Error('User not Authenticate !');
      }
    },

    async updateUser(parent, args) {
      const { id, name } = args;
      const foundUser = await find(users, { id });
      if (!foundUser) throw new Error('User does not Exist');
      foundUser.id = id;
      foundUser.name = name;
      return foundUser;
    },
  },

  Subscription: {
    userCreated: {
      subscribe: () => pubsub.asyncIterator([USER_CREATED]),
    },
  },
};

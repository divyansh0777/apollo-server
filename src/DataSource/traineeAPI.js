import { RESTDataSource } from 'apollo-datasource-rest';

class trainee extends RESTDataSource{
  constructor() {
    super();
    this.baseURL = 'https://express-training.herokuapp.com';
  }

  willSendRequest(request) {
    request.headers.set('Authorization', this.context.token);
  }

  getTrainees = async (limit, skip) => {
    try {
      const response = await this.get(`/api/trainee?limit=${limit}&skip=${skip}`);
      return response;
    } catch (err) {
      throw new Error('Cannot fetch trainee data !')
    }
  }

  getTrainee = async (id) => {
    try {
      const response = await this.get(`/api/user/me`);
      return response;
    } catch (err) {
      throw new Error('Cannot fetch trainee data !')
    }
  }

}

export default new trainee();

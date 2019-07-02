import { RESTDataSource } from 'apollo-datasource-rest';

class trainee extends RESTDataSource{
  constructor() {
    super();
    this.baseURL = 'https://express-training.herokuapp.com';
  }

  getTrainees = () => {
    console.log('IN');
    const response = this.get('/api/trainee/?limit=10&skip=0');
    return response;
  }
}

export default new trainee();

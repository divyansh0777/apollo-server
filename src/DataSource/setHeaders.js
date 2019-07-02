import { RESTDataSource } from 'apollo-datasource-rest';

class setHeaders extends RESTDataSource {
  constructor() {
    super();
    console.log('SET HEADERS');
  }

  willSendRequest(request) {
    request.headers.set('authorization', request.headers.authorization);
  }
}

export default new setHeaders();

import Express from 'express';
import Index from '@/controllers/index';

class router extends Express.Router {
  constructor(props) {
    super(props);
    this.get('/', Index.homePage);
  }

}

export default new router();

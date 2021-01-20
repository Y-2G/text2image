import Text from './Text'
import Line from './Line'
import Page from './Page'

class Scene { 
  private _collection: Page[] = [];

  public get colleciton(): Page[] {
    return this._collection;
  }

  public append( page: Page ) {
    this._collection.push( page );
  }

  public get(): Page[] {
    return this.colleciton;
  }

}

export default Scene;
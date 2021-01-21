import Block from './Block';
import CanvasObject from './CanvasObject'

class Scene { 
  private _collection: Block[] = [];

  public get collection(): Block[] {
    return this._collection;
  }

  public append( obj: Block ) {
    this._collection.push( obj );
  }
}

export default Scene;
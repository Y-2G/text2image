import Size from './Size';
import Text from './Text'
import Position from './Position'

class Line {
  private _collection: Text[] = [];

  public get collection(): Text[] {
    return this._collection;
  }

  public get value(): string {
    let result: string = '';
    this._collection.forEach( e => result += e.value );
    return result;
  }

  public get position(): Position {
    return this._collection[ 0 ].position;
  }

  public get width(): number {
    let result: number = 0;
    this._collection.forEach( e => result += e.size );
    return result;
  }

  public get height(): number {
    return this._collection.slice( -1 )[ 0 ].position.y + this._collection[0].size;
  }

  public append( text: Text ): void {
    this._collection.push( text ); 
  }
}

export default Line;
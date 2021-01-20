import Text from './Text'
import Size from './Size'
import Position from './Position'

class Line {
  private _size: Size = new Size();
  private _position: Position = new Position();
  private _collection: Text[] = [];

  public get size() : Size {
    return this._size;
  }

  public get position(): Position {
    return this._position;
  }

  public get collection(): Text[] {
    return this._collection;
  }

  public get value(): string {
    return this.collection.map( e => e.value ).join( '' );
  }

  public append( text: Text ): void {
    this._collection.push( text );
  }

  public move( x: number, y: number ) {
    this._collection.forEach( e => e.position.move( x, y ) )
  }
}

export default Line;
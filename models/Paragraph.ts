import Text from './Text';
import Size from './Size';
import Position from './Position';

class Paragraph {
  private _type: string = '';

  private _list: Array<Text> = [];
  
  private _margin: number = 0;

  private _size = new Size();

  private _position = new Position();

  public get type(): string {
    return this._type;    
  }

  public set type( type: string ) {
    this._type = type;
  }

  public get value(): string {
    return this._list.reduce( ( a, b ) => a + b.value + '\n', '');    
  }
  
  public get list(): Array<Text> {
    return this._list;    
  }

  public get position(): Position {
    return this._position;
  }

  public get width(): number {
    return this._size.width;
  }

  public get height(): number {
    return this._size.height + this._margin;
  }

  public get margin(): number {
    return this._margin;
  }

  public set margin( margin: number ) {
    this._margin = margin;
  }

  public append( obj: Text ): void {
    obj.move( 0, this.height );

    this._list.push( obj );

    this._size.height = this.height + obj.height;

    if( this.width > obj.width ) this._size.width = obj.size.width;
  }

  public move( x: number, y: number ) {
    this.position.move( x, y );
    this._list.forEach( e => e.move( x, y ) );
  }

  public reset( x: number, y: number ) {
    const distX: number = x - this._position.x;
    const distY: number = y - this._position.y;

    this._position.reset( x, y );
    
    this._list.forEach( e => e.move( distX, distY ) );
  }
}

export default Paragraph;
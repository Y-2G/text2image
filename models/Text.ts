import Size from './Size';
import Position from './Position';

class Text {
  private _type: string = '';

  private _value: string = '';

  private _size: Size = new Size();

  private _position: Position = new Position();

  private _settings: any = null;

  private _margin: number = 0;

  public get type(): string {
    return this._type;
  }
  
  public set type( type: string ) {
    this._type = type;
  }

  public get value(): string {
    return this._value;
  }

  public set value( value: string ){
    this._value = value;
  }

  public get size(): Size {
    return this._size;
  }

  public set size( size: Size ) {
    this._size = size;
  }

  public get position(): Position {
    return this._position;
  }

  public set position( position: Position ) {
    this._position = position;
  }

  public get settings(): any {
    return this._settings;
  }

  public set settings( settings: any ) {
    this._settings = settings;
  }

  public get margin(): number {
    return this._margin;
  }
  
  public set margin( margin: number ) {
    this._margin = margin;
  }

  public get width(): number {
    return this._size.width;
  }

  public get height(): number {
    return this._size.height + this._margin;
  }

  public move( x: number, y: number ) {
    this.position.move( x, y );
  }

  public reset( x: number, y: number ) {
    this.position.reset( x, y );
  }
}

export default Text;
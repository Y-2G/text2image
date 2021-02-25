import Size from './Size';
import Position from './Position';

export default abstract class CanvasObject {
  protected _type: string = '';

  protected _content: any = null;

  protected _size: Size = new Size();

  protected _position: Position = new Position();

  public get type(): string {
    return this._type;
  }

  public set type( type: string ){
    this._type = type;
  }

  public get content(): any {
    return this._content;
  }

  public set content( content: any ){
    this._content = content;
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

  public abstract get settings(): any;

  public abstract get text(): any;

  public abstract move( x: number, y: number ): void;
  
  public abstract reset( x: number, y: number ): void;
}

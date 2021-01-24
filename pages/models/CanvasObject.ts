import Size from './Size'
import Position from './Position'

abstract class CanvasObject {
  protected _type: string = '';
  protected _size: Size = new Size();
  protected _content: any = null;
  protected _position: Position = new Position();

  public abstract get content(): any;
  public abstract move( x: number, y: number ): void;

  public get type(): string {
    return this._type;
  }

  public get size() : Size {
    return this._size;
  }

  public get position(): Position {
    return this._position;
  }

  public set type( type: string ) {
    this._type = type;
  }

  public set size( size: Size ) {
    this._size = size;
  }

  public set position( position: Position ) {
    this._position = position;
  }
}

export default CanvasObject;
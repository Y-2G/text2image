import Size from './Size'
import Position from './Position'

abstract class CanvasObject {
  protected _size: Size = new Size();
  protected _position: Position = new Position();
  protected _content: any = null;

  public abstract get content(): any;

  public get size() : Size {
    return this._size;
  }
  
  public get position(): Position {
    return this._position;
  }

  public set size( size: Size ) {
    this._size = size;
  }

  public set position( position: Position ) {
    this._position = position;
  }
}

export default CanvasObject;
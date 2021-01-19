import Font from './Font'
import Position from './Position'

class Line {
  private _font: Font = null;
  private _value: string = '';
  private _position: Position = null;

  public constructor( font: Font, value: string, position: Position ) {
    this._font = font;
    this._value = value;
    this._position = position;
  }

  public get font() {
    return this._font;
  }

  public get value() {
    return this._value;
  }

  public get position(): Position {
    return this._position;
  }

  public get width(): number {
    return this._value.length * this._font.size;
  }

  public get height(): number {
    return this._font.size * this._font.lineHeight;
  }

  public append( char: string ): void {
    this._value += char; 
  }

}

export default Line;
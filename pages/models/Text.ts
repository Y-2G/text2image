import Font from './Font'
import Position from './Position'

class Text {
  private _font: Font = null;
  private _value: string = '';
  private _position: Position = null;

  constructor( font, value, position ) {
    this._font = font;
    this._value = value
    this._position = position;
  }

  public get font(): Font {
    return this._font;
  }

  public get value(): string {
    return this._value;
  }

  public get position(): Position {
    return this._position;
  }
}

export default Text;
import Position from './Position'
import TextSettings from './TextSettings';

class Text {
  private _value: string = '';
  private _settings: TextSettings = null;
  private _position: Position = new Position();

  constructor( value: string, settings: TextSettings ) {
    this._value = value;
    this._settings = settings;
  }

  public get font(): string {
    return this._settings.font;
  }

  public get size(): number {
    return this._settings.size;
  }

  public get lineHeight(): number {
    return this._settings.height;
  }

  public get value(): string {
    return this._value;
  }

  public get position(): Position {
    return this._position;
  }
}

export default Text;
import TextSettings from './TextSettings';
import CanvasObject from './CanvasObject';

class Text extends CanvasObject {
  protected _settings: TextSettings = null;
  protected _content: string = '';

  constructor( settings: TextSettings, content: string ) {
    super();
    this._settings = settings;
    this._content = content;
  }

  public get content(): string {
    return this._content;
  }

  public get settings(): TextSettings {
    return this._settings;
  }

  public move( x: number, y: number ) {
    this.position.move( x, y );
  }
}

export default Text;
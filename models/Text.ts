import CanvasObject from './CanvasObject';

export default class Text extends CanvasObject {

  protected _content: string = '';

  protected _settings: any = null;

  constructor() {
    super();
  }

  public set content( content: string ) {
    this._content = content;
  }

  public get content(): string {
    return this._content;
  }

  public set settings( settings: any ) {
    this._settings = settings;
  }

  public get settings(): any {
    return this._settings;
  }

  public get text() {
    return this;
  }

  public move( x: number, y: number ) {
    this.position.move( x, y );
  }

  public reset( x: number, y: number ) {
    this.position.reset( x, y );
  }
}

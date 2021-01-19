class Font {
  private _size: number = 0;
  private _lineHeight: number = 0;
  private _fontFamily: string = '';

  public constructor( size: number, lineHeight: number, fontFamily: string = '' ) {
    this._size = size;
    this._lineHeight = lineHeight;
    this._fontFamily = fontFamily;
  }

  public get size(): number {
    return this._size;
  }
  
  public get lineHeight(): number {
    return this._lineHeight;
  }

  public get fontFamily(): string {
    return this._fontFamily;
  }
}

export default Font;
import Token from './Token'

export default class ContextForText {
  
  private readonly _reader: any;

  public constructor( reader: any ) {
    this._reader = reader;
  }

  public createTokenList() {
    const result: Array<object> = [];

    // トークンの型
    let t: string = this._reader.type;
    
    // トークンの値
    let v: Array<string> = [ this._reader.value ];

    result.push( new Token( t, v ) );

    return result;
  }
}

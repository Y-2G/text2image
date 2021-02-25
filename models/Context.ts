import Token from './Token'

export default class Context {
  
  private readonly _reader: FileReader;

  public constructor( reader: FileReader ) {
    this._reader = reader;
  }

  public createTokenList() {

    const result: Array<object> = [];

    const content: string = this._reader.result.toString();

    // 区切り文字の位置
    let p: number = 0;
    
    // テキストの1文字
    let c: string = '';

    // トークンの型
    let t: string = '';
    
    // トークンの値
    let v: Array<string> = [];

    for ( let i = 0; i < content.length; i++ ) {

      c = content.charAt( i );

      if ( c.match( /^[N|A|B|C|E]$/ ) === null ) continue;

      if ( i === 0 ) continue;

      t = content.slice( p, p + 1 );

      v = content.slice( p + 2, i ).replaceAll( /[\r\n|\n|\r]+$/g, '' ).split( '\n' );
      
      p = i;

      result.push( new Token( t, v ) );
    
    }

    return result;
  
  }

}

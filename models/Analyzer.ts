import Text from './Text';
import Size from './Size';
import Scene from './Scene';
import Context from './Context';
import Paragraph from './Paragraph';

export default class Analyzer {

  private _context: Context = null;

  private _settings: any = null;

  private _scene: Scene = null;

  public constructor( context: Context, settings: any ) {
    this._context = context;
    this._settings = settings;
  }

  public get context(): Context {
    return this._context;
  }

  public get settings(): any {
    return this._settings;
  }

  public get scene(): any {
    return this._scene;
  }

  public execute() {
    const w: number = this.settings.limit.max.x - this.settings.limit.min.x;
    const y: number = this.settings.limit.max.y - this.settings.limit.min.y;
    
    this._scene = new Scene();
    this._scene.size = new Size( w, y );

    this.createStory();
    this.adjustPosition();
    
    return this._scene;
  }

  public createStory() {
    const tokenList = this.context.createTokenList();

    for( let i = 0; i < tokenList.length; i++ ) {
      this._scene.append( this.createParagraph( tokenList[ i ] ) );
    }    
  }

  public createParagraph( token ) {
    const type = token.type;
    const value = token.value;

    let sentence: Array<Text> = [];

    for( let i = 0; i < value.length; i++ ) {
      sentence = sentence.concat( this.createSentence( type, value[ i ] ) );
    }

    const paragraph: Paragraph = new Paragraph();
    paragraph.type = token.type;
    paragraph.margin = 40;

    sentence.forEach( e => paragraph.append( e ) );

    return paragraph;
  }

  // Textオブジェクトを保存する
  public createSentence( type: string, value: string ) {
    const canvas: HTMLCanvasElement = this.settings.canvas;
    const context: CanvasRenderingContext2D = canvas.getContext( '2d' );

    const settings: any = this._settings.text[ type ];
    const limit: number = this.settings.limit.max.x - this.settings.limit.min.x;

    context.font = `${ settings.size }px ${ settings.font }`;

    let p: number = 0;
    let v: string = '';
    let m: TextMetrics = null;

    const result: Array<Text> = [];

    for( let i = 0; i < value.length; i++ ) {
      // slice で最後の文字まで切り出すため i + 1 をしている
      v = value.slice( p, i + 1 );

      m = context.measureText( v );

      if( i === value.length - 1 ) result.push( this.createText( type, settings, v, m ) );

      if( m.width <= limit ) continue;

      result.push( this.createText( type, settings, v, m ) );

      p = i;
    }

    return result;
  }

  public createText( t, s, v, m ) {
    const w: number = m.width;
    const h: number = m.actualBoundingBoxAscent + m.actualBoundingBoxDescent;

    const text: Text = new Text();
    
    text.type = t;

    text.value = v;
    
    text.settings = s;
    
    text.size = new Size( w, h );

    text.margin = 0;

    return text;
  }

  public adjustPosition() {
      this.adjustTextPositionX();
      this.adjustTextPositionMargin();
  }

  public adjustTextPositionX() {
    const pages = this._scene.content;
    for( let i = 0; i < pages.length; i++ ) {
      pages[ i ].adjustPosition();
    }
  }
  
  public adjustTextPositionMargin() {
    const x: number = this.settings.limit.min.x;
    const y: number = this.settings.limit.min.y;

    const paragraphs: Array<Paragraph> = this._scene.paragraphs;
    
    for( let i = 0; i < paragraphs.length; i++ ) {
      paragraphs[ i ].move( x, y );
    }
  }
}

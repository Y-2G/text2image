import Text from './Text';
import Size from './Size';
import Block from './Block';
import Scene from './Scene';
import Context from './Context';

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
    
    const paragraph: Block = new Block();
   
    paragraph.type = type;

    let sentence: Block = null;

    for( let i = 0; i < value.length; i++ ) {
      sentence = this.createSentence( type, value[ i ] );
      paragraph.append( sentence );
    }

    const marginBottom = paragraph.size.height * 0.6;

    paragraph.size.height = paragraph.size.height + marginBottom;
    
    return paragraph;
  }

  // Textオブジェクトを保存する
  public createSentence( type: string, value: string ) {
    const canvas: HTMLCanvasElement = this.settings.canvas;
    const context: CanvasRenderingContext2D = canvas.getContext( '2d' );

    const settings: any = this._settings.text[ type ];
    const limit: number = this.settings.limit.max.x - this.settings.limit.min.x;

    context.font = `${ settings.size }px ${ settings.font }`;

    const sentence: Block = new Block();

    sentence.type = type;

    let p: number = 0;
    let v: string = '';
    let m: TextMetrics = null;

    for( let i = 0; i < value.length; i++ ) {
      // slice で最後の文字まで切り出すため i + 1 をしている
      v = value.slice( p, i + 1 );

      m = context.measureText( v );

      if( i === value.length - 1 ) sentence.append( this.createText( type, settings, v, m ) );

      if( m.width <= limit ) continue;

      sentence.append( this.createText( type, settings, v, m ) );

      p = i;
    }

    return sentence;
  }

  public createText( t, s, v, m ) {
    const w: number = m.width;
    const h: number = m.actualBoundingBoxAscent + m.actualBoundingBoxDescent;

    const text: Text = new Text();
    
    text.type = t;

    text.content = v;
    
    text.settings = s;
    
    text.size = new Size( w, h );

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

    const textList: Array<Text> = this._scene.text;
    
    for( let i = 0; i < textList.length; i++ ) {
      textList[ i ].move( x, y );
    }
  }
}

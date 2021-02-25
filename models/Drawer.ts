import Context from './Context';
import Analyzer from './Analyzer';

export default class Drawer {

  private _context;
  
  private _analyzer;

  private _settings;

  public constructor( reader, settings ) {
    this._settings = settings;

    this._context = new Context( reader );
    
    this._analyzer = new Analyzer( this._context, settings );
  }

  public draw() {
    const result = [];

    const canvas: HTMLCanvasElement = this._settings.canvas;
    const context: CanvasRenderingContext2D = canvas.getContext( '2d' );

    const scene = this._analyzer.execute();
    
    const textList = scene.text;
    
    for( let i = 0; i < textList.length; i++ ) {
      const v: string = textList[ i ].content;
      const x: number = textList[ i ].position.x;
      const y: number = textList[ i ].position.y;

      context.font = `${ textList[ i ].settings.size }px ${ textList[ i ].settings.font }`;
      context.fillStyle = textList[ i ].settings.color;
      context.textBaseline = 'top';
  
      // アウトラインを設定する
      context.strokeStyle = textList[ i ].settings.outline;
      context.lineWidth = 3;
  
      // ドロップシャドウを設定する
      context.shadowColor = textList[ i ].settings.outline;
      context.shadowBlur = 0;
      context.shadowOffsetX = 3;
      context.shadowOffsetY = 1;
      context.strokeText( v, x, y );
      context.fillText( v, x, y );

      result.push( canvas.toDataURL( "image/png" ) );
      context.clearRect( 0, 0, canvas.width, canvas.height );
    }

    return result;
  }
}

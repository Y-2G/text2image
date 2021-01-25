import Factory from "./Factory";
import Limit from "./Limit";
import Block from "./Block";
import Position from "./Position";
import { Scenario } from "./Scenario";
import Scene from "./Scene";
import CanvasObject from './CanvasObject'
import Page from "./Page";
import Size from "./Size";

class Drawer {
  private canvas: HTMLCanvasElement = null;
  private scenario: Scenario = null;
  private limit: Limit = null;
  private scene = new Scene();

  public constructor( canvas: HTMLCanvasElement, scenario: Scenario, limit: Limit ) {
    this.limit = limit;
    this.canvas = canvas;
    this.scenario = scenario;
    this.init();
  }
  
  public init() {
    this.createA();
    this.adjust();
  }
  
  public adjust() {
    const pages = this.scene.content;
    for( let i = 0; i < pages.length; i++ ) {
      pages[ i ].adjust();
      pages[ i ].move( this.limit.min.x, this.limit.min.y );
    }
  }

  public createA() {
    let pages = [];
    const parts = this.scenario.content;

    for( let i = 0; i < parts.length; i++ ) {
      pages = pages.concat( this.createB( parts[ i ] ) );
    }

    for( let i = 0; i < pages.length; i++ ) {
      this.scene.append( pages[ i ] );
    }
  }

  public createB( part ) {
    const pages = [];
    const width = this.limit.max.x - this.limit.min.x;
    const height = this.limit.max.y - this.limit.min.y;
    const size = new Size( width, 0 );
    const paragraphs = part.content;

    let page: Page = null;
    let block: Block = null;

    for( let i = 0; i < paragraphs.length; i++ ) {
      if( pages.length === 0 ) pages.push( new Page( size ) );
      page = pages[ pages.length - 1 ];
      block = this.createC( paragraphs[ i ] )
      if( page.size.height + block.size.height > height ) {
        page = new Page( size );
        pages.push( page );
      }
      page.append( block );
    }
    
    return pages;
  }

  public createC( paragraph ): Block {
    const settings = Factory.createTextSettings( paragraph.type );

    const context = this.canvas.getContext( '2d' );
    context.font = `${ settings.size }px ${ settings.font }`;

    const max: number = this.limit.max.x - this.limit.min.x;
    const position: Position = new Position();
    
    const block: Block = new Block();
    block.type = paragraph.type;

    for( let i = 0; i < paragraph.value.length; i++ ) {
      const char = paragraph.value.charAt( i );

      const mesure = context.measureText( char );

      const width  = mesure.width;
      const height = settings.size * settings.height;

      if( char === '\n' ) {
        if( position.x === 0 ) continue;
        position.move( -position.x, height );
        continue;
      }

      const text = Factory.createText( settings, char );
      text.size.width  = width;
      text.size.height = height;
      text.position.x  = position.x;
      text.position.y  = position.y;

      block.append( text );

      if( position.x + width < max ) position.move( width, 0 );
      if( position.x + width > max ) position.move( -position.x, height );
    }

    const margin = settings.size * settings.height * 0.5;
    block.size.height = block.size.height + margin;

    return block;
  }

  public draw() {
    if( this.canvas === null ) return;

    const result = [];

    const context = this.canvas.getContext( '2d' );

    const pages: CanvasObject[] = this.scene.content;

    for( let i = 0; i < pages.length; i++ ) {

      const lines = pages[ i ].content;

      for( let j = 0; j < lines.length; j++ ) {

        const line = lines[ j ].content;

        for( let k = 0; k < line.length; k++ ) {
          const text = line[ k ];

          const v: string = text.content;
          const x: number = text.position.x;
          const y: number = text.position.y;

          context.font = `${ text.settings.size }px ${ text.settings.font }`;
          context.fillStyle = text.settings.color;
          context.textAlign = text.settings.align;
          context.textBaseline = 'top';
      
          // アウトラインを設定する
          context.strokeStyle = text.settings.outline;
          context.lineWidth = 3;
      
          // ドロップシャドウを設定する
          context.shadowColor = text.settings.outline;
          context.shadowBlur = 0;
          context.shadowOffsetX = 3;
          context.shadowOffsetY = 1;
          context.strokeText( v, x, y );
          context.fillText( v, x, y );
        }

        result.push( this.canvas.toDataURL( "image/png" ) );
        context.clearRect( 0, 0, this.canvas.width, this.canvas.height );
      }

    }

    return result;
  }

}

export default Drawer;
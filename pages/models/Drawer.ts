import Factory from "./Factory";
import Limit from "./Limit";
import Block from "./Block";
import Page from "./Page";
import Position from "./Position";
import LimitedPosition from "./LimitedPosition";
import { Scenario } from "./Scenario";
import Scene from "./Scene";

class Drawer {
  private canvas: HTMLCanvasElement = null;
  private scenario: Scenario
  private limit: Limit = null;
  private scene = new Scene();
  private pages = [];
  private lines = [];
  private texts = [];

  public constructor( canvas: HTMLCanvasElement, scenario: Scenario, limit: Limit ) {
    this.limit = limit;
    this.canvas = canvas;
    this.scenario = scenario;
    this.init();
  }
  
  public init() {
    const p = this.scenario.getParagraphs();
    
    for( let i = 0; i < p.length; i++ ) {
      this.createLine( p[ i ] );
    }

    this.createPage();
  }

  public createLine( paragraph ) {
    const type = paragraph.type;
    const value = paragraph.value;
    const settings = Factory.createTextSettings( type );

    const context = this.canvas.getContext( '2d' );
    context.font = `${ settings.size }px ${ settings.font }`;

    const block: Block = new Block();

    const position: Position = new Position();
    
    for( let i = 0; i < value.length; i++ ) {
      const text = Factory.createText( settings, value.charAt( i ) );

      const mesure = context.measureText( text.content );
      const width  = mesure.width;
      const height = settings.size * settings.height;

      text.size.width = width;
      text.size.height = height;
      text.position.reset( position.x, position.y );

      block.append( text );

      // const height = mesure.actualBoundingBoxAscent + mesure.actualBoundingBoxDescent

      if( position.x + width < this.limit.max.x - this.limit.min.x ) position.move( width, 0 );
      if( position.x + width > this.limit.max.x - this.limit.min.x ) position.move( -position.x, height );
    }

    this.lines.push( block );
  }

  public createPage( ) {
    const block: Block = new Block();

    const position: LimitedPosition = new LimitedPosition( this.limit );
    
    for( let i = 0; i < this.lines.length; i++ ) {
      this.lines[ i ].move( position.x, position.y );

      block.append( this.lines[ i ] );

      const y = this.lines[ i ].size.height;

      if( position.canMoveY( y ) === true ) position.move( 0, y );
      if( position.canMoveY( y ) === false ) position.reset( this.limit.min.x, this.limit.min.y );
    }

    this.scene.append( block );
  }

  public draw() {
    if( this.canvas === null ) return;

    const result = [];

    const context = this.canvas.getContext( '2d' );

    const blocks: Block[] = this.scene.collection;

    for( let i = 0; i < blocks.length; i++ ) {

      const lines = blocks[ i ].content;

      for( let j = 0; j < lines.length; j++ ) {

        const line = lines[ j ].content;

        for( let k = 0; k < line.length; k++ ) {

          const text = line[ k ];

          const v: string = text.content;
          const x: number = text.position.x;
          const y: number = text.position.y;

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
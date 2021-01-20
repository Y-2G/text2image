import Factory from "./Factory";
import Limit from "./Limit";
import Line from "./Line";
import Page from "./Page";
import Position from "./Position";
import LimitedPosition from "./LimitedPosition";
import { Scenario } from "./Scenario";
import Scene from "./Scene";

class Drawer {
  private canvas: HTMLCanvasElement = null;
  private scenario: Scenario
  private limit: Limit = null;
  private position = new Position();
  private scene = new Scene();
  private pages = [];
  private lines = [];
  private texts = [];

  public constructor( canvas: HTMLCanvasElement, scenario: Scenario, limit: Limit ) {
    this.limit = limit;
    this.canvas = canvas;
    this.scenario = scenario;
    this.position = new Position(limit.min.x, limit.min.y);
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

    const context = this.canvas.getContext( '2d' );

    const line: Line = new Line();
    const position: LimitedPosition = new LimitedPosition( this.limit );
    
    for( let i = 0; i < value.length; i++ ) {
      const text = Factory.createText( type, value.charAt( i ) );

      text.position.reset( position.x, position.y );

      line.append( text );

      context.font = `${ text.size }px ${ text.font }`;

      const mesure = context.measureText( text.value );
 
      const width  = mesure.width;
      const height = text.size * text.lineHeight;
      // const height = mesure.actualBoundingBoxAscent + mesure.actualBoundingBoxDescent

      position.move( width, height )
    }

    this.lines.push( line );
  }

  public createPage() {
    if( this.pages.length === 0 ) this.pages.push( new Page() );
    
    for( let i = 0; i < this.lines.length; i++ ) {
      const line = this.lines[ i ];

      if( line.position.y === this.limit.min.y ) this.pages.push( new Page() );

      const page = this.pages.slice( -1 )[ 0 ] || null;

      page.append( line );
    }
  }

  public newLine( y ) {
    const nowY = this.position.y;
    const newY = nowY + y;

    if( newY < this.limit.max.y ) return this.position.reset( this.limit.min.x, newY );
    
    this.position.reset( this.limit.min.x, this.limit.min.y )
  }

  public move( x, y ) {
    const nowX = this.position.x;
    const nowY = this.position.y;
    const newX = nowX + x;
    const newY = nowY + y;

    if( newX < this.limit.max.x ) return this.position.reset( newX, nowY );

    if( newY < this.limit.max.y ) return this.position.reset( this.limit.min.x, newY );

    this.position.reset( this.limit.min.x, this.limit.min.y );
  }

  public draw() {
    if( this.canvas === null ) return;

    const result = [];

    const context = this.canvas.getContext( '2d' );

    for( let i = 0; i < this.pages.length; i++ ) {

      const lines = this.pages[ i ].collection;

      for( let j = 0; j < lines.length; j++ ) {

        const texts = lines[ j ].collection;

        for( let k = 0; k < texts.length; k++ ) {

          const context = this.canvas.getContext( '2d' );
  
          const v: string = texts[ k ].value;
          const x: number = texts[ k ].position.x;
          const y: number = texts[ k ].position.y;
      
          context.strokeText( v, x, y );
          context.fillText( v, x, y );
  
        }

        result.push( this.canvas.toDataURL( "image/png" ) );

        context.clearRect( 0, 0, this.canvas.width, this.canvas.height )

      }

    }

    return result;
  }

}

export default Drawer;
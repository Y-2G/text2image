import Font from './Font'
import Line from './Line'
import Limit from './Limit'
import Vector from './Vector'
import Position from './Position'
import Factory from './Factory'

class Canvas {
  private canvas: HTMLCanvasElement = null;
  private font: Font = null;
  private limit: Limit = null;
  private position: Position = null;
  private collection: Line[] = [];

  public constructor( canvas: HTMLCanvasElement, limit: Limit) {
    this.canvas = canvas;
    this.limit = limit;

    // TODO: インスタンス生成方法を改善する
    console.log(limit)
    const vector = new Vector( limit.getMinX(), limit.getMinY() );
    // const vector = new Vector( limit.getMinX(), limit.getMinY() );
    this.position = new Position( vector );
  }

  public append( char: string ) {
    if( char.match( /[N|A|B|C]/ ) !== null ) return this.setFont( char );

    if( char === '\n' ) return this.newLine();

    const line = this.getTargetLine();

    if( line === null ) return;

    return line.append( char );
  }

  public setFont( char ) {
    this.font = Factory.createFont( char );
  }

  public getTargetLine() {
    const line = this.collection.slice( -1 )[ 0 ] || null;
    
    if( line === null ) return this.newLine();

    if( line.getWidth() > this.limit.getMaxX() ) return this.newLine();

    return line;
  }

  public newLine() {
    const x = this.position.getX();
    const y = this.position.getY();
    const h = this.font.getSize() * this.font.getLineHeight();

    if( y + h > this.limit.getMaxY() ) return null;
    
    if( this.collection.length > 0 ) this.position.move( 0, h );

    // TODO: インスタンス生成方法を改善する
    const vector = new Vector( this.position.getX(), this.position.getY() );
    const position = new Position( vector )
    const line = Factory.createLine( this.canvas, this.font, position );
    
    this.collection.push( line )
    
    return line;
  }

  public draw() {
    for( let i = 0; i < this.collection.length; i++ ) {
      this.collection[ i ].draw();
    }
  }
}

export default Canvas;

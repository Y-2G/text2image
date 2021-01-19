import Font from './Font'
import Position from './Position'

class Line {
  private font: Font = null;
  private value: string = '';
  private position: Position = null;
  private canvas: HTMLCanvasElement = null;

  public constructor( canvas: HTMLCanvasElement, font: Font, position: Position ) {
    this.canvas = canvas;
    this.font = font;
    this.position = position;
  }

  public getWidth(): number {
    const context = this.canvas.getContext( '2d' );
    return context.measureText( this.value ).width;
  }

  public getHeight(): number {
    return this.font.size * this.font.lineHeight;
  }

  public append( char: string ) {
    this.value = this.value + char;    
  }

  public draw() {
    if( this.canvas === null ) return;

    const context = this.canvas.getContext( '2d' );

    context.font = `${ this.font.size }px ${ this.font.fontFamily }`;

    const v: string = this.value;
    const x: number = this.position.x;
    const y: number = this.position.y;

    context.strokeText( v, x, y );
    context.fillText( v, x, y );
  }
}

export default Line;
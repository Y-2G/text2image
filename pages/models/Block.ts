import CanvasObject from './CanvasObject';

class Block extends CanvasObject {
  protected _content: CanvasObject[] = [];

  public get content(): CanvasObject[] {
    return this._content;
  }

  public append( obj: CanvasObject ): void {
    this.content.push( obj );
    
    const w = obj.position.x + obj.size.width;
    const h = obj.position.y + obj.size.height;
    if( w > this.size.width )  this.size.width = w;
    if( h > this.size.height ) this.size.height = h;
  }

  public reset( x: number, y: number ) {
    this.position.reset( x, y );
    this.content.forEach( e => e.position.move( x, y ) );
  }

  public move( x: number, y: number ) {
    this.position.move( x, y );
    this.content.forEach( e => e.position.move( x, y ) );
  }
}

export default Block;
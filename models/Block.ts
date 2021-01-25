import CanvasObject from './CanvasObject';

class Block extends CanvasObject {
  protected _type: string = '';
  protected _content: CanvasObject[] = [];

  public get content(): CanvasObject[] {
    return this._content;
  }

  public set content( content: CanvasObject[] ) {
    this._content = content;
  }

  public append( obj: CanvasObject ): void {
    this.content.push( obj );
    
    const w = obj.position.x + obj.size.width;
    const h = obj.position.y + obj.size.height;
    
    if( w > this.size.width )  this.size.width = w;
    if( h > this.size.height ) this.size.height = h;
  }

  public move( x: number, y: number ): void {
    this.position.move( x, y );
    this.content.forEach( e => e.move( x, y ) );
  }

  public adjust(): void {
    throw 'error';
  }
}

export default Block;
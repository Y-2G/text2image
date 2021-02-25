import CanvasObject from './CanvasObject';

export default class Block extends CanvasObject {
  protected _content: Array<CanvasObject> = [];

  constructor() {
    super();
  }
  
  public get content(): Array<CanvasObject> {
    return this._content;
  }

  public get settings(): any {
    return this._content[ 0 ].settings;
  }
  
  public get text(): Array<CanvasObject> {
    let result = [];

    for( let i = 0; i < this._content.length; i++ ) {
      result = result.concat( this._content[ i ].text );
    }
    
    return result;
  }

  public move( x: number, y: number ) {
    for( let i = 0; i < this._content.length; i++ ) {
      this._content[ i ].move( x, y );
    }
  }

  public reset( x: number, y: number ) {
    for( let i = 0; i < this._content.length; i++ ) {
      this._content[ i ].reset( x, y );
    }
  }

  public append( obj: CanvasObject ): void {
    obj.move( 0, this._size.height );

    this._size.width = obj.size.width > this._size.width ? obj.size.width : this._size.width;
    
    this._size.height = this._size.height + obj.size.height;

    this._content.push( obj );
  }

  public concat( obj: Block ): Block {
    for( let i = 0; i < obj.content.length; i++ ) {
      this.append( obj.content[ i ] );
    }
    
    return this;
  }
}

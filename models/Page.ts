import Size from './Size';
import Block from './Block';
import CanvasObject from './CanvasObject';

export default class Page extends Block {
  protected _content: Array<CanvasObject> = [];

  public get content(): Array<CanvasObject> {
    return this._content;
  }

  constructor( size: Size ) {
    super();
    this._size = size;
  }

  public append( obj: CanvasObject ): any {
    const sum = this._content.reduce( ( a: number, c: CanvasObject ) => a + c.size.height, 0 );

    obj.move( 0, sum );

    return this._content.push( obj );
  }

  public hasSpace( obj ): boolean {
    const sum = this._content.reduce( ( a: number, c: CanvasObject ) => a + c.size.height, 0 );
    return sum + obj.size.height < this._size.height;
  }

  public adjustPosition(): void {
    this.adjustPositionX();
  }

  public adjustPositionX(): void {
    const right = this._size.width - this.getMaxWidthByType( 'A' );

    for( let i = 0; i < this.text.length; i++ ) {
      const child = this.text[ i ];

      if( child.settings.align === 'left' ) continue;

      if( child.settings.align === 'right' ) child.move( right, 0 );

      if( child.settings.align === 'center' ) child.move( (this._size.width - child.size.width) / 2, 0 );
    }
  }

  public getMaxWidthByType( type: string ): number {
    let width: number = 0;

    for( let i = 0; i < this._content.length; i++ ) {
      const child = this._content[ i ];

      if( child.settings.type !== type ) continue;

      if( child.size.width > width ) width = child.size.width;
    }

    return width;
  }
}

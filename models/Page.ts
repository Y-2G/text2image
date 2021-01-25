import Block from './Block'

class Page extends Block {
  protected _type: string = '';
  protected _content: Block[] = [];

  public get type(): string {
    return this._type;
  }

  public get content(): Block[] {
    return this._content;
  }

  public constructor( size ) {
    super();
    this._size.width = size.width;
    this._size.height = size.height;
  }

  public append( obj: Block ): void {
    this.content.push( obj );
    this.size.height += obj.size.height;
  }

  public adjust(): void {
    this.adjustX();
    this.adjustY();
  }

  public adjustX(): void {
    const right = this.size.width - this.getMaxWidthByType( 'A' );
    for( let i = 0; i < this.content.length; i++ ) {
      const child = this.content[ i ];
      if( child.type !== 'A' ) continue;
      child.move( right, 0 );
    }
  }

  public adjustY(): void {
    let y: number = 0;
    for( let i = 0; i < this.content.length; i++ ) {
      const child = this.content[ i ];
      child.move( 0, y );
      y += child.size.height;
    }
  }

  public getMaxWidthByType( type: string ): number {
    let width: number = 0;
    for( let i = 0; i < this.content.length; i++ ) {
      const child = this.content[ i ];
      if( child.type !== type ) continue;
      if( child.size.width > width ) width = child.size.width;
    }
    return width;
  }

}

export default Page;
import Text from './Text';
import Size from './Size';
import Paragraph from './Paragraph';

class Page {
  private _type: string = '';

  private _list: Array<Paragraph> = [];

  private _size = new Size();

  private MIN_X = 220;
  private MAX_X = 1700;
  private MIN_Y = 200;
  private MAX_Y = 970;

  public get type(): string {
    return this._type;
  }

  public set type( type: string ) {
    this._type = type;
  }

  public get width(): number {
    return this._size.width;
  }

  public get height(): number {
    return this._size.height;
  }

  public get maxWidth(): number {
    return this.MAX_X - this.MIN_X;
  }

  public get maxHeight(): number {
    return this.MAX_Y - this.MIN_Y;
  }

  public get list(): Array<Text> {
    return this._list.reduce( ( a, b ) => a.concat( b.list ), []);
  }

  public get paragraphs(): Array<Paragraph> {
    return this._list;
  }

  public append( obj: Paragraph ): void {
    obj.move( 0, this.height );
    
    this._list.push( obj );

    this._size.height = this.height + obj.height;

    if( this.width > obj.width ) this._size.width = obj.width;
  }

  public hasSpace( obj ): boolean {
    return this.height + obj.height < this.maxHeight;
  }

  public adjustPosition(): void {
    this.adjustPositionX();
  }

  public adjustPositionX(): void {
    const right = this.maxWidth - this.getMaxWidthByType( 'A' );

    const list: Array<Text> = this.list;

    for( let i = 0; i < list.length; i++ ) {
      if( list[ i ].settings.align === 'left' ) continue;

      if( list[ i ].settings.align === 'right' ) list[ i ].reset( right, list[ i ].position.y );

      if( list[ i ].settings.align === 'center' ) list[ i ].move( ( this.maxWidth - list[ i ].width ) / 2, 0 );
    }
  }

  public getMaxWidthByType( type: string ): number {
    const list: Array<Text> = this.list.filter( e => e.settings.type === type );
    return list.reduce( ( max: number, obj:Text ) => Math.max( max, obj.width ), 0 );
  }
}

export default Page;
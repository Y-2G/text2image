import Size from './Size';
import Page from './Page';
import CanvasObject from './CanvasObject';

export default class Scene {
  private _size: Size = new Size();

  private _content: Array<Page> = [];
  
  public get content(): Array<Page> {
    return this._content;
  }

  public get size() {
    return this._size;
  }

  public set size( size: Size ) {
    this._size = size;
  }

  public append( obj: CanvasObject ): any {
    const page = this.getTargetPage( obj );
    page.append( obj );
  }

  public getTargetPage( obj: CanvasObject ) {
    if( this._content.length === 0 ) return this.createPage();
    
    if( this.isSeparatePage( obj ) === true ) return this.createPage();

    let page: Page = this._content.slice( -1 )[ 0 ];

    if( page.hasSpace( obj ) === true ) return page;

    return this.createPage();
  }

  public isSeparatePage( obj: CanvasObject ) {
    if( this._content.length === 0 ) return false;

    const page: Page = this._content.slice( -1 )[ 0 ];

    const narration: string = 'N';
    const conversation: string = 'C';

    const curType: string = page.type !== narration ? conversation : narration;
    const newType: string = obj.type  !== narration ? conversation : narration;
    
    if( curType === newType ) return false;

    if( curType === narration && newType !== narration ) return true;

    if( curType !== narration && newType === narration ) return true;
  }

  public createPage() {
    const page = new Page( this._size );
    
    this._content.push( page );
    
    return page;
  }

  public get text() {
   let result = [];

    for( let i = 0; i < this._content.length; i++ ) {
      result = result.concat( this._content[ i ].text )
    }

    return result;
}

}

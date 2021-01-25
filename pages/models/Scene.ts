import Block from './Block';
import Page from './CanvasObject'

class Scene { 
  protected _content: Page[] = [];

  public get content(): Page[] {
    return this._content;
  }

  public append( obj: Page ) {
    this._content.push( obj );
  }
}

export default Scene;
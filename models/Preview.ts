import Scene from './Scene';
import PreviewItem from './PreviewItem';

class Preview {
  private _list: Array<PreviewItem> = [];

  private _scene: Scene = null;

  public constructor( scene ) {
    this._scene = scene;
  }

  public get list() {
    return this._list;
  }

  public updateList( id ) {
    const CANVAS_WIDTH  = 1920;
    const CANVAS_HEIGHT = 1080;

    const canvas = document.createElement( 'canvas' );
    const context = canvas.getContext( '2d' );

    canvas.width = CANVAS_WIDTH;
    canvas.height = CANVAS_HEIGHT;

    const paragraph = this._list[ id ].text;

    for( let i = 0; i < paragraph.list.length; i++ ) {
      const text = paragraph.list[ i ];

      // テキストの値を更新
      const v: string = text.value;
      const x: number = text.position.x;
      const y: number = text.position.y;

      context.font = `${ text.settings.size }px ${ text.settings.font }`;
      context.fillStyle = text.settings.color;

      // アウトラインを設定する
      context.lineWidth = 3;
      context.strokeStyle = text.settings.outline;

      // ドロップシャドウを設定する
      context.shadowBlur = 0;
      context.shadowOffsetX = 3;
      context.shadowOffsetY = 1;
      context.shadowColor = text.settings.outline;
    
      // テキストを描画する
      context.strokeText( v, x, y );
      context.fillText( v, x, y );

    }

    const image = canvas.toDataURL( "image/png" );
    this._list[ id ].image = image;

    return this._list;
  } 

  public createList(): Array<PreviewItem> {
    const CANVAS_WIDTH  = 1920;
    const CANVAS_HEIGHT = 1080;

    const canvas = document.createElement( 'canvas' );
    const context = canvas.getContext( '2d' );

    canvas.width = CANVAS_WIDTH;
    canvas.height = CANVAS_HEIGHT;

    const textList = this._scene.textList;

    for( let i = 0; i < textList.length; i++ ) {    
      const v: string = textList[ i ].value;
      const x: number = textList[ i ].position.x;
      const y: number = textList[ i ].position.y;

      context.font = `${ textList[ i ].settings.size }px ${ textList[ i ].settings.font }`;
      context.fillStyle = textList[ i ].settings.color;
  
      // アウトラインを設定する
      context.lineWidth = 3;
      context.strokeStyle = textList[ i ].settings.outline;
  
      // ドロップシャドウを設定する
      context.shadowBlur = 0;
      context.shadowOffsetX = 3;
      context.shadowOffsetY = 1;
      context.shadowColor = textList[ i ].settings.outline;
    
      // テキストを描画する
      context.strokeText( v, x, y );
      context.fillText( v, x, y );

      const image = canvas.toDataURL( "image/png" );
      const item: PreviewItem = new PreviewItem( i, textList[ i ], image );
      
      this._list.push( item );
    }

    return this._list;
  }

  public createListPerParagraph(): Array<PreviewItem> {
    const CANVAS_WIDTH  = 1920;
    const CANVAS_HEIGHT = 1080;
    
    const canvas = document.createElement( 'canvas' );
    const context = canvas.getContext( '2d' );

    canvas.width = CANVAS_WIDTH;
    canvas.height = CANVAS_HEIGHT;

    const paragraphs = this._scene.paragraphs;

    for( let i = 0; i < paragraphs.length; i++ ) {

      const  textList = paragraphs[ i ].list;

      for( let j = 0; j < textList.length; j++ ) {
        const v: string = textList[ j ].value;
        const x: number = textList[ j ].position.x;
        const y: number = textList[ j ].position.y;
  
        context.font = `${ textList[ j ].settings.size }px ${ textList[ j ].settings.font }`;
        context.fillStyle = textList[ j ].settings.color;
    
        // アウトラインを設定する
        context.lineWidth = 3;
        context.strokeStyle = textList[ j ].settings.outline;
    
        // ドロップシャドウを設定する
        context.shadowBlur = 0;
        context.shadowOffsetX = 3;
        context.shadowOffsetY = 1;
        context.shadowColor = textList[ j ].settings.outline;
      
        // テキストを描画する
        context.strokeText( v, x, y );
        context.fillText( v, x, y );
      }

      const image = canvas.toDataURL( "image/png" );
      const item: PreviewItem = new PreviewItem( i, paragraphs[ i ], image );

      this._list.push( item );

      context.clearRect( 0, 0, canvas.width, canvas.height );
    }

    return this._list;
  }
}

export default Preview;
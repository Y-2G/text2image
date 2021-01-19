import React, {useState,useEffect, isValidElement} from 'react'
import Head from 'next/head'
import styles from '../styles/Home.module.css'

import JSZip from 'jszip'

import Limit from './models/Limit'
import Vector from './models/Vector'
import Convertor from './models/Convertor'
import Font from './models/Font'
import Text from './models/Text'
import Line from './models/Line'
import Factory from './models/Factory'
import Position from './models/Position'
import { connect } from 'http2'
import { sep } from 'path'

export default function Home() {
  return (
    <div className={ styles.container }>
      <Head>
        <title>Create Next App</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Container />
    </div>
  )
}

const ASPECT_WIDTH = 1920;
const ASPECT_HEIGHT = 1080;

const MIN_X = 220;
const MIN_Y = 200;

const MAX_X = 1700;
const MAX_Y = 970;

interface Format {
  export( sentence: string ): Scenario;
}

// class SeparateNABCE implements Format {
//   export( sentence: string ): Scenario {
//     const result: Scenario = new Scenario();

//     // 区切り文字
//     const regExp = new RegExp( '[N|A|B|C|E]' );
  
//     // 区切り位置
//     let separatePoint: number = 0;

//     // 文章を1文字ずつ検査する
//     for( let i = 0; i < sentence.length; i++ ) {
//       // 区切り文字以外はスルー
//       if( regExp.test( sentence.charAt( i ) ) === false ) continue
  
//       // 最初の区切り文字はスルー
//       if( separatePoint >= i ) continue;
  
//       // 区切り文字をキーに設定する
//       const type = sentence.slice( separatePoint, separatePoint + 1 );
      
//       // 前回の区切り位置から行単位で区切って値に設定する
//       const value = sentence.slice( separatePoint + 2, i );
      
//       // オブジェクトを保存する
//       result.append( new Paragraph( type, value ) );
  
//       // 区切り位置を更新する
//       separatePoint = i;
//     }
  
//     return result;
//   }
// }

class SeparateNABCE implements Format {
  export( sentence: string ): Scenario {
    const result: Scenario = new Scenario();
    const test = sentence.split( '\n' );

    let type = '';
    for( let i = 0; i < test.length; i++ ) {
      if( test[i] === '' ) continue;

      if( test[i].match( /^[N|A|B|C|E]$/) !== null ) {
        type = test[i]
        continue; 
      }

      result.append( new Paragraph( type, test[i] ) );
    }
    return result;
  }
}

// ==================================================
// TODO: イテレーターにする？
class Scenario {
  private _collection: Paragraph[] = [];

  public append( paragraph: Paragraph ) {
    this._collection.push( paragraph );
  }

  public getParagraphs(): Paragraph[] {
    return this._collection;
  }
}

class Paragraph {
  private _type: string = '';
  private _value: string= '';
  
  constructor( type: string, value: string ) {
    this._type = type;
    this._value = value;
  }

  public get type(): string { 
    return this._type;
  }

  public get value(): string { 
    return this._value;
  }
}

// ==================================================

// ==================================================
class Scene { 
  private _collection: Page[] = [];

  public append( page: Page ) {
    this._collection.push( page );
  }

  public get() {
    return this._collection;
  }
}

class Page {
  private _collection = [];

  public append( list ) {
    this._collection.push( list )
  }

  public get() {
    return this._collection;
  }
}
// ==================================================

class Drawer {
  private canvas: HTMLCanvasElement = null;
  private scenario: Scenario
  private limit: Limit = null;
  private position = new Position();
  private scene = new Scene();
  private collection = [];

  public constructor( canvas: HTMLCanvasElement, scenario: Scenario, limit: Limit ) {
    this.limit = limit;
    this.canvas = canvas;
    this.scenario = scenario;
    this.position = new Position(limit.min.x, limit.min.y);
    this.init();
    this.test2()
  }
  
  public init() {
    const collection = this.scenario.getParagraphs();
    for( let i = 0; i < collection.length; i++ ) {
      this.test1( collection[ i ] );
    }
  }

  public test1( paragraph ) {
    const type = paragraph.type;
    const value = paragraph.value;

    let remain = value;

    while( remain.length > 0 ) {
      remain = this.createLine( type, remain );
    }
  }

  public createLine( type, str ) {
    const font = Factory.createFont( type );

    const position = new Position( this.position.x, this.position.y );

    const context = this.canvas.getContext( '2d' );

    context.font = `${ font.size }px ${ font.fontFamily }`;

    let separator = 0;

    for( let i = 0; i < str.length; i++ ) {
      const mesure = context.measureText( str.slice( 0, ++separator ) );
      if( this.limit.min.x + mesure.width > this.limit.max.x ) break;
      // const width  = mesure.width;
      // const height = mesure.actualBoundingBoxAscent + mesure.actualBoundingBoxDescent
    }

    const value = str.slice( 0, separator );

    this.collection.push( new Line( font, value, position ) );

    const newY = this.position.y + ( font.size * font.lineHeight );
    this.moveY( newY )

    return str.slice( separator, str.length );
  }

  public test2() {
    let test = [];

    for( let i = 0; i < this.collection.length; i++ ) {
      const e = this.collection[ i ];
      const y = e.position.y;

      if( i !== 0 && y === this.limit.min.y ) {
        this.createPage( test );
        test = [];
      } 

      test.push( e )
    }
  }

  public createPage( arr ) {
    const page = new Page();
    for( let i = 0; i < arr.length; i++ ) {
      page.append( arr[ i ] )
    }
    this.scene.append( page )
  }
  
  public moveY( newY, margin = 0 ) {
    if( newY < this.limit.max.y ) return this.position.set( this.limit.min.x, newY + margin );

    this.position.set( this.limit.min.x, this.limit.min.y );
  }

  public move( font ) {
    const nowX = this.position.x;
    const nowY = this.position.y;
    const newX = nowX + font.size;
    const newY = nowY + ( font.size * font.lineHeight );

    if( newX < this.limit.max.x ) return this.position.set( newX, nowY );

    if( newY < this.limit.max.y ) return this.position.set( this.limit.min.x, newY);

    this.position.set( this.limit.min.x, this.limit.min.y );
  }

  public draw() {
    if( this.canvas === null ) return;

    const context = this.canvas.getContext( '2d' );
    
    const test = this.scene.get();

    const result = [];
    for( let i = 0; i < test.length; i++ ) {
      const page = test[ i ]

      for( let j = 0; j < page.get().length; j++ ) {

        const line = page.get()[j]

        const context = this.canvas.getContext( '2d' );
        const v: string = line.value;
        const x: number = line.position.x;
        const y: number = line.position.y;
    
        context.strokeText( v, x, y );
        context.fillText( v, x, y );
      }
      
      result.push( this.canvas.toDataURL("image/png") );

      context.clearRect(0, 0, this.canvas.width, this.canvas.height)
    }

    return result
  }
}

const Container = () => {
  // contextを状態として持つ
  const [ context, setContext ] = useState( null );

  const [ pngList, setPngList ] = useState( null );

  // コンポーネントの初期化完了後コンポーネント状態にコンテキストを登録
  useEffect( () => { initialize(); }, [] );

  useEffect( () => { renderImgList(); }, [ pngList ] );

  const initialize = () => {
    const canvas: any = document.getElementById( 'canvas' );
    const context = canvas.getContext( '2d' );

    setContext( context );

    // アスペクト比を固定するためにCSSで16:9にした要素からサイズを取得する
    const scale = window.innerWidth / ASPECT_WIDTH;

    // canvas.width = ASPECT_WIDTH * scale;
    // canvas.height = ASPECT_HEIGHT * scale;

    canvas.width = ASPECT_WIDTH;
    canvas.height = ASPECT_HEIGHT;

  }

  // ファイル選択イベント
  const onChange = (e) => {
    const files = e.target.files;

    if( files.length < 1 ) return;

    const reader = new FileReader();
    
    reader.readAsText( files[ 0 ] );
    
    reader.onload = () => {
      const canvas: any = document.getElementById( 'canvas' );

      const sentence: string = reader.result.toString();
      const format: Format = new SeparateNABCE();
      // const format: Format = new TestFormat();
      const scenario: Scenario = format.export( sentence );

      const min: Vector = new Vector( MIN_X, MIN_Y );
      const max: Vector = new Vector( MAX_X, MAX_Y );
      const limit = new Limit( min, max )
      
      const drawer: Drawer= new Drawer( canvas, scenario, limit );

      const list = drawer.draw();

      setPngList( list )
    }
  }

  const onClickDownloadAll = () => {
    if( pngList === null ) return;

    const zip = new JSZip();

    const folderName = 'test';
    const folder = zip.folder( folderName );

    for( let i = 0; i < pngList.length; i++ ) {
      for( let j = 0; j < pngList[i].length; j++ ) {
       folder.file( `test_${ i }_${ j }.png`, Convertor.base64ToBlob( pngList[ i ][ j ] ) );
      }
    }

    zip.generateAsync( { type: 'blob' } ).then( blob => {
      const url = URL.createObjectURL( blob );
      
      const link = document.createElement( 'a' );
      link.href = url;
      link.download = `${ folderName }.zip`;

      link.click();
    } );
  }

  const renderImgList = () => {
    if( pngList === null ) return;

    const list = [];
    
    for( let i = 0; i < pngList.length; i++ ) {
        list.push(
          <a key={ `a_${i}` } href={ pngList[ i ] } download={ `test_${i}.png` }>
            <img key={ `img_${i}` } src={ pngList[ i ] } alt="test" />
          </a>
        );
    }

    return list;
  }

  return (
    <div>
      <div className={ styles.canvas_wrapper }>
        <canvas id="canvas" width="1920" height="1080"></canvas>
      </div>
      <div className={styles.form}>
        <input type="file" onChange={ onChange } />
        <Button className="mybutton" value="download all" onClick={ onClickDownloadAll } />
      </div>
      <div className={styles.preview}>{ renderImgList() }</div>
    </div>
  );
}

const Button = props => {
  return <button className={ props.className } onClick={ props.onClick }>{ props.value }</button>
}
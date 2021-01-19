import React, {useState,useEffect, isValidElement} from 'react'
import Head from 'next/head'
import styles from '../styles/Home.module.css'

import JSZip from 'jszip'

import Limit from './models/Limit'
import Vector from './models/Vector'
import Canvas from './models/Canvas'
import Convertor from './models/Convertor'

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

// class LimitedPosition {
//   private limit: Limit = null;
//   private position: Position = null;
//   public move = ( x: number = 0, y: number = 0 ): void => {
//     const newX = this.limit.isInLimitX( x ) === true ? x : this.limit.getMinX();
//     const newY = this.limit.isInLimitX( y ) === true ? y : this.limit.getMinY();
//     this.position.move( x, y )
//   }
// }

const ASPECT_WIDTH = 1920;
const ASPECT_HEIGHT = 1080;

const MIN_X = 220;
const MIN_Y = 200;

const MAX_X = 1700;
const MAX_Y = 970;

let textX = 0;
let textY = 0;

interface Format {
  export( sentence: string ): Scenario;
}

class SeparateNABCE implements Format {
  export( sentence: string ): Scenario {
    const result: Scenario = new Scenario();
  
    // 区切り文字
    const regExp = new RegExp( '[N|A|B|C|E]' );
  
    // 区切り位置
    let separatePoint: number = 0;

    // 文章を1文字ずつ検査する
    for( let i = 0; i < sentence.length; i++ ) {
      // 区切り文字以外はスルー
      if( regExp.test( sentence.charAt( i ) ) === false ) continue
  
      // 最初の区切り文字はスルー
      if( separatePoint >= i ) continue;
  
      // 区切り文字をキーに設定する
      const type = sentence.slice( separatePoint, separatePoint + 1 );
      
      // 前回の区切り位置から行単位で区切って値に設定する
      const value = sentence.slice( separatePoint + 2, i );
      
      // オブジェクトを保存する
      result.append( new Paragraph( type, value ) );
  
      // 区切り位置を更新する
      separatePoint = i;
    }
  
    return result;
  }
}

class Paragraph {
  private type: string = '';
  private value: string= '';
  constructor( type: string, value: string ) {
    this.type = type;
    this.value = value;
  }
  getType(): string { 
    return this.type;
  }

  getValue(): string { 
    return this.value;
  }
}

// TODO: イテレーターにする？
class Scenario {
  private collection: Paragraph[] = [];
  public append( paragraph: Paragraph) {
    this.collection.push( paragraph );
  }
  public getParagraphs(): Paragraph[] {
    return this.collection;
  }
}

class Drawer {
  private value: string = '';
  private canvas: HTMLCanvasElement = null;
  private collection: Canvas[] = [];
  private scenario: Scenario = null;
  private limit: Limit = null;

  public constructor( canvas: HTMLCanvasElement, scenario: Scenario, limit: Limit ) {
    this.canvas = canvas;
    this.scenario = scenario;
    this.limit = limit;
  }
  
  public init() {
    const arr: Paragraph[] = this.scenario.getParagraphs();
    for( let i = 0; i < arr.length; i++ ) {
      
    }
  }

  public newScene() {
    const min: Vector = new Vector( MIN_X, MIN_Y );
    const max: Vector = new Vector( MAX_X, MAX_Y );
    const limit = new Limit( min, max )
    return new Canvas( this.canvas, limit ); 
  }

  public append( value: string ) {
    const min: Vector = new Vector( MIN_X, MIN_Y );
    const max: Vector = new Vector( MAX_X, MAX_Y );
    const limit = new Limit( min, max )
    const canvas = new Canvas( this.canvas, limit ); 
    
    this.collection.push( canvas );

    for( let i = 0; i < this.value.length; i++ ) {
      canvas.append( this.value.charAt( i ) ) ;
    }

    console.log( canvas )
  }

  public draw() {
    for( let i = 0; i < this.collection.length; i++ ) {
      this.collection[i].draw();
    }
  }
}

const Container = () => {
  // contextを状態として持つ
  const [ context, setContext ] = useState( null );

  const [ pngList, setPngList ] = useState( null );

  const [ scale, setScale ] = useState( 0 );
  const [ beginX, setBeginX ] = useState( 0 );
  const [ beginY, setBeginY ] = useState( 0 );
  const [ endX, setEndX ] = useState( 0 );
  const [ endY, setEndY ] = useState( 0 );

  // コンポーネントの初期化完了後コンポーネント状態にコンテキストを登録
  useEffect( () => { initialize(); }, [] );

  useEffect( () => { renderImgList(); }, [ pngList ] );

  const initialize = () => {
    const canvas: any = document.getElementById( 'canvas' );
    const context = canvas.getContext( '2d' );

    setContext( context );

    // アスペクト比を固定するためにCSSで16:9にした要素からサイズを取得する
    const scale = window.innerWidth / ASPECT_WIDTH;

    setScale( scale );
   
    canvas.width = ASPECT_WIDTH * scale;
    canvas.height = ASPECT_HEIGHT * scale;

    const beginX = MIN_X * scale;
    const beginY = MIN_Y * scale;
    const endX = ( MAX_X * scale ) - beginX;
    const endY = ( MAX_Y * scale );
    textY = beginY
    setBeginX( beginX );
    setBeginY( beginY );
    setEndX( endX );
    setEndY( endY );
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
      const scenario: Scenario = format.export( sentence );

      const min: Vector = new Vector( MIN_X, MIN_Y );
      const max: Vector = new Vector( MAX_X, MAX_Y );
      const limit = new Limit( min, max )
      
      const drawer: Drawer= new Drawer( canvas, scenario, limit );

      drawer.append( 'test' );
      drawer.draw();
      // createPngList( result );
    }
  }

  const createPngList = (passage) => {
    if( passage === null ) return;

    const list = [];

    for( const e of passage ) {
      for( const k of Object.keys( e ) ) {
        list.push( createPngDataURL( k, e ) );
      }
    }

    setPngList( list );
  }
  
  const createPngDataURL = ( type: string, sentence: string ) => {
    if( context === null || sentence === '' ) return;

    const canvas: any = document.getElementById( 'canvas' );

    context.clearRect( 0, 0, canvas.width, canvas.height );

    const settings = Convertor.divideTextSettings( type );

    const fontSize = settings.size * scale;

    // 文字オプションを設定する
    context.font = `${ fontSize }px ${ settings.font }`;
    context.fillStyle = settings.color;
    context.textAlign = settings.align;
    context.textBaseline = 'top';

    // アウトラインを設定する
    context.strokeStyle = settings.outline;
    context.lineWidth = 3;

    // ドロップシャドウを設定する
    context.shadowColor = settings.outline;
    context.shadowBlur = 0;
    context.shadowOffsetX = 3;
    context.shadowOffsetY = 1;

    textX = beginX;

    let str = '';
    let tmpX = 0;

    const result = [];

    const rows = sentence[ type ].split( '\n' ).filter( e => e !== '' );

    for( let i = 0; i < rows.length; i++ ) {
        const mesure = context.measureText( rows[ i ] );
        if( mesure.width > endX ) tmpX = endX;
        tmpX = tmpX > mesure.width ? tmpX : mesure.width;
    }

    for( let i = 0; i < rows.length; i++ ) {

      for( let j = 0; j < rows[ i ].length; j++ ) {
      
        const char = rows[ i ].charAt( j );
        const mesure = context.measureText( str + char );

        if( mesure.width > endX ) {
          str = '';
          textY += fontSize * settings.height;
        }

        if( textY > endY ) {
          if( type === 'A' ) textX = endX - tmpX + beginX;
          context.strokeText( str, textX, textY );
          context.fillText( str, textX, textY );
          result.push( canvas.toDataURL( 'image/png' ) )

          context.clearRect( 0, 0, canvas.width, canvas.height );
          textY = beginY;
        }

        str += char;
      
      }

      if( type === 'A' ) textX = endX - tmpX + beginX;
      context.strokeText( str, textX, textY );
      context.fillText( str, textX, textY );

      str = '';
      textY += fontSize * settings.height;
      
    }
      
    textY += fontSize * ( settings.height * 0.5 );
    
    result.push( canvas.toDataURL( 'image/png' ) )

    return result; //canvas.toDataURL( 'image/png' );
  }

  // ダウンロードボタンクリックイベント
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
    if( pngList === null ) return null;

    const list = [];
    for( let i = 0; i < pngList.length; i++ ) {
      for( let j = 0; j < pngList[i].length; j++ ) {
        list.push(
          <a key={ `a_${i}_${j}` } href={ pngList[ i ][ j ] } download={ `test_${i}.png` }>
            <img key={ `img_${i}_${j}` } src={ pngList[ i ][ j ] } alt="test" />
          </a>
        );
      }
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
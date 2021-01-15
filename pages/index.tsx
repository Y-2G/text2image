import React, {useState,useEffect} from 'react'
import Head from 'next/head'
import styles from '../styles/Home.module.css'

import JSZip from 'jszip'

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

const ASPECT_WIDTH = 1920;
const ASPECT_HEIGHT = 1080;

const MIN_X = 220;
const MAX_X = 1700;
const MIN_Y = 200;
const MAX_Y = 970;

const TEXT_MARGIN = 1.2;

let textX = 0;
let textY = 0;

const Container = () => {
  // contextを状態として持つ
  const [ context, setContext ] = useState( null );
  
  const [ scale, setScale ] = useState( null );
  const [ beginX, setBeginX ] = useState( 0 );
  const [ beginY, setBeginY ] = useState( 0 );
  const [ endX, setEndX ] = useState( 0 );
  const [ endY, setEndY ] = useState( 0 );

  const [ pngList, setPngList ] = useState( null );

  // コンポーネントの初期化完了後コンポーネント状態にコンテキストを登録
  useEffect( () => { initialize(); }, [] );

  useEffect( () => { renderImgList(); }, [ pngList ] );

  const initialize = () => {
    const canvas: any = document.getElementById( 'canvas' );

    // アスペクト比を固定するためにCSSで16:9にした要素からサイズを取得する
    const scale = window.innerWidth / ASPECT_WIDTH;
   
    const beginX = MIN_X * scale;
    const beginY = MIN_Y * scale;
    const endX = ( MAX_X * scale ) - beginX;
    const endY = ( MAX_Y * scale );

    canvas.width = ASPECT_WIDTH * scale;
    
    canvas.height = ASPECT_HEIGHT * scale;
    
    const canvasContext = canvas.getContext( '2d' );

    setScale( scale );
    setBeginX( beginX );
    setBeginY( beginY );
    setEndX( endX );
    setEndY( endY );

    setContext( canvasContext );
  }

  // ファイル選択イベント
  const onChange = (e) => {
    const files = e.target.files;

    if( files.length < 1 ) return;

    const reader = new FileReader();
    
    reader.readAsText( files[ 0 ] );
    
    reader.onload = () => {
      const passage: string = reader.result.toString();

      const result: any = Convertor.adjustPassage( passage );

      createPngList( result );
    }
  }

  const createPngList = (passage) => {
    if( passage === null ) return;

    const list = [];

    for( const e of passage ) {
      for( const k of Object.keys( e ) ) {
        const arr: [] = e[ k ];
        arr.forEach( e => list.push( createPngDataURL( k, e ) ) );
      }
    }

    setPngList( list );
  }
  
  const createPngDataURL = ( type, text ) => {
    if( context === null || text === '' ) return;

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

    let str = '';

    textX = beginX;

    for( let i = 0; i < text.length; i++ ) {
      if( textY > endY ) textY = beginY;

      const mesure = context.measureText( str + text.charAt( i ) );
      
      if( mesure.width > endX ) {
        str = '';
        textY += fontSize * settings.height;
      }

      str += text.charAt( i );

      context.strokeText( str, textX, textY );
      context.fillText( str, textX, textY );
    }
   
    textY += settings.size * ( settings.height * TEXT_MARGIN );
    
    return canvas.toDataURL( 'image/png' );
  }

  // ダウンロードボタンクリックイベント
  const onClickDownloadAll = () => {
    if( pngList === null ) return;

    const zip = new JSZip();

    const folderName = 'test';
    const folder = zip.folder( folderName );

    for( let i = 0; i < pngList.length; i++ ) {
      folder.file( `test_${ i }.png`, Convertor.base64ToBlob( pngList[ i ] ) );
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
      list.push(
        <a key={ `a_${i}` } href={pngList[ i ] } download={ `test_${i}.png` }>
          <img key={ `img_${i}` } src={ pngList[i] } alt="test" />
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
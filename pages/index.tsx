import React, {useState,useEffect} from 'react'
import Head from 'next/head'
import styles from '../styles/Home.module.css'

import JSZip from 'jszip'

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
const MAX_Y = 880;

const TEXT_MARGIN = 1.2;

class TextSettings {
  font: string = '';
  color: string = '';
  outline: string = '';
  align: string = '';
  size: number = 0;
  height: number = 0;
}

const Container = () => {
  // contextを状態として持つ
  const [ context, setContext ] = useState( null );

  const [ pngList, setPngList ] = useState( null );

  // コンポーネントの初期化完了後コンポーネント状態にコンテキストを登録
  useEffect( () => { initialize(); }, [] );

  useEffect( () => { renderImgList(); }, [ pngList ] );

  const initialize = () => {
    const canvas: any = document.getElementById('canvas');

    // アスペクト比を固定するためにCSSで16:9にした要素からサイズを取得する
    canvas.width = canvas.parentNode.clientWidth;
    
    canvas.height = canvas.parentNode.clientHeight;
    
    const canvasContext = canvas.getContext('2d');

    setContext(canvasContext);
  }

  const divideTextSettings = (type) : TextSettings => {
    const result: TextSettings = new TextSettings();

    switch ( type ) {
      case 'N':
        result.font  = 'ヒラギノ明朝 Pro W4';
        result.color = '#FFF';
        result.outline = '#000';
        result.size  = 65;
        result.height = 1.1618;
        result.align = 'left';
        break;
      case 'A':
        result.font  = 'ヒラギノ丸ゴ Pro W4';
        result.color = '#FFF';
        result.outline = '#08003F';
        result.size  = 80;
        result.height = 1;
        result.align = 'left';
        break;
      case 'B':
        result.font  = 'ヒラギノ丸ゴ Pro W4';
        result.color = '#FFF';
        result.outline = '#570001';
        result.size  = 80;
        result.height = 1;
        result.align = 'left';
        break;
      case 'C':
        result.font  = 'ヒラギノ丸ゴ Pro W4';
        result.color = '#FFF';
        result.outline = '#4A5700';
        result.size  = 80;
        result.height = 1;
        result.align = 'left';
        break;
    }

    return result;
  }

  const renderText = ( type, text ) => {
    if( context === null || text === '' ) return;

    const canvas: any = document.getElementById('canvas');

    context.clearRect( 0, 0, canvas.width, canvas.height );

    const scale = window.innerWidth / ASPECT_WIDTH;

    const settings = divideTextSettings(type);

    const startX = MIN_X * scale;
    const startY = MIN_Y * scale;
    const fontSize = settings.size * scale;
    const maxX = ( MAX_X * scale ) - startX;
    const maxY = ( MAX_Y * scale ) - startY;

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

    let x = startX;
    let y = startY;
    
    for( let i = 0; i < text.length; i++ ) {
      const mesure = context.measureText( str + text.charAt( i ) );
      if( mesure.width > maxX ) {
        str = '';
        y += fontSize * settings.height;
      }

      str += text.charAt( i );

      context.strokeText( str, x, y );
      context.fillText( str, x, y );
    }
   
    y += settings.size * ( settings.height * TEXT_MARGIN );
    
    return canvas.toDataURL('image/png');
  }

  const adjustPassage = ( passage: string ): object[] => {
    const result: object[] = [];

    const regExp = new RegExp('[N|A|B|C|E]');

    let s = 0;

    for( let i = 0; i < passage.length; i++ ) {
      if( regExp.test( passage.charAt( i ) ) === false ) continue

      if( s >= i ) continue;

      result.push( { [ passage.slice( s, s + 1 ) ] : passage.slice( s + 2, i ).split( '\n' ).filter( e => e !== '' ) } );

      s = i;
    }

    return result;
  }

  const onChange = (e) => {
    const files = e.target.files;

    if( files.length < 1 ) return;

    const reader = new FileReader();
    
    reader.readAsText( files[ 0 ] );
    
    reader.onload = () => {
      const passage: string = reader.result.toString();

      const result: any = adjustPassage( passage );

      test(result)
    }
  }

  const test = (passage) => {
    if( passage === null ) return;

    const list = [];

    for( const e of passage ) {
      for( const k of Object.keys( e ) ) {
        const arr: [] = e[ k ];
        arr.forEach( e => list.push( renderText( k, e ) ) );
      }
    }

    setPngList( list );
  }

  const downloadAll = () => {
    if( pngList === null ) return;

    const zip = new JSZip();

    const folderName = 'test';
    const folder = zip.folder( folderName );

    for( let i = 0; i < pngList.length; i++ ) {
      folder.file( `test_${ i }.png`, toBlob( pngList[ i ] ) );
    }

    zip.generateAsync( { type: 'blob' } ).then( blob => {
      const url = URL.createObjectURL( blob );
      
      const link = document.createElement( 'a' );
      link.href = url;
      link.download = `${ folderName }.zip`;

      link.click();
    } );
  }

  const toBlob = ( base64 ) => {
    let blob = null;

    let bin = atob( base64.replace( /^.*,/, '' ) );
    let buffer = new Uint8Array( bin.length );
    for ( let i = 0; i < bin.length; i++ ) {
        buffer[ i ] = bin.charCodeAt( i );
    }
    // Blobを作成
    try{
        blob = new Blob( [ buffer.buffer ], {
          type: 'image/png'
        });
    }catch (e){
        return blob;
    }

    return blob;
  }
  
  const download = () => {
    for( let i = 0; i < pngList.length; i++ ) {
      const link = document.createElement('a');
      link.href = pngList[i];
      link.download = `test_${i}.png`;
      link.click();
    }
  }

  const renderImgList = () => {
    if( pngList === null ) return null;

    const list = [];

    for( let i = 0; i < pngList.length; i++ ) {
      list.push( <img key={i} src={ pngList[i] } alt="test" /> )
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
        <Button className="mybutton" value="download all" onClick={ downloadAll } />
      </div>
      <div className={styles.preview}>{ renderImgList() }</div>
    </div>
  );
}

const Button = props => {
  return <button className={ props.className } onClick={ props.onClick }>{ props.value }</button>
}
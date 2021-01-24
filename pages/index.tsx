import React, { useState, useEffect } from 'react'
import Head from 'next/head'
import styles from '../styles/Home.module.css'

import JSZip from 'jszip'

import Limit from './models/Limit'
import Vector from './models/Vector'
import Convertor from './models/Convertor'
import { Format, SeparateNABCE } from './models/Format'
import { Scenario } from './models/Scenario'
import Drawer from './models/Drawer'

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

const MIN_X = 220;
const MAX_X = 1700;
const MIN_Y = 200;
const MAX_Y = 970;
const ASPECT_WIDTH = 1920;
const ASPECT_HEIGHT = 1080;

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
      const format: Format = new SeparateNABCE( sentence );
      const scenario: Scenario = format.export();

      const min: Vector = new Vector( MIN_X, MIN_Y );
      const max: Vector = new Vector( MAX_X, MAX_Y );
      const limit = new Limit( min, max )
      
      const drawer: Drawer = new Drawer( canvas, scenario, limit );

      // const list = null;
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
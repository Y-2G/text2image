import React, { useState, useEffect } from 'react'
import Head from 'next/head'
import styles from '../styles/Home.module.css'

import JSZip from 'jszip'

import Limit from '../models/Limit'
import Vector from '../models/Vector'
import Convertor from '../models/Convertor'
import Drawer from '../models/Drawer'
import Settings from '../models/Settings'

export default function Home() {
  return (
    <div>
      <Head>
        <title>テキスト作成ツール</title>
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
const CANVAS_WIDTH  = 1920;
const CANVAS_HEIGHT = 1080;

const Container = () => {
  const [ settings, setSettings ] = useState( null );
  
  const [ fileName, setFileName ] = useState( null );

  const [ pingList, setPingList ] = useState( null );

  // コンポーネントの初期化完了後コンポーネント状態にコンテキストを登録
  useEffect( () => { initialize(); }, [] );

  useEffect( () => { renderImgList(); }, [ pingList ] );

  const initialize = () => {
    const canvas: any = document.getElementById( 'canvas' );
    
    canvas.width = CANVAS_WIDTH;
    
    canvas.height = CANVAS_HEIGHT;

    const min: Vector = new Vector( MIN_X, MIN_Y );

    const max: Vector = new Vector( MAX_X, MAX_Y );

    const limit = new Limit( min, max );

    const tmpSettings = new Settings();

    const settings = { limit: limit, canvas: canvas, text: tmpSettings.text };

    setSettings( settings );
  }

  // ファイル選択イベント
  const onChange = (e) => {
    const files = e.target.files;

    if( files.length < 1 ) return;

    const reader = new FileReader();
    
    reader.readAsText( files[ 0 ] );
    
    reader.onload = () => {
      const drawer: Drawer = new Drawer( reader, settings );

      const list = drawer.draw();

      setPingList( list );

      setFileName( files[ 0 ].name.split('.')[ 0 ] );
    }
  }
  
  // ラジオボタン選択イベント
  const onChangeRadio = e => {
    const alignNA = e.target.id;
    settings.text['N'].align = alignNA;
    setSettings( settings );
  }

  const onClickDownloadAll = () => {
    if( pingList === null ) return;

    const zip = new JSZip();

    const folderName = fileName;
    const folder = zip.folder( folderName );

    for( let i = 0; i < pingList.length; i++ ) {
      folder.file( `${ fileName }_${ i }.png`, Convertor.base64ToBlob( pingList[ i ] ) );
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
    if( pingList === null ) return;

    const list = [];
    
    for( let i = 0; i < pingList.length; i++ ) {
        list.push(
          <a key={ `a_${i}` } href={ pingList[ i ] } download={ `${ fileName }_${ i }.png` }>
            <img key={ `img_${i}` } src={ pingList[ i ] } alt={ `${ fileName }_img` } />
          </a>
        );
    }

    return list;
  }

  return (
    <div className={ styles.container } >
      <header className={ styles.header } >
        <h1 className={ styles.title }>テキスト作成ツール</h1>
      </header>
      
      <canvas id="canvas" className={ styles.canvas } width={ CANVAS_WIDTH } height={ CANVAS_HEIGHT }></canvas>
      
      <div className={ styles.form }>
        <div className={ styles.settings }>
          <h2 className={ styles.subtitle }>設定</h2>
          <dl className={ styles.table }>
            <dt className={ styles.kind }>ナレーション</dt>
            <dd className={ styles.detail }>
              <label htmlFor="left" className={ styles.label }>左寄せ</label>
              <input id="left" className={ styles.radio } type="radio" name="na" onChange={ onChangeRadio } defaultChecked />
              <label htmlFor="center" className={ styles.label }>中央寄せ</label>
              <input id="center" className={ styles.radio } type="radio" name="na" onChange={ onChangeRadio } />
            </dd>
          </dl>
        </div>

        <input className={ styles.file } type="file" onChange={ onChange } />
        <Button className={ styles.button } value="すべてダウンロードする" onClick={ onClickDownloadAll } />
      
      </div>
      
      <div className={styles.preview}>{ renderImgList() }</div>
    </div>
  );
}

const Button = props => {
  return <button className={ props.className } onClick={ props.onClick }>{ props.value }</button>
}
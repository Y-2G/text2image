// Models
import JSZip from 'jszip'

import Limit from '../models/Limit'
import Vector from '../models/Vector'
import Drawer from '../models/Drawer'
import Settings from '../models/Settings'
import Convertor from '../models/Convertor'
import Context from '../models/Context'
import ContextForText from '../models/ContextForText'

// Components
import React, { useState, useEffect } from 'react'
import Head from 'next/head'

import Loader from './loader'

// Styles
import styles from '../styles/Home.module.css'

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
  
  const [ isLoading, setIsLoading ] = useState( false );

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
  const onChangeFile = e => {
    setIsLoading( true );

    const files = e.target.files;

    if( files.length < 1 ) return;

    const reader = new FileReader();
    
    reader.readAsText( files[ 0 ] );
    
    reader.onload = () => {
      const constext: Context = new Context( reader );

      const drawer: Drawer = new Drawer( constext, settings );

      const list = drawer.draw();

      setPingList( list );

      setFileName( files[ 0 ].name.split('.')[ 0 ] );

      setIsLoading( false );
    }
  }
  
  // ラジオボタン選択イベント
  const onChangeRadioNaAlign = e => {
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

  const onChangeRadioTextType = e => {

  }

  const onChangeTextPartialDraw = e => {
    if( e.target.value === '' )return;

    setIsLoading( true );

    console.log( e.target.value )

    const context = new ContextForText( { type: 'N', value: e.target.value } );

    const drawer: Drawer = new Drawer( context, settings );

    const list = drawer.draw();

    setPingList( list );

    setFileName( 'test' );

    setIsLoading( false );

  }

  return (
    <div className={ styles.container } >
      <header className={ styles.header } >
        <h1 className={ styles.title }>テキスト作成ツール</h1>
      </header>
      
      <div className={ styles.aside }>
        <section className={ styles.section }>
          <div className={ styles.row }>
            <h2 className={ styles.subtitle }>設定</h2>
          </div>
          <dl className={ styles.table }>
            <dt className={ styles.kind }>ナレーション</dt>
            <dd className={ styles.detail }>
              <div>
                <label htmlFor="textAlignNL" className={ styles.label }>左寄せ</label>
                <input id="textAlignNL" className={ styles.radio } type="radio" name="text-align-n" onChange={ onChangeRadioNaAlign } defaultChecked />
              </div>
              <div>
                <label htmlFor="textAlignNC" className={ styles.label }>中央寄せ</label>
                <input id="textAlignNC" className={ styles.radio } type="radio" name="text-align-n" onChange={ onChangeRadioNaAlign } />
              </div>
            </dd>
          </dl>
        </section>
      </div>

      <div className={ styles.main }>
        <div className={ styles[ 'canvas-holder' ] }>
          <canvas id="canvas" className={ styles.canvas } width={ CANVAS_WIDTH } height={ CANVAS_HEIGHT }></canvas>
        </div>

        <div className={ styles.row }>
          <input id="textPartial" className={ styles.radio } type="text" name="text" onChange={ onChangeTextPartialDraw } />
          <div className={ styles[ 'input-group' ] }>
            <label htmlFor="textTypeN" className={ styles.label }>ナレーション</label>
            <input id="textTypeN" className={ styles.radio } type="radio" name="text-type" onChange={ onChangeRadioTextType } defaultChecked />
          </div>
          <div className={ styles[ 'input-group' ] }>
            <label htmlFor="textTypeA" className={ styles.label }>会話A</label>
            <input id="textTypeA" className={ styles.radio } type="radio" name="text-type" onChange={ onChangeRadioTextType } />
          </div>
          <div className={ styles[ 'input-group' ] }>
            <label htmlFor="textTypeB" className={ styles.label }>会話B</label>
            <input id="textTypeB" className={ styles.radio } type="radio" name="text-type" onChange={ onChangeRadioTextType } />
          </div>
          <div className={ styles[ 'input-group' ] }>
            <label htmlFor="textTypeC" className={ styles.label }>会話C</label>
            <input id="textTypeC" className={ styles.radio } type="radio" name="text-type" onChange={ onChangeRadioTextType } />
          </div>
        </div>

        <div className={ styles.row }>
          <input className={ styles.file } type="file" onChange={ onChangeFile } />
          <Button className={ styles.button } value="すべてダウンロードする" onClick={ onClickDownloadAll } />
        </div>
      
        <div className={styles.preview}>{ renderImgList() }</div>
      </div>

      <Loader visible={ isLoading === true ? 'visible' : 'hidden' } />
    </div>
  );
}

const Button = props => {
  return <button className={ props.className } onClick={ props.onClick }>{ props.value }</button>
}
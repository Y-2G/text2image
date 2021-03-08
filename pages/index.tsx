// Models
import JSZip from 'jszip'

import Limit from '../models/Limit'
import Vector from '../models/Vector'
import Settings from '../models/Settings'
import Convertor from '../models/Convertor'
import Context from '../models/Context'
import Analyzer from '../models/Analyzer'

// Components
import React, { useState, useEffect } from 'react'
import Head from 'next/head'

import Loader from './loader'

// Styles
import styles from '../styles/Home.module.css'
import Preview from '../models/Preview'
import { render } from 'react-dom'

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

  const [ preview, setPreview ] = useState( null );

  const [ selectedObject, setSelectedObject ] = useState( null );

  const [ modalState, setModalState ] = useState( 'hidden' );

  const [ position, setPosition ] = useState( { x: 0, y: 0 } );

  const [ textBoxValue, setTextBoxValue ] = useState( '' );


  // コンポーネントの初期化完了後コンポーネント状態にコンテキストを登録
  useEffect( () => { initialize(); }, [] );

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

  // ラジオボタン選択イベント
  const onChangeRadioNaAlign = e => {
    const alignNA = e.target.value;
    settings.text['N'].align = alignNA;

    setSettings( settings );
  }
  
  // ファイル選択イベント
  const onChangeFile = e => {
    setIsLoading( true );

    const files = e.target.files;

    if( files.length < 1 ) return;

    const reader = new FileReader();
    
    reader.readAsText( files[ 0 ] );
    
    reader.onload = async () => {
      
      const name: string = files[ 0 ].name.split('.')[ 0 ];

      const context: Context = new Context( reader );
      const analyzer = new Analyzer( context, settings );
      const scene = analyzer.execute();
      const preview = new Preview( scene );
      const list = preview.createListPerParagraph();

      setPingList( list );
      setFileName( name );
      setPreview( preview );

      setIsLoading( false );
    }
  }

  // クリックイベント
  const onClickAllDownloadButton = () => {
    if( pingList === null ) return;

    setIsLoading( true );
    
    const zip = new JSZip();
    
    const folderName = fileName;
    const folder = zip.folder( folderName );
    
    for( let i = 0; i < pingList.length; i++ ) {
      folder.file( `${ fileName }_${ i }.png`, Convertor.base64ToBlob( pingList[ i ].image ) );
    }
    
    zip.generateAsync( { type: 'blob' } ).then( blob => {
      const url = URL.createObjectURL( blob );
      
      const link = document.createElement( 'a' );
      link.href = url;
      link.download = `${ folderName }.zip`;
      
      link.click();

      setIsLoading( false );

    } );
  }
  
  const onClickDownloadButton = () => {
    if( selectedObject === null ) return;

    const link = document.createElement( 'a' );
    link.href = selectedObject.image;
    link.download = `scene_${ selectedObject.id }.png`;

    link.click();
  }

  const onClickPreviewItem = item => {
    const canvas: any = document.getElementById( 'canvas' );
    const context: any = canvas.getContext( '2d' );
    context.clearRect(0, 0,  canvas.width, canvas.height );

    const paragraph = item.text;
    
    for( let i = 0; i < paragraph.list.length; i++ ) {
      const text = paragraph.list[ i ];
  
      const v: string = text.value;
      const x: number = text.position.x;
      const y: number = text.position.y;
  
      // フォントを設定する
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

    setSelectedObject( item );
    setPosition( { x: paragraph.position.x, y: paragraph.position.y } );

    setModalState( 'visible' );
  }

  const renderPreview = () => {
    if( pingList === null ) {
      return (
        <div className={styles.empty }>プレビュー</div>
      );
    }

    const list = [];
    
    for( let i = 0; i < pingList.length; i++ ) {
      const item = pingList[ i ];
      
      list.push(
        <span key={ `span_${i}` } onClick={ () => onClickPreviewItem( item ) }>
          <img key={ `img_${i}` } src={ item.image } alt={ `${ fileName }_img` } />
        </span>
      );
    }

    return list;
  }

  const onChangeTextBox = ( event, obj ) => {
    if( selectedObject === null ) return;

    const canvas: any = document.getElementById( 'canvas' );
    const context: any = canvas.getContext( '2d' );
    context.clearRect(0, 0,  canvas.width, canvas.height );

    const paragraph = selectedObject.text;
    
    const id = selectedObject.id;
    obj.value = event.target.value;

    for( let i = 0; i < paragraph.list.length; i++ ) {
      const text = paragraph.list[ i ];
  
      const v: string = text.value;
      const x: number = text.position.x;
      const y: number = text.position.y;
  
      // フォントを設定する
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
    
    const list = preview.updateList( id, )

    setPingList( list );
    setTextBoxValue( event.target.value );
  }

  const renderTextBoxes = () => {
    if( selectedObject === null ) return;

    const list = [];

    const paragraph = selectedObject.text;

    for( let i = 0; i < paragraph.list.length; i++ ) {
      const obj = paragraph.list[ i ];

      list.push(
        <div key={`row_${i}`} className={ styles.row }>
          <input
            key={`text-box_${i}`}
            id="textBox"
            className={ styles[ 'text-box' ] }
            type="text"
            value={ obj.value }
            onChange={ e => onChangeTextBox( e, obj ) }
          />
        </div>
      );
    }
    
    return list;
  }

  const onChangePosition = e => {
    if( selectedObject === null ) return;

    const canvas: any = document.getElementById( 'canvas' );
    const context: any = canvas.getContext( '2d' );
    context.clearRect(0, 0,  canvas.width, canvas.height );

    const paragraph = selectedObject.text;
    
    const x = e.target.id === 'x' ? Number( e.target.value ) : position.x;
    const y = e.target.id === 'y' ? Number( e.target.value ) : position.y;

    paragraph.reset( x, y );

    const id = selectedObject.id;

    for( let i = 0; i < paragraph.list.length; i++ ) {
      const text = paragraph.list[ i ];
  
      const v: string = text.value;
      const x: number = text.position.x;
      const y: number = text.position.y;
  
      // フォントを設定する
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

    const list = preview.updateList( id )

    setPingList( list );
    setPosition( { x: paragraph.position.x, y: paragraph.position.y } );
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
                <input
                  id="textAlignNL"
                  className={ styles.radio }
                  type="radio"
                  name="text-align-n"
                  value="left"
                  onChange={ onChangeRadioNaAlign }
                  defaultChecked
                />
              </div>
              <div>
                <label htmlFor="textAlignNC" className={ styles.label }>中央寄せ</label>
                <input
                  id="textAlignNC"
                  className={ styles.radio }
                  type="radio"
                  name="text-align-n"
                  value="center"
                  onChange={ onChangeRadioNaAlign }
                />
              </div>
            </dd>
          </dl>
        </section>
      </div>

      <div className={ styles.main }>
        <div className={ styles.row }>
          <input className={ styles.file } type="file" onChange={ onChangeFile } />
          <Button className={ styles.button } value="まとめてダウンロード" onClick={ onClickAllDownloadButton } />
        </div>
        <div className={styles.preview}>{ renderPreview() }</div>
      </div>

      <div className={ `${styles.modal}  ${styles[ modalState ]}`}>
        <div className={ styles[ 'modal-inner' ] } >
          <div className={ styles[ 'canvas-holder' ] }>
            <canvas id="canvas" className={ styles.canvas } width={ CANVAS_WIDTH } height={ CANVAS_HEIGHT }></canvas>
          </div>
          { renderTextBoxes() }
          <div className={ styles.row }>
            <div className={ styles.group }>
              <label className={ styles.label }>X</label>
              <input
                id="x"
                className={ styles.number }
                type="number"
                value={position.x}
                step="1"
                onChange={ onChangePosition }
              />
            </div>
            <div className={ styles.group }>
              <label className={ styles.label }>Y</label>
              <input
                id="y"
                className={ styles.number }
                type="number"
                value={position.y}
                step="1"
                onChange={ onChangePosition }
              />
            </div>
          </div>
          <div className={ styles.row }>
            <Button className={ styles.button } value="ダウンロード" onClick={ onClickDownloadButton } />
            <Button className={ styles.button } value="閉じる" onClick={ () => setModalState( 'hidden' ) } />
          </div>
        </div>
        <div className={ styles.layer } />
      </div>
      
      <Loader visible={ isLoading === true ? 'visible' : 'hidden' } />
    </div>
  );
}

const Button = props => {
  return <button className={ props.className } onClick={ props.onClick }>{ props.value }</button>
}

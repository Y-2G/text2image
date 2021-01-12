import React, {useState,useEffect} from 'react'
import Head from 'next/head'
import styles from '../styles/Home.module.css'

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

const MIN_X = 0;
const MAX_X = 500;

const TEXT_MARGIN = 1.2;

type settings = {
  font: string,
  color: string,
  outline: string,
  size: number,
  height: number,
  align: string
}

const Container = () => {
  // contextを状態として持つ
  const [ context, setContext ] = useState( null );

  // コンポーネントの初期化完了後コンポーネント状態にコンテキストを登録
  useEffect( () => { initialize(); }, [] );

  // 状態にコンテキストが登録されたらそれに対して操作できる
  // useEffect( () => { renderText(); }, [ context ] );

  const initialize = () => {
    const canvas: any = document.getElementById('canvas');

    const canvasContext = canvas.getContext('2d');

    setContext(canvasContext);
  }

  const divideTextSettings = (type) : settings => {
    const result: settings = {
      font: '',
      color: '',
      outline: '',
      size: 0,
      height: 0,
      align: ''
    };

    switch ( type ) {
      case 'N':
        result.font  = 'ヒラギノ丸ゴ Pro W4';
        result.color = '#FFF';
        result.outline = '#000';
        result.size  = 30;
        result.height = 1.1618;
        result.align = 'left';
        break;
      case 'A':
        result.font  = 'ヒラギノ丸ゴ Pro W4';
        result.color = '#FFF';
        result.outline = '#08003F';
        result.size  = 50;
        result.height = 1;
        result.align = 'left';
        break;
      case 'B':
        result.font  = 'ヒラギノ丸ゴ Pro W4';
        result.color = '#FFF';
        result.outline = 'red';
        result.size  = 50;
        result.height = 1;
        result.align = 'left';
        break;
      case 'C':
        result.font  = 'ヒラギノ丸ゴ Pro W4';
        result.color = '#FFF';
        result.outline = 'green';
        result.size  = 50;
        result.height = 1;
        result.align = 'left';
        break;
    }

    return result;
  }

  const renderText = ( type, text ) => {
    if( context === null || text === '' ) return;

    console.log(text)

    const canvas: any = document.getElementById('canvas');
    context.clearRect(0, 0, canvas.width, canvas.height);

    const settings = divideTextSettings(type);

    // 文字オプションを設定する
    context.font = `${settings.size}px ${settings.font}`;
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

    let y = 0;
    let x = 0;
    
    for( let i = 0; i < text.length; i++ ) {
      const mesure = context.measureText( str + text.charAt( i ) );
      if( mesure.width > MAX_X ) {
        str = '';
        y += settings.size * settings.height;
      }

      str += text.charAt( i );

      context.strokeText( str, x, y );
      context.fillText( str, x, y );
    }
   
    y += settings.size * ( settings.height * TEXT_MARGIN );
  
    download();
  }

  const adjustPassage = ( passage: string ): object[] => {
    const result: object[] = [];

    const regExp = new RegExp('[N|A|B|C|E]');

    let s = 0;

    for(let i = 0; i < passage.length; i++) {
      if( regExp.test( passage.charAt( i ) ) === false ) continue

      if(s >= i) continue;

      result.push( { [ passage.slice( s, s + 1 ) ] : passage.slice( s + 2, i ).split('\n') } );

      s = i;
    }

    return result;
  }

  const onChange = (e) => {
    const files = e.target.files;

    if( files.length < 1 ) return;

    const reader = new FileReader();
    
    reader.readAsText(files[0]);
    
    reader.onload = () => {
      const passage: string = reader.result.toString();

      const result: any = adjustPassage(passage);

      test(result)
    }
  }

  const test = (passage) => {
    if( passage === null ) return;

    for( const e of passage ) {
      for( const k of Object.keys( e ) ) {
        const arr: [] = e[k];
        arr.forEach( e => renderText(k, e) );
      }
    }
  }

  const download = () => {
    const canvas: any = document.getElementById('canvas');
    
    const link = document.createElement('a');
    link.href = canvas.toDataURL('image/png');
    link.download = 'test.png';
    
    link.click();
  }

  return (
    <div>
      <canvas id="canvas" width="1280" height="720"></canvas>
      <input type="file" onChange={onChange} />
      <Button className="mybutton" value="download" onClick={ download } />
    </div>
  );
}

const Button = props => {
  return <button className={ props.className } onClick={ props.onClick }>{ props.value }</button>
}
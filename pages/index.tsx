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

const Container = () => {
  // contextを状態として持つ
  const [ context, setContext ] = useState( null );

  // フォントサイズを状態として持つ
  const [ fontsize, setFontsize ] = useState( 55 );

  // コンポーネントの初期化完了後コンポーネント状態にコンテキストを登録
  useEffect( () => { initialize(); }, [] );

  // 状態にコンテキストが登録されたらそれに対して操作できる
  // useEffect( () => { renderText(); }, [ context ] );

  const initialize = () => {
    const canvas: any = document.getElementById('canvas');

    const canvasContext = canvas.getContext('2d');

    setContext(canvasContext);
  }

  const renderText = (text) => {
    if( context === null ) return;

    // 文字オプションを設定する
    context.font = `${fontsize}px ヒラギノ丸ゴ Pro W4`;
    context.fillStyle = '#FFF';
    context.textBaseline = 'middle';

    // アウトラインを設定する
    context.strokeStyle = '#08003F';
    context.lineWidth = 3;

    // ドロップシャドウを設定する
    context.shadowColor = '#08003F';
    context.shadowBlur = 0;
    context.shadowOffsetX = 3;
    context.shadowOffsetY = 1;

    // テキストを描画する
    context.strokeText(text, 20, 100);
    context.fillText(text, 20, 100);
  }

  const download = () => {
    const canvas: any = document.getElementById('canvas');
    
    const link = document.createElement('a');
    link.href = canvas.toDataURL('image/png');
    link.download = 'test.png';
    
    link.click();
  }

  const adjustPassage = ( passage: string ): object[] => {
    const result: object[] = [];

    const regExp = new RegExp('[N|A|B|C|E]');

    const text = passage.replace(/\r?\n/g, '');
    
    let s = 0;

    for(let i = 0; i < text.length; i++) {
      if( regExp.test( text.charAt( i ) ) === false ) continue

      if(s >= i) continue;

      result.push( { [ text.slice( s, s + 1 ) ] : text.slice( s, i ) } );

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
      const text: string = reader.result.toString();

      const test: any = adjustPassage(text);

      console.log(test)
    }
  }

  return (
    <div>
      <canvas id="canvas" width="1280" height="720"></canvas>
      <input type="file" onChange={onChange} />
      <Button className="mybutton" value="download" onClick={ download } />
      <pre id="pre1"></pre>
    </div>
  );
}

const Button = props => {
  return <button className={ props.className } onClick={ props.onClick }>{ props.value }</button>
}
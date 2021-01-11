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
  const [ context, setContext ] = useState(null);

  // コンポーネントの初期化完了後コンポーネント状態にコンテキストを登録
  useEffect(() => {
    const canvas: any = document.getElementById("canvas");

    const canvasContext = canvas.getContext("2d");

    setContext(canvasContext);
  },[]);

  // 状態にコンテキストが登録されたらそれに対して操作できる
  useEffect(() => {
    if( context !== null ) {
      context.font = '80px ヒラギノ丸ゴ Pro W4';

      // 文字色を設定する
      context.fillStyle = '#fff';

      // アウトラインを設定する
      context.strokeStyle = '#08003F';
      context.lineWidth = 3;

      // ドロップシャドウを設定する
      context.shadowColor = '#08003F';
      context.shadowBlur = 0;
      context.shadowOffsetX = 3;
      context.shadowOffsetY = 1;

      // 表示オプションを設定する
      context.textBaseline = 'middle';

      // テキストを描画する
      context.strokeText('Hello World', 20, 100);
      context.fillText('Hello World', 20, 100);
    }
  }, [ context ] );

  const download = () => {
    const canvas: any = document.getElementById("canvas");
    const link = document.createElement("a");
    link.href = canvas.toDataURL("image/png");
    link.download = "test.png";
    link.click();
  }

  return (
    <div>
      <canvas id="canvas" width="1280" height="720"></canvas>
      <Button className="mybutton" value="download" onClick={ download } />
    </div>
  );
}

const Button = props => {
  return <button className={ props.className } onClick={ props.onClick }>{ props.value }</button>
}
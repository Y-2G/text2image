This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
```

テキスト作成ツール ver.0.1.1<br>

Ⅰ.テキスト作成ツールの使用方法について<br>

  1.URL<br>
    https://text2image.vercel.app/<br>

  2.テキスト作成ツール管理表<br>
    (1) URL<br>
      https://docs.google.com/spreadsheets/d/1jE1B8t6SI4rhXNJZxcjJk1Dt1vqeJ7TJKiMSijwdR5o/edit#gid=0<br>

  3.使い方<br>
    (1) 任意のブラウザで上記URLにアクセスする<br>
    (2) "ファイルを選択ボタン"をクリックする<br>
    (3) フォーマットにそったテキストファイルを選択する<br>
    (4) プログラムが画像を作成する<br>
    (5) "download all"または画像リンクをクリックする<br>
    (6) 画像ファイルがダウンロードされる<br>

  4.テキストファイルフォーマット<br>
    (1) 半角英字「N/A/B/C/E」で区切る<br>
    (2) 区切り文字から次の区切り文字までの間の文章が画像になる<br>
    (3) 上記(2)の後から次の文章までの間に余白が挿入される<br>
    (4) 3行程度の文章ごとに区切り文字を挿入するのがおすすめ<br>
    (5) 以下、各種区切り文字の詳細<br>

    N<br>
      ナレーション。<br>
      オープニング、エンディングのテキストに使用する。<br>

    A<br>
      語りA。<br>
      主人公のテキストに使用する。<br>

    B<br>
      語りB。<br>
      主人公に敵対する人物のテキストに使用する。<br>

    C<br>
      語りC。<br>
      上記A、B以外の登場人物のテキストに使用する。<br>

    E<br>
      エンド。<br>
      シナリオの最後に記載する。<br>

    ※詳細は"サンプルシナリオ"シートを参照してください<br>
    ※上記の英字は半角としてください<br>
    ※シナリオ文中に上記の英字が出てくる場合は大文字としてください<br>
    ※３人以上の語り手が出てくる場合は要相談<br>


Ⅱ.テキスト作成ツールのための文章の最適化について

  1.概要<br>
    テキスト作成ツールを使っていて、きれいに折り返せないことがあるかと思います。<br>
    現状ではシステムで適切な折り返しの位置を判断するのは非常に難しいです。<br>
    そのため、手動でテキストを調整する作業がどうしても必要になります。<br>
    この文書では、そのためのおすすめの方法と環境を構築する手順を紹介します。<br>

  2.方法<br>
    テキストエディタで補助線を引く<br>

  3.環境構築手順<br>
    (1) "Visual Studio Code"をインストールする<br>
    *ダウンロードページ: https://azure.microsoft.com/ja-jp/products/visual-studio-code/<br>

    (2) "Visual Studio Code"を開き、左下の歯車マークをクリックする<br>

    (3) "Settings"を選択する<br>

    (4) 一番上のテキストボックスに"rulers"と入力しする<br>

    (5) "Editor: Rulers"という項目の"Edit in settings.json"をクリックする<br>

    (6) "settings.json"というファイルが開く<br>

    (7) "settings.json"のすでにある部分を削除し、以下のコードを貼り付ける<br>

    {<br>
      editor.rulers: [30,36],<br>
      workbench.colorCustomizations: {"editorRuler.foreground": "#00FF00"},<br>
    }<br>

    (8) "settings.json"の変更を保存する<br>

    (9) 補助線が2つ表示される<br>

  4.備考<br>
    上記"3.環境構築手順"を終えると補助線が2つ表示されます。<br>
    目安として、補助線を超えた部分が折り返されます。<br>
    2つの補助線のうち、右側にあるものはナレーション用です。<br>
    左側の補助線はセリフ用です。<br>

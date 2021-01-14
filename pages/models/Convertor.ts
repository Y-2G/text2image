import TextSettings from './TextSettings'

class Convertor {
  static divideTextSettings = (type) : TextSettings => {
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
  
  static adjustPassage = ( passage: string ): object[] => {
    const result: object[] = [];
  
    // 区切り文字
    const regExp = new RegExp( '[N|A|B|C|E]' );
  
    // 区切り位置
    let separatePoint = 0;
  
    // 文章を1文字ずつ検査する
    for( let i = 0; i < passage.length; i++ ) {
  
      // 区切り文字以外はスルー
      if( regExp.test( passage.charAt( i ) ) === false ) continue
  
      // 最初の区切り文字はスルー
      if( separatePoint >= i ) continue;
  
      // 区切り文字をキーに設定する
      const key = passage.slice( separatePoint, separatePoint + 1 );
      
      // 前回の区切り位置から行単位で区切って値に設定する
      const val = passage.slice( separatePoint + 2, i ).split( '\n' ).filter( e => e !== '' );
      
      // オブジェクトを保存する
      result.push( { [ key ] : val } );
  
      // 区切り位置を更新する
      separatePoint = i;
    
    }
  
    return result;
  }
  

  static base64ToBlob = ( base64 ) => {
    let blob = null;

    let bin = atob( base64.replace( /^.*,/, '' ) );
    let buffer = new Uint8Array( bin.length );
    for ( let i = 0; i < bin.length; i++ ) {
        buffer[ i ] = bin.charCodeAt( i );
    }
    // Blobを作成
    try{
        blob = new Blob( [ buffer.buffer ], { type: 'image/png' } );
    }catch (e){
        return blob;
    }

    return blob;
  }
  
}

export default Convertor
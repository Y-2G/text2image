import Text from './Text'
import TextSettings from './TextSettings'

class Factory {
  public static createTextSettings( type ) : TextSettings {
    const result: TextSettings = new TextSettings();
  
    switch ( type ) {
      case 'N':
        result.font  = 'ヒラギノ明朝 Pro W3';
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

  public static createText( settings: TextSettings, value: string ) {
    return new Text( settings, value )
  }
}

export default Factory;
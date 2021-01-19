import Font from './Font'
import Line from './Line'

class Factory {
  public static createFont = ( type: string ) => {
    switch ( type ) {
      case 'N':
        return Factory.createFontN();
      case 'A':
        return Factory.createFontA();
      case 'B':
        return Factory.createFontB();
      case 'C':
        return Factory.createFontC();
    }
  }

  public static createFontN = () => {
    return new Font( 65, 1.1618, 'ヒラギノ明朝 Pro W3' );
  }

  public static createFontA = () => {
    return new Font( 80, 1, 'ヒラギノ丸ゴ Pro W4' );
  }
  
  public static createFontB = () => {
    return new Font( 80, 1, 'ヒラギノ丸ゴ Pro W4' );
  }

  public static createFontC = () => {
    return new Font( 80, 1, 'ヒラギノ丸ゴ Pro W4' );
  }

  public static createLine( canvas, font, position) {
    return new Line( canvas, font, position );
  }
}


export default Factory;
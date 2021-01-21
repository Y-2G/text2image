class Convertor {
  static base64ToBlob = ( base64 ) => {
    let blob = null;

    let bin = atob( base64.replace( /^.*,/, '' ) );
    let buffer = new Uint8Array( bin.length );

    for ( let i = 0; i < bin.length; i++ ) {
      buffer[ i ] = bin.charCodeAt( i );
    }

    // Blobを作成
    try {
      blob = new Blob( [ buffer.buffer ], { type: 'image/png' } );
    }
    catch ( e ) {
      return blob;
    }

    return blob;
  }
}

export default Convertor;
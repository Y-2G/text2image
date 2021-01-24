import { Scenario, Part, Paragraph } from "./Scenario";

export interface Format {
  export(): Scenario;
}

export class SeparateNABCE implements Format {
  private sentence: string = '';
  private parts: Part[] = [];
  private paragraphs: Paragraph[] = [];

  constructor( sentence: string ) {
    this.sentence = sentence;
    this.createA();
    this.createB();
  }
  
  public createA() {
    let separator: number = 0;

    for( let i = 0; i < this.sentence.length; i++ ) {
      const char = this.sentence.charAt( i );
      
      if( char.match( /^[N|A|B|C|E]$/ ) === null ) continue;

      if( i === 0 ) continue;

      const type: string = this.sentence.slice( separator, separator + 1 );
      
      const value: string = this.sentence.slice( separator + 2, i );
      
      this.paragraphs.push( new Paragraph( type, value ) );

      separator = i;
    }
  }

  public createB() {
    let prevType: string = '';
    const NARRATION: string = 'narration';
    const CONVERSATION: string = 'conversation';

    for( let i = 0; i < this.paragraphs.length; i++ ) {
      const paragraph = this.paragraphs[ i ];
      
      const type = paragraph.type === 'N' ? NARRATION : CONVERSATION;

      if( type !== prevType ) this.parts.push( new Part() );

      const part = this.parts.slice( -1 )[ 0 ];

      part.append( this.paragraphs[ i ] );

      prevType = type;
    }
  }
  
  export(): Scenario {
    const result: Scenario = new Scenario();
    for( let i = 0; i < this.parts.length; i++ ) {
      result.append( this.parts[i] );
    }
    return result;
  }
}

// export class SeparateNABCE implements Format {
//   export( sentence: string ): Scenario {
//     const result: Scenario = new Scenario();
//     const test = sentence.split( '\n' );

//     let type = '';
    
//     for( let i = 0; i < test.length; i++ ) {
//       if( test[i] === '' ) continue;

//       if( test[i].match( /^[N|A|B|C|E]$/) !== null ) {
//         type = test[i]
//         continue; 
//       }

//       result.append( new Paragraph( type, test[i] ) );
//     }

//     return result;
//   }
// }



import { Scenario, Paragraph } from "./Scenario";

export interface Format {
  export( sentence: string ): Scenario;
}

export class SeparateNABCE implements Format {
  export( sentence: string ): Scenario {
    const result: Scenario = new Scenario();
    const test = sentence.split( '\n' );

    let type = '';
    for( let i = 0; i < test.length; i++ ) {
      if( test[i] === '' ) continue;

      if( test[i].match( /^[N|A|B|C|E]$/) !== null ) {
        type = test[i]
        continue; 
      }

      result.append( new Paragraph( type, test[i] ) );
    }
    return result;
  }
}



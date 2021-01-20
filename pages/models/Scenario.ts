export class Scenario {
  private _collection: Paragraph[] = [];

  public append( paragraph: Paragraph ) {
    this._collection.push( paragraph );
  }

  public getParagraphs(): Paragraph[] {
    return this._collection;
  }
}

export class Paragraph {
  private _type: string = '';
  private _value: string= '';
  
  constructor( type: string, value: string ) {
    this._type = type;
    this._value = value;
  }

  public get type(): string { 
    return this._type;
  }

  public get value(): string { 
    return this._value;
  }
}

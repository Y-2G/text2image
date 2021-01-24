export class Scenario {
  private _content: Part[] = [];

  public get content(): Part[] {
    return this._content;
  }

  public append( paragraph: Part ) {
    this._content.push( paragraph );
  }

  public getParagraphs(): Part[] {
    return this._content;
  }
}

export class Part {
  private _content: Paragraph[] = [];

  public get content(): Paragraph[] {
    return this._content;
  }
  
  public append( paragraph: Paragraph ) {
    this._content.push( paragraph );
  }
}

export class Paragraph {
  private _type: string = '';
  private _value: string = '';
  
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

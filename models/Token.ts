export default class Token {
  
  private readonly _type: string;
  private readonly _value: string;

  public constructor( type: string, value: any ) {
    this._type  = type;
    this._value = value;
  }

  public get type(): string {
    return this._type;
  }

  public get value(): string {
    return this._value;
  }

}

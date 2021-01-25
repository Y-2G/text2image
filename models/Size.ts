import Vector from './Vector'

class Size {
  private _vector: Vector = new Vector();

  public constructor( w: number = 0, h: number = 0 ) {
    this._vector = new Vector( w, h )
  }

  public get width(): number {
    return this._vector.x;
  }
  
  public get height(): number {
    return this._vector.y;
  }
  
  public set width( w ) {
    this._vector.x = w;
  }
  
  public set height( h ) {
    this._vector.y = h;
  }
  
  public reset( w: number = 0, h: number = 0 ): void {
    this.width = w;
    this.height = h;
  }
}

export default Size;
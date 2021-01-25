import Vector from './Vector'

class Position {
    private _vector: Vector = null;

    public constructor( x: number = 0, y: number = 0 ) {
      this._vector = new Vector( x, y　)
    }
  
    public get x(): number {
      return this._vector.x;
    }
    
    public get y(): number {
      return this._vector.y;
    }
    
    public set x( x: number ) {
      this._vector.x = x;
    }
    
    public set y( y: number ) {
      this._vector.y = y;
    }

    public move( x: number = 0, y: number = 0 ): void {
      this.x = this.x + x;
      this.y = this.y + y;
    }

    public reset( x: number = 0, y: number = 0 ): void {
      this.x = x;
      this.y = y;
    }
  }
  
  export default Position;
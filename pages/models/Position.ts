import Vector from './Vector'

class Position {
    private vector: Vector = null;

    public constructor( x: number = 0, y: number = 0 ) {
      this.vector = new Vector( x, y)
    }
  
    public get x(): number {
      return this.vector.x;
    }
    
    public get y(): number {
      return this.vector.y;
    }
    
    public set( x: number = 0, y: number = 0 ): void {
      this.vector.x = x;
      this.vector.y = y;
    }
  
    public move( x: number = 0, y: number = 0 ): void {
      this.vector.x = this.x + x;
      this.vector.y = this.y + y;
    }
  }
  
  export default Position;
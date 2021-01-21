import Vector from './Vector'

class Limit {
    private _min: Vector = null;
    private _max: Vector = null;
    
    public constructor( min: Vector, max: Vector) {
      this._min = min;
      this._max = max;
    }
  
    public get min(): Vector {
      return this._min;
    };
    
    public get max(): Vector {
      return this._max;
    };
    
    public isInLimitX( x: number ): boolean {
      return x >= this._min.x && x <= this._max.x;
    }
    
    public isInLimitY( y: number ): boolean {
      return y >= this._min.y && y <= this._max.y;
    }
  
    public isInLimit( x: number, y: number ): boolean {
      return this.isInLimitX( x ) &&  this.isInLimitY( y );
    }
  }

  export default Limit;
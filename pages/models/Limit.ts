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
      let result: boolean = false;
      result = x >= this._min.x;
      result = x <= this._max.x;
      return result;
    }
    
    public isInLimitY( y: number ): boolean {
      let result: boolean = false;
      result = y <= this._min.y;
      result = y >= this._max.y;
      return result;
    }
  
    public isInLimit( x: number, y: number ): boolean {
      let result: boolean = false;
      result = this.isInLimitX( x );
      result = this.isInLimitY( y );
      return result;
    }
  }

  export default Limit;
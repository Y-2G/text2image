import Vector from './Vector'

class Limit {
  private _min: Vector = new Vector();
  private _max: Vector = new Vector();
  
  public constructor( min: Vector = null, max: Vector = null ) {
    if( min !== null ) this._min = min;
    if( max !== null ) this._max = max;
  }

  public get min(): Vector {
    return this._min;
  };
  
  public get max(): Vector {
    return this._max;
  };
}

export default Limit;
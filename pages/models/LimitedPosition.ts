import Limit from './Limit'
import Position from './Position'

class LimitedPosition extends Position {
  private _limit: Limit = null;

  public constructor( limit ) {
    super( limit.min.x, limit.min.y );
    this._limit = limit;
  }

  public move( x: number = 0, y: number = 0 ): void {
    const newX = this.x + x;
    const newY = this.y + y;
    this.x = this._limit.isInLimitX( newX ) === true ? newX : this._limit.min.x;
    this.y = this._limit.isInLimitY( newY ) === true ? newY : this._limit.min.y;
  }

  public reset( x: number = 0, y: number = 0 ): void {
    const newX = this._limit.isInLimitX( x ) === true ? x : this._limit.min.x;
    const newY = this._limit.isInLimitX( y ) === true ? x : this._limit.min.y;
    this.x = newX;
    this.y = newY;
  }

}
  
export default LimitedPosition;
import Limit from './Limit'
import Position from './Position'

class LimitedPosition extends Position {
  private _limit: Limit = null;

  public constructor( limit ) {
    super( limit.min.x, limit.min.y );
    this._limit = limit;
  }

  public move( x: number = 0, y: number = 0 ): void {
    this.x = this._limit.isInLimitX( this.x + x ) === true ? this.x + x : this._limit.min.x;
    this.y = this._limit.isInLimitY( this.y + y ) === true ? this.y + y : this._limit.min.y;
  }

  public reset( x: number = 0, y: number = 0 ): void {
    this.x = this._limit.isInLimitX( x ) === true ? x : this._limit.min.x;
    this.y = this._limit.isInLimitY( y ) === true ? y : this._limit.min.y;
  }

  public canMoveX( x: number = 0 ) {
    return this._limit.isInLimitX( this.x + x ) === true;
  }

  public canMoveY( y: number = 0 ) {
    return this._limit.isInLimitY( this.y + y ) === true;
  }
}
  
export default LimitedPosition;
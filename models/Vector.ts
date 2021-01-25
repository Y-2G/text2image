class Vector {
    private _x: number = 0;
    private _y: number = 0;
    
    public constructor( x: number = 0, y: number = 0 ) {
      this._x = x;
      this._y = y
    }
    
    public get x(): number {
      return this._x; 
    }
    
    public get y(): number {
     return this._y; 
    }
  
    public set x( x: number ) {
       this._x = x; 
    };
    
    public set y( y: number ) {
       this._y = y; 
    };
  }
  
  export default Vector;
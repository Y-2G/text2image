import Line from "./Line";

class Page {
  private _collection: Line[] = [];

  public get collection(): Line[] {
    return this._collection;
  }

  public append( line: Line ): void {
    this._collection.push( line )
  }

  public get() {
    return this._collection;
  }
}

export default Page;
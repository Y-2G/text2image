import Block from "./Block";

class Page {
  private _collection: Block[] = [];

  public get collection(): Block[] {
    return this._collection;
  }

  public append( block: Block ): void {
    this._collection.push( block );
  }

  public get() {
    return this._collection;
  }
}

export default Page;
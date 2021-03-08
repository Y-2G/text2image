class PreviewItem {
  private _id;

  private _text;
  
  private _image;

  public constructor( id, text, image ) {
    this._id = id;
    this._text = text;
    this._image = image;
  }
  
  public get id() {
    return this._id;
  }

  public get text() {
    return this._text;
  }

  public get image() {
    return this._image;
  }

  public set image( image ) {
    this._image = image;
  }
}

export default PreviewItem;
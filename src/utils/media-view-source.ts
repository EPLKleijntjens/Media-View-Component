import { Reactor } from "./reactor";

export class MediaViewSource {

  private source: string;
  private imageStatus: number = 0;  // 0: not started, 1: loading, 2: failed, 3: success
  private videoStatus: number = 0;  //

  private image: HTMLImageElement = null;
  private video: HTMLVideoElement = null;

  private loadPromise: Promise<boolean>;
  private loadPromiseResolver: (x:boolean)=>void;
  private loadPromiseResolved: boolean = true;

  private reactor: Reactor = new Reactor();
  private readonly loadingEvent: string = "loading";
  private readonly loadedEvent: string = "loaded";


  public constructor(src?: string, srcType?: string) {
    if (!(typeof src === 'undefined' || src === null)) {
      if (!(typeof srcType === 'undefined' || srcType === null)) {
        if (srcType.toLowerCase() === "image")
          this.setSourceImage(src);
        else if (srcType.toLowerCase() === "video")
          this.setSourceVideo(src);
        else
          this.setSource(src);
      } else {
        this.setSource(src);
      }
    }
  }


  public registerLoadingCallback(callback: Function) { this.reactor.addEventListener(this.loadingEvent, callback); }

  public registerLoadedCallback(callback: Function) { this.reactor.addEventListener(this.loadedEvent, callback); }

  public unregisterLoadingCallback(callback: Function) { this.reactor.removeEventListener(this.loadingEvent, callback); }

  public unregisterLoadedCallback(callback: Function) { this.reactor.removeEventListener(this.loadedEvent, callback); }


  private setSrc(src: string, tryImage: boolean, tryVideo: boolean): Promise<boolean> {
    if (this.loadPromiseResolved)
      this.loadPromise = new Promise<boolean>((resolve) => { this.loadPromiseResolver = resolve; });

    this.source = src;

    this.imageStatus = tryImage ? 1 : 2;
    this.videoStatus = tryVideo ? 1 : 2;

    this.reactor.dispatchEvent(this.loadingEvent);

    Promise.all([tryImage ? this.loadImage() : new Promise<number>((r)=>r(2)), tryVideo ? this.loadVideo() : new Promise<number>((r)=>r(2))])
      .then((res) => {
        [this.imageStatus, this.videoStatus] = res;
        this.reactor.dispatchEvent(this.loadedEvent);

        this.loadPromiseResolver(this.isValidSource());
        this.loadPromiseResolved = true;
      })

    return this.loadPromise;
  }


  public setSource = (src: string) => { return this.setSrc(src, true, true); };

  public setSourceImage = (src: string) => { return this.setSrc(src, true, false); };

  public setSourceVideo = (src: string) => { return this.setSrc(src, false, true); };


  public getSource = () => { return this.source; };

  public getLoadPromise = () => { return this.loadPromise; };

  public isLoaded = () => { return this.imageStatus > 1 && this.videoStatus > 1; };

  public isValidSource = () => { return this.imageStatus == 3 || this.videoStatus == 3; };

  public isImage = () => { return this.imageStatus == 3; };

  public isVideo = () => { return this.videoStatus == 3; };

  public getImageElement = () => { return this.image; };

  public getVideoElement = () => { return this.video; };

  public getWidth = () => { return this.isImage() ? this.image.width : (this.isVideo() ? this.video.videoWidth : 0); };

  public getHeight = () => { return this.isImage() ? this.image.height : (this.isVideo() ? this.video.videoHeight : 0); };


  private loadImage(): Promise<number> {
    return new Promise((resolve) => {
      this.image = new Image();
      this.image.onabort = () => { resolve(2); };
      this.image.onerror = () => { resolve(2); };
      this.image.onload = () => { resolve(3); };
      this.image.src = this.source;
    });
  }

  private loadVideo(): Promise<number> {
    return new Promise((resolve) => {
      this.video = document.createElement("video");
      this.video.onabort = () => { resolve(2); };
      this.video.onerror = () => { resolve(2); };
      this.video.oncanplay = () => { resolve(3); };
      this.video.src = this.source;
    });
  }

}

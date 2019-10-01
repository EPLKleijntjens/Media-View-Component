import { Component, Prop, Watch, h, State, Event, EventEmitter, Listen, Element, Method } from '@stencil/core';
import { MediaViewSource } from '../../utils/media-view-source';

@Component({
  tag: 'media-view',
  styleUrl: 'media-view.css'
})
export class MediaView {

  /** The source url of the image/video. Use either this or the mediaSource property. */
  @Prop() src: string;
  /** (optional) The source type. Can be either "image" or "video". If unspecified, the component will figure it out. */
  @Prop() srcType: string;
  /** Use to set the mediaSource object directly. Use either this or the src property. */
  @Prop() mediaViewSource: MediaViewSource = new MediaViewSource();

  /** (optional) The kind of "object-fit" to use for the image/video. Can be contian, cover, fill, none, scale-down or pan. */
  @Prop() fit: string = "contain";

  /** (optional) Set to false to start playing if the source is a video. */
  @Prop() paused: boolean = true;
  /** (optional) Set to true to loop if the source is a video */
  @Prop() loop: boolean = false;
  /** (optional) Time in seconds to play if source is a video. */
  @Prop() playTime: number = null;
  /** (optional) Time in seconds to start playing from (and loop back to) if source is a video. */
  @Prop() playStart: number = null;

  /** (optional) Set to true to pause the panning animation. */
  @Prop() panPaused: boolean = false;
  /** (optional) The direction in which the panning starts. Accepts 'normal' (up for tall media, right for wide), 'reverse' (down for tall media, left for wide) or 'random'. */
  @Prop() panDirection: string = "normal";
  /** (optional) Set the number of iterations (passes) of the panning animation. Only accepts whole numbers and Infinity. */
  @Prop() panIterations: number = 1;
  /** (optional) Duration in seconds of a single iteration (pass), not counting returning to center. */
  @Prop() panTime: number = 5;
  /** (optional) Set to false to prevent panning back to the center after all iterations are done. */
  @Prop() panEndAtCenter: boolean = true;




  /** Fires when the image/video is loaded. */
  @Event() mediaLoaded: EventEmitter;
  /** Fires when the image/video could not be loaded. */
  @Event() mediaSourceInvalid: EventEmitter;
  /** Fires when the video starts playing. */
  @Event() playStarted: EventEmitter;
  /** Fires when the video stopped playing. */
  @Event() playEnded: EventEmitter;


  @State() private isSourceLoading: boolean = true;
  @State() private isSourceValid: boolean;
  @State() private isImage: boolean;

  @Element() private hostElement: HTMLElement;
  @State() private hostWidth: number;
  @State() private hostHeight: number;
  private mediaWidth: number;
  private mediaHeight: number;


  private isMediaElementLoaded: boolean = false;
  private imageElement: HTMLImageElement;
  private videoElement: HTMLVideoElement;


  private playStartedEmitted: boolean = false;


  private panDiv: HTMLDivElement;
  private panIterationsDone: number = 0;
  @State() private panFinished: boolean = false;



  @Method() public sizeUpdated() {
    this.handleHostResize();
  }


  @Watch("src")
  private srcUpdated() {
    this.isSourceLoading = true;
    this.isMediaElementLoaded = false;

    if (typeof this.srcType == "string") {
      if (this.srcType.toLowerCase() === "image")
        this.mediaViewSource.setSourceImage(this.src);
      else if (this.srcType.toLowerCase() === "video")
        this.mediaViewSource.setSourceVideo(this.src);
      else
        this.mediaViewSource.setSource(this.src);
    }
    else
      this.mediaViewSource.setSource(this.src);
  }

  @Watch("mediaViewSource")
  private mediaViewSourceUpdated(newValue: MediaViewSource, oldValue: MediaViewSource) {
    if (oldValue !== newValue) {
      this.isMediaElementLoaded = false;

      oldValue.unregisterLoadingCallback(this.handleSourceLoading);
      oldValue.unregisterLoadedCallback(this.handleSourceLoaded);

      newValue.registerLoadingCallback(this.handleSourceLoading);
      newValue.registerLoadedCallback(this.handleSourceLoaded);

      if (newValue.isLoaded())
        this.handleSourceLoaded();
      else
        this.handleSourceLoading();
    }
  }

  @Watch("paused")
  private pausedUpdated() {
    if (typeof this.videoElement !== 'undefined' && this.videoElement !== null) {
      if (!this.paused) {
        this.startVideoPlay();
      } else {
        this.videoElement.pause();
        this.playStartedEmitted = false;
      }
    }
  }

  @Watch("loop")
  private loopUpdated() {
    if (typeof this.videoElement !== 'undefined' && this.videoElement !== null && !this.paused) {
      this.videoElement.loop = this.loop;
    }
  }

  @Watch("panTime")
  private panTimeUpdated() {
    if (this.fit !== "pan")
      return;

    this.panDiv.style.setProperty("--pan-duration", this.panTime + "s");
  };


  @Listen("resize", {target: 'window'})
  private handleHostResize() {
    this.hostWidth = this.hostElement.clientWidth;
    this.hostHeight = this.hostElement.clientHeight;
  }

  private handleOnloadImage() {
    this.isMediaElementLoaded = true;
    this.startPanAnimation();

    this.mediaLoaded.emit();
  }

  private handleOnloadVideo() {
    if (!this.isMediaElementLoaded) {
      this.isMediaElementLoaded = true;
      this.videoElement.muted = true;
      this.playStartedEmitted = false;

      this.loopUpdated();
      this.pausedUpdated();
      this.startPanAnimation();

      this.mediaLoaded.emit();
    }
  }


  private handleSourceLoading = () => {
    this.isSourceLoading = true;
    this.isMediaElementLoaded = false;
  };

  private handleSourceLoaded = () => {
    this.isSourceValid = this.mediaViewSource.isValidSource();
    this.isImage = this.mediaViewSource.isImage();
    this.isSourceLoading = false;

    this.mediaWidth = this.mediaViewSource.getWidth();
    this.mediaHeight = this.mediaViewSource.getHeight();

    if (!this.isSourceValid)
      this.mediaSourceInvalid.emit();
  };



  private isTall(): boolean {
    let mediaScale = this.mediaWidth / this.mediaHeight;
    let containerScale = this.hostWidth / this.hostHeight;

    return mediaScale < containerScale;
  }

  private getMediaElement(): HTMLElement {
    if (this.isMediaElementLoaded) {
      if (this.isImage)
        return this.imageElement;
      else
        return this.videoElement;
    }
    return null;
  }

  private getFitTransform() {
    let center = "translate(" + (this.mediaWidth * -.5 + this.hostWidth * 0.5) + "px, " + (this.mediaHeight * -.5 + this.hostHeight * 0.5) + "px)";
    let transform = "";

    switch(this.fit) {
      case "contain":
        transform = "scale(" + (this.isTall() ? this.hostHeight / this.mediaHeight : this.hostWidth / this.mediaWidth) + ") " + center;
        break;

      case "pan":
      case "cover":
        transform = "scale(" + (this.isTall() ? this.hostWidth / this.mediaWidth : this.hostHeight / this.mediaHeight) + ") " + center;
        break;

      case "fill":
        transform = "scale(" + (this.hostWidth / this.mediaWidth) + ", " + (this.hostHeight / this.mediaHeight) + ") " + center;
        break;

      case "scale-down":
        transform = "scale(" + Math.min(this.isTall() ? this.hostHeight / this.mediaHeight : this.hostWidth / this.mediaWidth, 1) + ") " + center;
        break;

      case "none":
      default:
        transform = center;
    }

    return transform;
  }


  private startVideoPlay() {
    if (this.videoElement.currentTime == 0 || this.videoElement.paused || this.videoElement.ended) {
      if (this.playStart !== null)
        this.videoElement.currentTime = this.playStart;

      this.videoElement.play().then(()=>{
        if (!this.playStartedEmitted) {
          this.playStarted.emit();
          this.playStartedEmitted = true;
        }

        if (this.playTime) {
          setTimeout(() => { this.endVideoPlay(); }, this.playTime * 1000);
        } else {
          this.videoElement.onended = () => { this.playEnded.emit(); };
        }
      }, ()=>{
        console.log("Can't play " + this.src);
        this.loop = false;
        this.endVideoPlay();
      });
    }
  }

  private endVideoPlay() {
    this.videoElement.pause();
    if (this.loop) {
      if (this.playStart === null)
        this.videoElement.currentTime = 0;
      this.startVideoPlay();
    }
    else {
      this.playEnded.emit();
    }
  }




  private startPanAnimation() {
    if (this.fit !== "pan")
      return;

    this.panDiv.classList.remove("panner");
    void this.panDiv.offsetWidth;
    this.panDiv.classList.add("panner");

    this.panDiv.addEventListener("animationiteration", this.handleAnimationIteration);
    this.panDiv.addEventListener("animationend", this.handleAnimationEnd);

    this.panIterationsDone = 0;
    this.panFinished = false;

    let [xStart, yStart, xEnd, yEnd] = this.getPanProperties();

    if (this.panDirection === "normal" || (this.panDirection === "random" && Math.random() < .5)) {
      this.panDiv.style.setProperty("--pan-start-x", xStart);
      this.panDiv.style.setProperty("--pan-start-y", yStart);
      this.panDiv.style.setProperty("--pan-end-x", xEnd);
      this.panDiv.style.setProperty("--pan-end-y", yEnd);
    } else {
      this.panDiv.style.setProperty("--pan-start-x", xEnd);
      this.panDiv.style.setProperty("--pan-start-y", yEnd);
      this.panDiv.style.setProperty("--pan-end-x", xStart);
      this.panDiv.style.setProperty("--pan-end-y", yStart);
    }

    this.panDiv.style.setProperty("--pan-duration", this.panTime + "s");
    this.panDiv.style.setProperty("--pan-direction", "alternate");
    this.panDiv.style.setProperty("--pan-iteration-count", "infinite");
  }

  private handleAnimationIteration = () => {
    this.panIterationsDone += 1;
    if (this.panIterationsDone >= this.panIterations) {
      if (!this.panEndAtCenter)
        this.panFinished = true;
      else
        this.panDiv.style.setProperty("--pan-iteration-count", (this.panIterationsDone + .5).toString());
    }

  };

  private handleAnimationEnd = () => {
    if (this.panIterationsDone >= this.panIterations)
      this.panFinished = true;
  };

  private getPanProperties(): [string, string, string, string] {
    let xStart: number; let yStart: number; let xEnd: number; let yEnd: number;
    if (this.mediaWidth / this.mediaHeight < this.hostWidth / this.hostHeight) { // tall
      xStart = 0; xEnd = 0;

      let scale = this.hostWidth / this.mediaWidth;
      let partLost = scale * this.mediaHeight - this.hostHeight;
      yStart = partLost * -0.5; yEnd = partLost * 0.5;
    } else { // wide
      yStart = 0; yEnd = 0;

      let scale = this.hostHeight / this.mediaHeight;
      let partLost = scale * this.mediaWidth - this.hostWidth;
      xStart = partLost * 0.5; xEnd = partLost * -0.5;
    }

    return [xStart + "px", yStart + "px", xEnd + "px", yEnd + "px"];
  }



  componentWillLoad() {
    this.mediaViewSource.registerLoadingCallback(this.handleSourceLoading);
    this.mediaViewSource.registerLoadedCallback(this.handleSourceLoaded);
    if (this.mediaViewSource.isLoaded())
      this.handleSourceLoaded();

    if (this.src && this.src.length > 0)
      this.srcUpdated();
  }

  componentDidLoad() {
    this.handleHostResize();
  }

  renderContent() {
    if (this.isSourceLoading) {
      return (<slot name="loading">
          <div class="lds-spinner"><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div>
        </slot>);
    } else {
      if (this.isSourceValid) {
        return (
          <div class={{"panner": true, "unpaused": this.fit == "pan" && !this.panPaused && !this.panFinished}} ref={(el) => this.panDiv = el}>
            <div class="fitter" style={{"transform": this.getFitTransform()}}>
              {this.isImage
                ? <img ref={(el) => this.imageElement = el} src={this.mediaViewSource.getSource()} onLoad={() => this.handleOnloadImage()}/>
                : <video ref={(el) => this.videoElement = el} src={this.mediaViewSource.getSource()} onCanPlay={() => this.handleOnloadVideo()}></video>
              }
            </div>
          </div>
        );
      } else {
        return (
          <slot name="error">Error</slot>
        );
      }
    }
  }

  render() {
    return (
      <div class={{"container": true, "loading": this.isSourceLoading, "error": !this.isSourceValid}}>
        {this.renderContent()}
      </div>
    );
  }
}

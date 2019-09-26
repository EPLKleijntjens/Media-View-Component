import { Component, Prop, Watch, h, State, Event, EventEmitter, Listen, Element } from '@stencil/core';
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

  /** (optional) The kind of "object-fit" to use for the image/video. Can be contian, cover, fill, none or scale-down. Defaults to contain. */
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
  /** (optional) Whether the animation runs forwards (normal), backwards (reverse), switches direction after each iteration (alternate), or runs backwards and switches direction after each iteration (alternate-reverse). Defaults to "normal". */
  @Prop() panDirection: string = "normal";
  /** (optional) Set the number of iterations of the panning animation. Accepts Infinity. */
  @Prop() panIterations: number = 1;
  /** (optional) Duration in seconds of the panning animation. */
  @Prop() panTime: number = null;




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


  private isMediaElementLoaded: boolean = false;
  private imageElement: HTMLImageElement;
  private videoElement: HTMLVideoElement;
  private playStartedEmitted: boolean = false;



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
  private playUpdated() {
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

  @Watch("panPaused")
  private panPausedUpdated() { this.handlePanAnimation(); };

  @Watch("panLoop")
  private panLoopUpdated() { this.handlePanAnimation(); };

  @Watch("panTime")
  private panTimeUpdated() { this.handlePanAnimation(); };





  @Listen("resize", {target: 'window'})
  private handleHostResize() {
    this.hostWidth = this.hostElement.clientWidth;
    this.hostHeight = this.hostElement.clientHeight;
  }

  private isTall(): boolean {
    if (!this.isSourceLoading) {
      let mediaScale = this.mediaViewSource.getWidth() / this.mediaViewSource.getHeight();
      let containerScale = this.hostWidth / this.hostHeight;

      return mediaScale < containerScale;
    }
    return null;
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
      })
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


  private handleOnloadImage() {
    this.isMediaElementLoaded = true;
    this.handlePanAnimation();

    this.mediaLoaded.emit();
  }

  private handleOnloadVideo() {
    this.isMediaElementLoaded = true;
    this.videoElement.muted = true;
    this.playStartedEmitted = false;

    this.loopUpdated();
    this.playUpdated();
    this.handlePanAnimation();

    this.mediaLoaded.emit();
  }


  private handleSourceLoading = () => {
    this.isSourceLoading = true;
    this.isMediaElementLoaded = false;
  }

  private handleSourceLoaded = () => {
    this.isSourceValid = this.mediaViewSource.isValidSource();
    this.isImage = this.mediaViewSource.isImage();
    this.isSourceLoading = false;

    if (!this.isSourceValid)
      this.mediaSourceInvalid.emit();
  }

  private handlePanAnimation() {
    let mediaElement = this.getMediaElement();

    if (this.fit == "cover-pan" && mediaElement !== null) {
      let mediaWidth = this.mediaViewSource.getWidth();
      let mediaHeight = this.mediaViewSource.getHeight();

      let mediaScale = mediaWidth / mediaHeight;
      let containerScale = this.hostWidth / this.hostHeight;

      let xStart: number; let yStart: number; let xEnd: number; let yEnd: number;
      if (mediaScale < containerScale) { // tall
        xStart = 0; xEnd = 0;
        let partLost = 1 - this.hostHeight / ((this.hostWidth / mediaWidth) * mediaHeight);
        yStart = partLost * -0.5;
        yEnd = partLost * 0.5;
      } else { // wide
        yStart = 0; yEnd = 0;
        let partLost = 1 - this.hostWidth / ((this.hostHeight / mediaHeight) * mediaWidth);
        xStart = partLost * 0.5;
        xEnd = partLost * -0.5;
      }

      xStart = xStart * 100 - 50;
      yStart = yStart * 100 - 50;
      xEnd = xEnd * 100 - 50;
      yEnd = yEnd * 100 - 50;

      mediaElement.animate({
          offset: [0, 1],
          easing: ["linear", "linear"],
          transform: ["translate(" + xStart + "%, " + yStart + "%)", "translate(" + xEnd + "%, " + yEnd + "%)"]
        }, {
          duration: this.panTime * 1000,
          iterations: this.panIterations,
          direction: this.panDirection as PlaybackDirection
        });
    }
  }


  private getContainerClasses(): {[className: string]: boolean} {
    let o = {};
    o[this.fit] = true;
    if (this.isSourceLoading) o["loading"] = true;
    if (!this.isSourceValid) o["error"] = true;
    if (this.isTall()) o["tall"] = true;
    else o["wide"] = true;

    return o;
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
        if (this.isImage) {
          return (
            <img ref={(el) => this.imageElement = el} src={this.mediaViewSource.getSource()} onLoad={() => this.handleOnloadImage()}/>
          );
        } else {
          return (
            <video ref={(el) => this.videoElement = el} src={this.mediaViewSource.getSource()} onCanPlay={() => this.handleOnloadVideo()}></video>
          );
        }
      } else {
        return (
          <slot name="error">Error</slot>
        );
      }
    }
  }

  render() {
    return (
      <div class={this.getContainerClasses()}>
        {this.renderContent()}
      </div>
    );
  }
}

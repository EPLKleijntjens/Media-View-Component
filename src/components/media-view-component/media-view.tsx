import { Component, Prop, Watch, h, State, Event, EventEmitter, Host } from '@stencil/core';
import { MediaSource } from '../../utils/media-source';

@Component({
  tag: 'media-view',
  styleUrl: 'media-view.css',
  shadow: false
})
export class MediaView {

  /** The source url of the image/video. Use either this or the mediaSource property. */
  @Prop() src: string;
  /** (optional) The source type. Can be either "image" or "video". If unspecified, the component will figure it out. */
  @Prop() srcType: string;
  /** Use to set the mediaSource object directly. Use either this or the src property. */
  @Prop() mediaSource: MediaSource = new MediaSource();

  /** (optional) The kind of "object-fit" to use for the image/video. Can be contian, cover, fill, none or scale-down. Defaults to contain. */
  @Prop() fit: string = "contain";

  /** (optional) Set to true to start playing if the source is a video. */
  @Prop() play: boolean = false;
  /** (optional) Set to true to loop if the source is a video */
  @Prop() loop: boolean = false;
  /** (optional) Time in seconds to play if source is a video. */
  @Prop() playTime: number = null;
  /** (optional) Time in seconds to start playing from (and loop back to) if source is a video. */
  @Prop() playStart: number = null;

  /** Fires when the image/video is loaded. */
  @Event() mediaLoaded: EventEmitter;
  /** Fires when the image/video could not be loaded. */
  @Event() mediaSourceInvalid: EventEmitter;
  /** Fires when the video starts playing. */
  @Event() playStarted: EventEmitter;
  /** Fires when the video stopped playing. */
  @Event() playEnded: EventEmitter;


  @State() private isLoading: boolean = true;
  @State() private isValid: boolean;
  @State() private isImage: boolean;


  private videoElement: HTMLVideoElement;
  private playStartedEmitted: boolean = false;



  @Watch("src")
  private srcUpdated() {
    this.isLoading = true;

    if (typeof this.srcType == "string") {
      if (this.srcType.toLowerCase() === "image")
        this.mediaSource.setSourceImage(this.src);
      else if (this.srcType.toLowerCase() === "video")
        this.mediaSource.setSourceVideo(this.src);
      else
        this.mediaSource.setSource(this.src);
    }
    else
      this.mediaSource.setSource(this.src);
  }

  @Watch("mediaSource")
  private mediaSourceUpdated(newValue: MediaSource, oldValue: MediaSource) {
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

  @Watch("play")
  private playUpdated() {
    if (typeof this.videoElement !== 'undefined' && this.videoElement !== null) {
      if (this.play) {
        this.startVideoPlay();
      } else {
        this.videoElement.pause();
        this.playStartedEmitted = false;
      }
    }
  }

  @Watch("loop")
  private loopUpdated() {
    if (typeof this.videoElement !== 'undefined' && this.videoElement !== null && this.play) {
      this.videoElement.loop = this.loop;
    }
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
    else
      this.playEnded.emit();
  }


  private handleOnloadImage() {
    this.mediaLoaded.emit();
  }

  private handleOnloadVideo() {
    this.mediaLoaded.emit();
    this.videoElement.muted = true;
    this.playStartedEmitted = false;

    this.loopUpdated();
    this.playUpdated();
  }


  private handleSourceLoading = () => {
    this.isLoading = true;
  }

  private handleSourceLoaded = () => {
    this.isValid = this.mediaSource.isValidSource();
    this.isImage = this.mediaSource.isImage();
    this.isLoading = false;

    if (!this.isValid)
      this.mediaSourceInvalid.emit();
  }


  private getContainerClasses(): {[className: string]: boolean} {
    let o = {};
    o[this.fit] = true;
    if (this.isLoading) o["loading"] = true;
    if (!this.isValid) o["error"] = true;

    return o;
  }



  componentWillLoad() {
    this.mediaSource.registerLoadingCallback(this.handleSourceLoading);
    this.mediaSource.registerLoadedCallback(this.handleSourceLoaded);
    if (this.mediaSource.isLoaded())
      this.handleSourceLoaded();

    if (this.src && this.src.length > 0)
      this.srcUpdated();
  }


  renderContent() {
    if (this.isLoading) {
      return (<slot name="loading">
          <div class="lds-spinner"><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div>
        </slot>);
    } else {
      if (this.isValid) {
        if (this.isImage) {
          return (
            <img src={this.mediaSource.getSource()} onLoad={() => this.handleOnloadImage()}/>
          );
        } else {
          return (
            <video ref={(el) => this.videoElement = el} src={this.mediaSource.getSource()} onCanPlay={() => this.handleOnloadVideo()}></video>
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

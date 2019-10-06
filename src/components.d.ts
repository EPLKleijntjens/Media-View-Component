/* tslint:disable */
/**
 * This is an autogenerated file created by the Stencil compiler.
 * It contains typing information for all components that exist in this project.
 */


import { HTMLStencilElement, JSXBase } from '@stencil/core/internal';
import {
  MediaViewSource,
} from './utils/media-view-source';

export namespace Components {
  interface MediaView {
    /**
    * (optional) The kind of "object-fit" to use for the image/video. Can be contian, cover, fill, none, scale-down or pan.
    */
    'fit': string;
    /**
    * (optional) Set to true to loop if the source is a video
    */
    'loop': boolean;
    /**
    * Use to set the mediaSource object directly. Use either this or the src property.
    */
    'mediaViewSource': MediaViewSource;
    /**
    * (optional) The direction in which the panning starts. Accepts 'normal' (up for tall media, right for wide), 'reverse' (down for tall media, left for wide) or 'random'.
    */
    'panDirection': string;
    /**
    * (optional) Set to false to prevent panning back to the center after all iterations are done.
    */
    'panEndAtCenter': boolean;
    /**
    * (optional) Set the number of iterations (passes) of the panning animation. Only accepts whole numbers and Infinity.
    */
    'panIterations': number;
    /**
    * (optional) The minimum percentage of the media surface that is garanteed to be visible at any point during the panning.
    */
    'panMinVisible': number;
    /**
    * (optional) Set to true to pause the panning animation.
    */
    'panPaused': boolean;
    /**
    * (optional) Duration in seconds of a single iteration (pass), not counting returning to center.
    */
    'panTime': number;
    /**
    * (optional) Set to false to start playing if the source is a video.
    */
    'paused': boolean;
    /**
    * (optional) Time in seconds to start playing from (and loop back to) if source is a video.
    */
    'playStart': number;
    /**
    * (optional) Time in seconds to play if source is a video.
    */
    'playTime': number;
    'sizeUpdated': () => Promise<void>;
    /**
    * The source url of the image/video. Use either this or the mediaSource property.
    */
    'src': string;
    /**
    * (optional) The source type. Can be either "image" or "video". If unspecified, the component will figure it out.
    */
    'srcType': string;
  }
}

declare global {


  interface HTMLMediaViewElement extends Components.MediaView, HTMLStencilElement {}
  var HTMLMediaViewElement: {
    prototype: HTMLMediaViewElement;
    new (): HTMLMediaViewElement;
  };
  interface HTMLElementTagNameMap {
    'media-view': HTMLMediaViewElement;
  }
}

declare namespace LocalJSX {
  interface MediaView extends JSXBase.HTMLAttributes<HTMLMediaViewElement> {
    /**
    * (optional) The kind of "object-fit" to use for the image/video. Can be contian, cover, fill, none, scale-down or pan.
    */
    'fit'?: string;
    /**
    * (optional) Set to true to loop if the source is a video
    */
    'loop'?: boolean;
    /**
    * Use to set the mediaSource object directly. Use either this or the src property.
    */
    'mediaViewSource'?: MediaViewSource;
    /**
    * Fires when the image/video is loaded.
    */
    'onMediaLoaded'?: (event: CustomEvent<any>) => void;
    /**
    * Fires when the image/video could not be loaded.
    */
    'onMediaSourceInvalid'?: (event: CustomEvent<any>) => void;
    /**
    * Fires when the video stopped playing.
    */
    'onPlayEnded'?: (event: CustomEvent<any>) => void;
    /**
    * Fires when the video starts playing.
    */
    'onPlayStarted'?: (event: CustomEvent<any>) => void;
    /**
    * (optional) The direction in which the panning starts. Accepts 'normal' (up for tall media, right for wide), 'reverse' (down for tall media, left for wide) or 'random'.
    */
    'panDirection'?: string;
    /**
    * (optional) Set to false to prevent panning back to the center after all iterations are done.
    */
    'panEndAtCenter'?: boolean;
    /**
    * (optional) Set the number of iterations (passes) of the panning animation. Only accepts whole numbers and Infinity.
    */
    'panIterations'?: number;
    /**
    * (optional) The minimum percentage of the media surface that is garanteed to be visible at any point during the panning.
    */
    'panMinVisible'?: number;
    /**
    * (optional) Set to true to pause the panning animation.
    */
    'panPaused'?: boolean;
    /**
    * (optional) Duration in seconds of a single iteration (pass), not counting returning to center.
    */
    'panTime'?: number;
    /**
    * (optional) Set to false to start playing if the source is a video.
    */
    'paused'?: boolean;
    /**
    * (optional) Time in seconds to start playing from (and loop back to) if source is a video.
    */
    'playStart'?: number;
    /**
    * (optional) Time in seconds to play if source is a video.
    */
    'playTime'?: number;
    /**
    * The source url of the image/video. Use either this or the mediaSource property.
    */
    'src'?: string;
    /**
    * (optional) The source type. Can be either "image" or "video". If unspecified, the component will figure it out.
    */
    'srcType'?: string;
  }

  interface IntrinsicElements {
    'media-view': MediaView;
  }
}

export { LocalJSX as JSX };


declare module "@stencil/core" {
  export namespace JSX {
    interface IntrinsicElements extends LocalJSX.IntrinsicElements {}
  }
}



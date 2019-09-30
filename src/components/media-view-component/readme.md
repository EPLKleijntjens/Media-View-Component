# media-view



<!-- Auto Generated Below -->


## Properties

| Property          | Attribute           | Description                                                                                                                                                             | Type              | Default                 |
| ----------------- | ------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------- | ----------------------- |
| `fit`             | `fit`               | (optional) The kind of "object-fit" to use for the image/video. Can be contian, cover, fill, none, scale-down or pan.                                                   | `string`          | `"contain"`             |
| `loop`            | `loop`              | (optional) Set to true to loop if the source is a video                                                                                                                 | `boolean`         | `false`                 |
| `mediaViewSource` | --                  | Use to set the mediaSource object directly. Use either this or the src property.                                                                                        | `MediaViewSource` | `new MediaViewSource()` |
| `panDirection`    | `pan-direction`     | (optional) The direction in which the panning starts. Accepts 'normal' (up for tall media, right for wide), 'reverse' (down for tall media, left for wide) or 'random'. | `string`          | `"normal"`              |
| `panEndAtCenter`  | `pan-end-at-center` | (optional) Set to false to prevent panning back to the center after all iterations are done.                                                                            | `boolean`         | `true`                  |
| `panIterations`   | `pan-iterations`    | (optional) Set the number of iterations (passes) of the panning animation. Only accepts whole numbers and Infinity.                                                     | `number`          | `1`                     |
| `panPaused`       | `pan-paused`        | (optional) Set to true to pause the panning animation.                                                                                                                  | `boolean`         | `false`                 |
| `panTime`         | `pan-time`          | (optional) Duration in seconds of a single iteration (pass), not counting returning to center.                                                                          | `number`          | `5`                     |
| `paused`          | `paused`            | (optional) Set to false to start playing if the source is a video.                                                                                                      | `boolean`         | `true`                  |
| `playStart`       | `play-start`        | (optional) Time in seconds to start playing from (and loop back to) if source is a video.                                                                               | `number`          | `null`                  |
| `playTime`        | `play-time`         | (optional) Time in seconds to play if source is a video.                                                                                                                | `number`          | `null`                  |
| `src`             | `src`               | The source url of the image/video. Use either this or the mediaSource property.                                                                                         | `string`          | `undefined`             |
| `srcType`         | `src-type`          | (optional) The source type. Can be either "image" or "video". If unspecified, the component will figure it out.                                                         | `string`          | `undefined`             |


## Events

| Event                | Description                                     | Type               |
| -------------------- | ----------------------------------------------- | ------------------ |
| `mediaLoaded`        | Fires when the image/video is loaded.           | `CustomEvent<any>` |
| `mediaSourceInvalid` | Fires when the image/video could not be loaded. | `CustomEvent<any>` |
| `playEnded`          | Fires when the video stopped playing.           | `CustomEvent<any>` |
| `playStarted`        | Fires when the video starts playing.            | `CustomEvent<any>` |


## Methods

### `sizeUpdated() => Promise<void>`



#### Returns

Type: `Promise<void>`




----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*

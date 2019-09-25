# media-view



<!-- Auto Generated Below -->


## Properties

| Property          | Attribute        | Description                                                                                                                                                                                                                                 | Type              | Default                 |
| ----------------- | ---------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------- | ----------------------- |
| `fit`             | `fit`            | (optional) The kind of "object-fit" to use for the image/video. Can be contian, cover, fill, none or scale-down. Defaults to contain.                                                                                                       | `string`          | `"contain"`             |
| `loop`            | `loop`           | (optional) Set to true to loop if the source is a video                                                                                                                                                                                     | `boolean`         | `false`                 |
| `mediaViewSource` | --               | Use to set the mediaSource object directly. Use either this or the src property.                                                                                                                                                            | `MediaViewSource` | `new MediaViewSource()` |
| `panDirection`    | `pan-direction`  | (optional) Whether the animation runs forwards (normal), backwards (reverse), switches direction after each iteration (alternate), or runs backwards and switches direction after each iteration (alternate-reverse). Defaults to "normal". | `string`          | `"normal"`              |
| `panIterations`   | `pan-iterations` | (optional) Set the number of iterations of the panning animation. Accepts Infinity.                                                                                                                                                         | `number`          | `1`                     |
| `panPaused`       | `pan-paused`     | (optional) Set to true to pause the panning animation.                                                                                                                                                                                      | `boolean`         | `false`                 |
| `panTime`         | `pan-time`       | (optional) Duration in seconds of the panning animation.                                                                                                                                                                                    | `number`          | `null`                  |
| `paused`          | `paused`         | (optional) Set to false to start playing if the source is a video.                                                                                                                                                                          | `boolean`         | `true`                  |
| `playStart`       | `play-start`     | (optional) Time in seconds to start playing from (and loop back to) if source is a video.                                                                                                                                                   | `number`          | `null`                  |
| `playTime`        | `play-time`      | (optional) Time in seconds to play if source is a video.                                                                                                                                                                                    | `number`          | `null`                  |
| `src`             | `src`            | The source url of the image/video. Use either this or the mediaSource property.                                                                                                                                                             | `string`          | `undefined`             |
| `srcType`         | `src-type`       | (optional) The source type. Can be either "image" or "video". If unspecified, the component will figure it out.                                                                                                                             | `string`          | `undefined`             |


## Events

| Event                | Description                                     | Type               |
| -------------------- | ----------------------------------------------- | ------------------ |
| `mediaLoaded`        | Fires when the image/video is loaded.           | `CustomEvent<any>` |
| `mediaSourceInvalid` | Fires when the image/video could not be loaded. | `CustomEvent<any>` |
| `playEnded`          | Fires when the video stopped playing.           | `CustomEvent<any>` |
| `playStarted`        | Fires when the video starts playing.            | `CustomEvent<any>` |


----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*

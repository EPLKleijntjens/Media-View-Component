![Built With Stencil](https://img.shields.io/badge/-Built%20With%20Stencil-16161d.svg?logo=data%3Aimage%2Fsvg%2Bxml%3Bbase64%2CPD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz4KPCEtLSBHZW5lcmF0b3I6IEFkb2JlIElsbHVzdHJhdG9yIDE5LjIuMSwgU1ZHIEV4cG9ydCBQbHVnLUluIC4gU1ZHIFZlcnNpb246IDYuMDAgQnVpbGQgMCkgIC0tPgo8c3ZnIHZlcnNpb249IjEuMSIgaWQ9IkxheWVyXzEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHg9IjBweCIgeT0iMHB4IgoJIHZpZXdCb3g9IjAgMCA1MTIgNTEyIiBzdHlsZT0iZW5hYmxlLWJhY2tncm91bmQ6bmV3IDAgMCA1MTIgNTEyOyIgeG1sOnNwYWNlPSJwcmVzZXJ2ZSI%2BCjxzdHlsZSB0eXBlPSJ0ZXh0L2NzcyI%2BCgkuc3Qwe2ZpbGw6I0ZGRkZGRjt9Cjwvc3R5bGU%2BCjxwYXRoIGNsYXNzPSJzdDAiIGQ9Ik00MjQuNywzNzMuOWMwLDM3LjYtNTUuMSw2OC42LTkyLjcsNjguNkgxODAuNGMtMzcuOSwwLTkyLjctMzAuNy05Mi43LTY4LjZ2LTMuNmgzMzYuOVYzNzMuOXoiLz4KPHBhdGggY2xhc3M9InN0MCIgZD0iTTQyNC43LDI5Mi4xSDE4MC40Yy0zNy42LDAtOTIuNy0zMS05Mi43LTY4LjZ2LTMuNkgzMzJjMzcuNiwwLDkyLjcsMzEsOTIuNyw2OC42VjI5Mi4xeiIvPgo8cGF0aCBjbGFzcz0ic3QwIiBkPSJNNDI0LjcsMTQxLjdIODcuN3YtMy42YzAtMzcuNiw1NC44LTY4LjYsOTIuNy02OC42SDMzMmMzNy45LDAsOTIuNywzMC43LDkyLjcsNjguNlYxNDEuN3oiLz4KPC9zdmc%2BCg%3D%3D&colorA=16161d&style=flat-square)

# Media View Component

`<media-view>` is a Web Component that acts as an abstraction for the `<img>` and `<video>` elements. Use the `src` attribute like normal and the `media-view` component will figure out if it's dealing with an image or a video.


## Installation

### Script tag
- Put this script tag `<script src='https://unpkg.com/media-view-component/dist/mediaviewcomponent.js'></script>` in the head of your index.html
- Then you can use the element anywhere in your template, JSX, html etc

### Node Modules
- Run `npm install media-view-component --save`
- Put this script tag `<script src='node_modules/media-view-component/dist/mediaviewcomponent.js'></script>` in the head of your index.html
- Then you can use the element anywhere in your template, JSX, html etc

### In a stencil-starter app
- Run `npm install media-view-component --save`
- Add an import to the npm packages `import media-view-component;`
- Then you can use the element anywhere in your template, JSX, html etc


## Usage

Just place the `<media-view>` anywhere you would otherwise have used an `<img>` or `<video>` element. Supply a `src` attribute or set the `mediaSource` property on the element from code and it will load and display the media. If you know beforehand that the source is an image or video, you can use the optional `srcType` attribute.
```html
<media-view src="https://www.fillmurray.com/420/560"></media-view>
<media-view src="https://www.fillmurray.com/420/560" srcType="image"></media-view>
```

A default loading spinner and error message are included, but if you want to show something else at those times, you can use the "loading" and/or "error" slots like this:
```html
<media-view src="https://www.fillmurray.com/420/560">
  <div slot="loading"><span class="my-own-fancy-spinner">turn turn turn</span></div>
  <h1 slot="error">Something went horribly wrong!</h1>
</media-view>
```

Below is an overview of all the available properties on the `<media-view>` element. Also see a comprehensive example [here](https://codepen.io/EPLKleijntjens/pen/eYOXMyK).


### Properties

| Property        | Attribute        | Description                                                                                                                                                                                                                                 | Type          | Default             |
| --------------- | ---------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------- | ------------------- |
| `fit`           | `fit`            | (optional) The kind of "object-fit" to use for the image/video. Can be contian, cover, fill, none or scale-down. Defaults to contain.                                                                                                       | `string`      | `"contain"`         |
| `loop`          | `loop`           | (optional) Set to true to loop if the source is a video                                                                                                                                                                                     | `boolean`     | `false`             |
| `mediaSource`   | --               | Use to set the mediaSource object directly. Use either this or the src property.                                                                                                                                                            | `MediaSource` | `new MediaSource()` |
| `panDirection`  | `pan-direction`  | (optional) Whether the animation runs forwards (normal), backwards (reverse), switches direction after each iteration (alternate), or runs backwards and switches direction after each iteration (alternate-reverse). Defaults to "normal". | `string`      | `"normal"`          |
| `panIterations` | `pan-iterations` | (optional) Set the number of iterations of the panning animation. Accepts Infinity.                                                                                                                                                         | `number`      | `1`                 |
| `panPaused`     | `pan-paused`     | (optional) Set to true to pause the panning animation.                                                                                                                                                                                      | `boolean`     | `false`             |
| `panTime`       | `pan-time`       | (optional) Duration in seconds of the panning animation.                                                                                                                                                                                    | `number`      | `null`              |
| `paused`        | `paused`         | (optional) Set to false to start playing if the source is a video.                                                                                                                                                                          | `boolean`     | `true`              |
| `playStart`     | `play-start`     | (optional) Time in seconds to start playing from (and loop back to) if source is a video.                                                                                                                                                   | `number`      | `null`              |
| `playTime`      | `play-time`      | (optional) Time in seconds to play if source is a video.                                                                                                                                                                                    | `number`      | `null`              |
| `src`           | `src`            | The source url of the image/video. Use either this or the mediaSource property.                                                                                                                                                             | `string`      | `undefined`         |
| `srcType`       | `src-type`       | (optional) The source type. Can be either "image" or "video". If unspecified, the component will figure it out.                                                                                                                             | `string`      | `undefined`         |


### Events

| Event                | Description                                     |
| -------------------- | ----------------------------------------------- |
| `mediaLoaded`        | Fires when the image/video is loaded.           |
| `mediaSourceInvalid` | Fires when the image/video could not be loaded. |
| `playEnded`          | Fires when the video stopped playing.           |
| `playStarted`        | Fires when the video starts playing.            |

# Go Tags

## Usage

```json
{
  "[go]": {
    "editor.quickSuggestions": {
      //...
      "strings": "on" // First, you need config this.
      // "strings": "inline" // If you configed like this. You will never see quick suggest window.
    },
}
```

![go-tags-on](https://raw.githubusercontent.com/whosydd/images-in-one/main/images/202210092315522.gif)![go-tags-inline](https://raw.githubusercontent.com/whosydd/images-in-one/main/images/202210092315789.gif)

## Configuration

```json
// settings.json
{
  //...
  "[go]": {
    "editor.quickSuggestions": {
      "other": "on",
      "comments": "off",
      "strings": "on"
    },
    // just for Go
    "go-tags.associations": ["json", "xml", "yaml"]
  },
  // global config
  "go-tags.associations": ["json", "xml", "yaml"]
}
```

## Thanks

icon by <a href="https://www.flaticon.com/free-icons/label" title="label icons"> Vectors Market - Flaticon</a>

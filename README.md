# tableau-extension


## Production

1. npm build
2. npm deploy
3. Check the Github pages. (`https://{account}.github.io/tableau-extension`)

## Development

1. npm start (`http://localhost:8080`)
2. Dashboard > Left pain > Objects > Double click to `Extension`
3. Click to `My Extensions` in Choose an Exntension Dialog
4. Select `manifest/MAGGELAN_BLOCKS-dev.trex`


#### Tips.

Remote debugging an extension.

1. Starting Tableau with a command option
  `open /Applications/Tableau\ Desktop\ 2019.2.app --args --remote-debugging-port=8696`
2. Open http://localhost:8696 in your browser


## Misc

[Tableau Extension API](https://tableau.github.io/extensions-api/)



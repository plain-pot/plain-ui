module.exports = {
  presets: [
    '@vue/app', ["@babel/preset-env", {"modules": false}]
  ],
  /*"plugins": [
    [
      "import",
      {
        "libraryName": "yirous-view",
        "libraryDirectory": "docs/lib",
        "style": (name) => {
          const separatorIndex = name.lastIndexOf('/')
          const libName = name.substring(0, separatorIndex)
          const componentName = name.substring(separatorIndex + 1)
          return `${libName}/theme/default/${componentName}.css`
        }
      }
    ]
  ]*/
}

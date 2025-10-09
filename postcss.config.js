module.exports = {
  plugins: [
    require('autoprefixer')({
      overrideBrowserslist: [
        'last 10 versions', // Last 5 versions of each browser
      ]
    })
  ]
};

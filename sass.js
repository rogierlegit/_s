var sass = require('sass');
var fs = require('fs');
var pkg = require('./package.json');
const postcss = require('postcss');
const autoprefixer = require('autoprefixer');

// Configs
var configs = {
	name: '_s',
	files: ['style.scss'],
	pathIn: 'src/scss',
	pathOut: './',
	indentType: 'tab',
	indentWidth: 1,
	minify: true,
	sourceMap: true
};

// Banner
var banner = `/*! ${configs.name ? configs.name : pkg.name} v${pkg.version} | (c) ${new Date().getFullYear()} ${pkg.author.name} | ${pkg.license} License | ${pkg.repository.url} */`;

var getOptions = function (file, filename, minify) {
    return {
        file: `${configs.pathIn}/${file}`,
        outFile: `${configs.pathOut}/${filename}`, // must match written file
        sourceMap: configs.sourceMap ? `${configs.pathOut}/${filename}.map` : false,
        sourceMapContents: true, // ensures SCSS is embedded for better mapping
        sourceMapIncludeSources: true, // adds original sources inline
        indentType: configs.indentType,
        indentWidth: configs.indentWidth,
        outputStyle: minify ? 'compressed' : 'expanded'
    };
};

var writeFile = function (pathOut, fileName, fileData, printBanner = true) {
    fs.mkdir(pathOut, { recursive: true }, function (err) {
        if (err) throw err;

        let output = printBanner ? banner + '\n' + fileData : fileData;

        fs.writeFile(`${pathOut}/${fileName}`, output, function (err) {
            if (err) throw err;
            console.log(`Compiled ${pathOut}/${fileName}`);
        });
    });
};

/**
 * Compile Sass -> PostCSS (Autoprefixer) -> Write CSS + Map
 */
function parseSass(file, minify = false) {
  const filename = `${file.replace(/\.scss$/, '')}${minify ? '.min' : ''}.css`;

  sass.render(getOptions(file, filename, minify), async (err, result) => {
    if (err) throw err;

    try {
      // Run PostCSS with Autoprefixer
      const postcssResult = await postcss([autoprefixer]).process(result.css, {
        from: undefined,
        map: result.map ? { prev: result.map.toString(), inline: false } : false
      });

      // Write CSS file
      writeFile(configs.pathOut, filename, postcssResult.css);

      // Write sourcemap
      if (configs.sourceMap && postcssResult.map) {
        writeFile(configs.pathOut, `${filename}.map`, postcssResult.map.toString(), false);
      }
    } catch (e) {
      console.error('PostCSS error:', e);
    }
  });
}

configs.files.forEach(file => {
  parseSass(file, false); // normal build
  if (configs.minify) parseSass(file, true); // minified build
});
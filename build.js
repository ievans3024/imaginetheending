// TODO: grunt & uglifyjs/less/clean-css hooks

var fs = require('fs'),
    js_srcdir,
    less = require('less'),
    less_clean_css = require('less-plugin-clean-css'),
    less_plugin,
    less_srcdir,
    outdir = 'dist',
    path = require('path');

function bubble_error(err) {
  if (err) {
    if (err instanceof Error) {
      throw err;
    } else {
      console.log(err);
    }
  }
}

function copy_file (srcpath, destpath, callback) {
  var callback_switch = false,
      src, dest;

  function done (status) {
    if (!callback_switch) {
      callback_switch = true;
      callback(status);
    }
  }

  src = fs.createReadStream(srcpath);
  dest = fs.createWriteStream(destpath);

  src.on('error', done);
  dest.on('error', done);
  dest.on('close', done);

  src.pipe(dest);
}


/*
 * Make output dir if it doesn't exist
 */

if (!fs.existsSync(outdir)) {
  fs.mkdirSync(outdir);
  fs.mkdirSync(path.join(outdir, 'templates'));
}


/*
 * Copy html files into dist
 */

// copy index.html
copy_file(path.join('src', 'html', 'index.html'), path.join(outdir, 'index.html'), bubble_error);

// copy templates
fs.readdir(
  path.join('src', 'html', 'templates'),
  function (err, files) {
    bubble_error(err);

    files.forEach(
      function (file) {
        copy_file(path.join('src', 'html', 'templates', file), path.join(outdir, 'templates', file), bubble_error);
      }
    )
  }
);


/*
 * Minify Angular app to dist/js/app.min.js
 */

js_srcdir = path.join('src', 'js');

fs.readdir(
  js_srcdir,
  function (err, files) {
    var ast = null,
        main_comment = "",
        ugly = require('uglify-js'),
        ugly_compressor = ugly.Compressor();

    bubble_error(err);

    files.forEach(
      function (file) {
        var filepath = path.join(js_srcdir, file),
            parse_opts = {filename: filepath, strict: true},
            data = fs.readFileSync(filepath, 'utf8');

        if (ast) {
          parse_opts.toplevel = ast;
        }

        try {
          ast = ugly.parse(data, parse_opts);
        } catch (err) {
          console.log(err.message, err.filename, err.line, err.col);
          throw new Error();
        }
      }
    );

    ast.body.forEach(
      function (body) {
        if (body.start.comments_before.length) {
          main_comment = "/*" + body.start.comments_before[0].value + "*/\n";
        }
      }
    );

    ast.figure_out_scope();
    ast.transform(ugly_compressor);

    fs.writeFileSync(
      path.join(outdir, 'app.min.js'),
      main_comment + ast.print_to_string(),
      'utf8'
    );
  }
);

/*
 * Minify json files
 */

fs.readdir(
  path.join('src', 'json'),
  function (err, files) {
    bubble_error(err);
    files.forEach(
      function (file) {
        fs.readFile(
          path.join('src', 'json', file),
          'utf8',
          function (err, data) {
            data = JSON.stringify(JSON.parse(data));
            fs.writeFile(
              path.join(outdir, file),
              data,
              'utf8'
            );
          }
        );
      }
    )
  }
);


/*
 * Compile and minify less with less-plugin-clean-css
 */

less_srcdir = path.join('src', 'less');
less_plugin = new less_clean_css({keepSpecialComments: 1, processImport: true});

fs.readFile(
  path.join(less_srcdir, 'main.less'),
  'utf8',
  function (err, data) {
    bubble_error(err);
    less.render(
      data,
      {
        paths: [less_srcdir],
        plugins: [less_plugin],
        filename: 'main.less'
      },
      function (error, output) {
        fs.writeFile(
          path.join(outdir, 'main.min.css'),
          output.css,
          'utf8'
        );
      }
    );
  }
);
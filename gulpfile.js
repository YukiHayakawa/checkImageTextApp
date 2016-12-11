var gulp = require('gulp'),
    browserSync = require('browser-sync').create(),
    reload = browserSync.reload,
    nodemon = require('gulp-nodemon');

gulp.task('nodemon', function(cb) {
    var called = false;

    return nodemon({
        script: './',
        ext: 'js ejs', // 監視するファイルの拡張子
        ignore: [ 'node_modules']
    })
    .on('start', function() {
        // サーバー起動時
        if (!called) {
            called = true;
            cb();
        }
    })
    .on('restart', function() {
        // サーバー再起動時
        setTimeout(function() {
            reload();
        }, 500);
    });
});

gulp.task('browser-sync', ['nodemon'], function() {
    browserSync.init(null, {
        proxy: 'http://localhost:3000',
        port: 7000
    });
});

gulp.task('default', ['browser-sync'], function() {
    console.log('starting...')
});

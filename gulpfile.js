var gulp = require('gulp');
var sass = require('gulp-ruby-sass');
var prefix = require('gulp-autoprefixer');
var replace = require('gulp-replace');
var include = require('gulp-file-include');

var sys = {
	src: "src/",
	public: "public/",
	reddit: "reddit/"
}
var paths = {
	src:{
		img: sys.src+"img",
		markup: sys.src+"markdown",
		styles: sys.src+"styles",
	},
	public:{
		img: sys.public+"img",
		markdown: sys.public+"markdown",
		css: sys.public+"css",
	},
	reddit:{
		sidebar: sys.reddit+"sidebar",
		css: sys.reddit+"css",
	}
};

// Default Watch task - run "gulp"
gulp.task("default", function(){
	gulp.watch(paths.src.img+"/**/*.*", ["to-img"], function(){});
    gulp.watch(paths.src.markup+"/**/*.md", ["to-html"], function(){});
    gulp.watch(paths.src.styles+"/**/*.scss", ["to-css"], function(){});
});

// SCSS to CSS task - run "gulp to-css"
gulp.task("to-css", function(){
	return gulp.src(paths.src.styles+"/*.scss")
	.pipe(sass())
	.pipe(prefix("last 5 version"))
	.pipe(gulp.dest(paths.public.css));
});

// Markdown task - run "gulp to-html"
gulp.task("to-markdown", function(){
	return gulp.src(paths.src.markup+"/*.md")
	.pipe(include('@@'))
	.pipe(gulp.dest(paths.public.markdown));
});

// img task - run "gulp to-img"
gulp.task("to-img", function(){
	return gulp.src(paths.src.img+"/*.*")
	.pipe(gulp.dest(paths.public.sidebar));
});

// CSS to reddit
gulp.task("to-reddit-css", ["to-css"], function(){
	return gulp.src(paths.public.css+"/*.css")
	.pipe(replace("../img/", "%%"))
	.pipe(replace(".jpg", "%%"))
	.pipe(replace(".png", "%%"))
	.pipe(gulp.dest(paths.reddit.css));
});

// Markdown to reddit
gulp.task("to-reddit-md", ["to-markdown"], function(){
	return gulp.src(paths.public.markdown+"/*.md")
	.pipe(gulp.dest(paths.reddit.sidebar));
});

// Order 66 - run "gulp order-66"
// This will produce the two files neccassary for reddit, which will be created in the "reddit" directory
gulp.task("order-66", ["to-reddit-css", "to-reddit-md"], function(){});

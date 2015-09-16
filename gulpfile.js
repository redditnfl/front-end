var gulp = require('gulp'),
	sass = require("gulp-sass"),
	sourcemaps = require('gulp-sourcemaps'),
	plumber = require("gulp-plumber"),
	prefix = require('gulp-autoprefixer'),
	replace = require('gulp-replace'),
	include = require('gulp-file-include'),
	notify = require("gulp-notify");

// Default path
	var paths = {
		src: {parentPath: "./src/"},
		pub: {parentPath: "./pub/"},
		reddit: {parentPath: "./reddit/"}
	};

// Create project paths
	createPath("scss", "css");
	createPath("img");
	createPath("markdown");

// Compile CSS - run "gulp css"
	gulp.task("css", function(){
		return gulp.src(paths.src.scss+"/**/*.scss")
		.pipe(plumber({errorHandler: errorAlert}))
		.pipe(sass({outputStyle: 'compressed'}))
		.pipe(sourcemaps.write('./maps'))
		.pipe(prefix({browsers: ["last 2 version"]}))
		.pipe(gulp.dest(paths.pub.css))
	});
	
// Compile Markdown - run "gulp md"
	gulp.task("md", function(){
		return gulp.src(paths.src.markdown+"/**/*.md")
		.pipe(plumber({errorHandler: errorAlert}))
		.pipe(include('@@'))
		.pipe(gulp.dest(paths.pub.markdown))
	});

// Move Images - run "gulp img"
	gulp.task("img", function(){
		return gulp.src(paths.src.img+"/*.*")
		.pipe(gulp.dest(paths.pub.img));
	});
	
	
// Compile
	gulp.task("compile", ["md", "css", "img"], function(){
		return gulp.src("src/fake")
		.pipe(notify({title: "Project Compiled!", message: "", sound: "Wuka"}))
		.pipe(gulp.dest("src/fake"))
	});
	
// Watch files
	gulp.task("watch", function(){
		gulp.watch(paths.src.scss+"/**/*.scss", ["css"]);
		gulp.watch(paths.src.img+"/*", ["img"]);
		gulp.watch(paths.src.markdown+"/**/*.md", ["md"]);
	});
	
// Default take
	gulp.task("default", ["watch", "compile"]);

// Reddit safe CSS
	gulp.task("reddit-css", ["css"], function(){
		return gulp.src(paths.pub.css+"/*.css")
		.pipe(replace("../img/", "%%"))
		.pipe(replace(".jpg", "%%"))
		.pipe(replace(".png", "%%"))
		.pipe(gulp.dest(paths.reddit.css));
	});

// Reddit Safe Markdown
	gulp.task("reddit-md", ["md"], function(){
		return gulp.src(paths.pub.markdown+"/*.md")
		.pipe(gulp.dest(paths.reddit.markdown));
	});

// Reddit Safe Images
	gulp.task("reddit-img", ["img"], function(){
		return gulp.src(paths.pub.img+"/*.*")
		.pipe(gulp.dest(paths.reddit.img));
	});
	
// Compile Reddit Safe Code
	gulp.task("reddit-compile", ["reddit-md", "reddit-css", "reddit-img"], function(){
		return gulp.src("src/fake")
		.pipe(notify({title: "Project Compiled!", message: "", sound: "Wuka"}))
		.pipe(gulp.dest("src/fake"))
	});

// Error function
	function errorAlert(error){
		notify.onError({title: "Gulp Error", message: "Check your terminal", sound: "Sosumi"})(error);
		console.log(error.toString());
		this.emit("end");
	};

// Create project paths
	function createPath(srcPath, pubPath){
		if(pubPath === undefined){
			var pubPath = srcPath;
		}
		// Final paths
		paths.src[srcPath+""] = paths.src.parentPath+srcPath;
		paths.pub[pubPath+""] = paths.pub.parentPath+pubPath;
		paths.reddit[pubPath+""] = paths.reddit.parentPath+pubPath;
	}
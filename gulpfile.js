// global
const gulp = require('gulp');
const notify = require('gulp-notify');
const plumber = require('gulp-plumber');
const fileinclude = require('gulp-file-include');
const replace = require('gulp-replace');
const include = require('gulp-file-include');
const csso = require('gulp-csso');
const clipboard = require("gulp-clipboard");

const fs = require('fs');
const filter = require('gulp-filter');
// assets

// css
const syntax_scss = require('postcss-scss');
const postcss = require('gulp-postcss');
const sass = require('gulp-sass')(require('sass'));
const autoprefixer = require('autoprefixer');
const pcss_size = require('postcss-short-size');
const pcss_alias = require('postcss-alias');
const pcss_base_64 = require('postcss-base64');
const pcss_media_query_packer = require('css-mqpacker');
const stylelint = require('stylelint');

const post_process = [
	autoprefixer(),
	pcss_size(),
	pcss_base_64(),
	pcss_base_64(),
	pcss_media_query_packer({ sort: true })
];

const file_paths = {
	src: {
		assets: "./src/assets/",
		css: "./src/scss/",
		js: "./src/js/",
		html: "./src/md/",
		modules: "./src/modules/"
	},
	dist: {
		assets: "./dist/assets/",
		css: "./dist/assets/css/",
		js: "./dist/assets/js/",
		html: "./dist/"
	}
};

const file_names = {
	assets: {
		compile: ['**/*.*', '**/_*.*'],
		ignore: [],
		watch: ['**/*.*', '**/_*.*']
	},
	css: {
		compile: ['**/*.scss', '**/*.css'],
		ignore: [],
		watch: ['**/*.scss', '**/*.css']
	},
	js: {
		compile: ['**/*.js', '**/*.json'],
		ignore: ['**/_*.js'],
		watch: ['**/*.js', '**/*.json', '**/_*.js']
	},
	html: {
		compile: ['**/*.md'],
		ignore: ['**/_*.md'],
		watch: ['**/*.md', '**/_*.md']
	}
}

// params:
// 		file_type: name of object in file_names, file_paths.src and file_paths.dist
// returns:
// 		src: an array of file locations for gulp tasks
// 		dist: a file location for completed tasks
// 		watch: an array of file locations for watch tasks
function get_file_paths(file_type){
	const src_path = file_paths.src[file_type];
	const modules_path = file_paths.src.modules;
	const dist_path = file_paths.dist[file_type];
	const names = file_names[file_type+''];

	function get_source(){
		const arr = [];
		names.compile.forEach(function(item){
			arr.push(src_path+item);
		});
		names.ignore.forEach(function(item){
			arr.push("!"+src_path+item);
		});
		return arr;
	}
	function get_watch(){
		const arr = [];
		names.watch.forEach(function(item){
			arr.push(src_path+item);
			arr.push(modules_path+item);
		});
		return arr;
	}


	return{
		src: get_source(),
		dist: dist_path,
		watch: get_watch()
	}
}

// asset tasks
gulp.task('build:assets', ["build:css"], function(){
	const css_task_info = get_file_paths("css");
	const file = fs.readFileSync(css_task_info.dist+"/screen.css", { encoding: 'utf8' });
	const re = /%%(.*?)%%/g;
	const patterns = [];
	// Build a list of glob patterns for each file in use
	while ((m = re.exec(file)) !== null) {
		const pattern = '**/' + m[1] + '.*';
		if (!patterns.includes(pattern)) {
			patterns.push(pattern)
		}
	}
	const task_info = get_file_paths("assets");
	return gulp.src(task_info.src)
	.pipe(filter(patterns))
	.pipe(gulp.dest(task_info.dist));
});

// css tasks
gulp.task('build:css', function(){
	const task_info = get_file_paths("css");
	return gulp.src(task_info.src)
		.pipe(plumber({errorHandler: errorAlert}))
		.pipe(postcss([stylelint], {syntax: syntax_scss}))
		.pipe(sass({
			outputStyle: 'expanded',
			noCache: true,
			includePaths: [
				"./node_modules",
				file_paths.src.modules
			]
		}))
		.pipe(postcss(post_process))
		.pipe(csso())
		.pipe(replace("../img/", "%%"))
		.pipe(replace(".jpg", "%%"))
		.pipe(replace(".png", "%%"))
		.pipe(replace("-webkit-box-align:center;", ""))
		.pipe(replace("-moz-box-align:center;", ""))
		.pipe(replace("-webkit-gradient(", "linear-gradient("))
		.pipe(clipboard())
		.pipe(gulp.dest(task_info.dist));
});

// html tasks
gulp.task('build:html', function(){
	const task_info = get_file_paths("html");
	return gulp.src(task_info.src)
		.pipe(plumber({errorHandler: errorAlert}))
		.pipe(fileinclude({prefix: '@', basepath: file_paths.src.modules}))
		.pipe(gulp.dest(task_info.dist));
});


// global functions
function errorAlert(error){
	notify.onError({title: 'Gulp Error', message: 'Check your terminal', sound: 'Sosumi'})(error);
	console.log(error.toString());
	this.emit('end');
};

// global tasks
gulp.task('build', ['build:html','build:css','build:assets']);

gulp.task('watch', ['build'], function() {
	gulp.watch(get_file_paths("html").watch, [ 'build:html' ]);
	gulp.watch(get_file_paths("css").watch, [ 'build:css' ]);
	gulp.watch(get_file_paths("assets").watch, [ 'build:assets' ]);
});

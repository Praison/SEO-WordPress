var SnippetPreview = require( "yoastseo" ).SnippetPreview;
var App = require( "yoastseo" ).App;
var PreviouslyUsedKeywords = require( "yoastseo" ).previouslyUsedKeywords;
//var TestPlugin = require( "./example-plugin-test.js" );

var forEach = require( "lodash/forEach" );
var escape = require( "lodash/escape" );

/**
 * Set the locale.
 *
 * @returns {void}
 */
var setLocale = function() {
	this.config.locale = document.getElementById( "locale" ).value;
	this.initializeAssessors( this.config );
	this.initAssessorPresenters();
	this.refresh();
};

/**
 * Binds the renewData function on the change of input elements.
 *
 * @param {YoastSEO.App} app The YoastSEO.js app.
 *
 * @returns {void}
 */
var bindEvents = function( app ) {
	var elems = [ "content", "focusKeyword", "locale" ];
	for ( var i = 0; i < elems.length; i++ ) {
		document.getElementById( elems[ i ] ).addEventListener( "input", app.refresh.bind( app ) );
	}
	document.getElementById( "locale" ).addEventListener( "input", setLocale.bind( app ) );
};

window.onload = function() {
	var snippetPreview = new SnippetPreview( {
		targetElement: document.getElementById( "snippet" ),
	} );

	var app = new App( {
		snippetPreview: snippetPreview,
		targets: {
			output: "output",
			contentOutput: "contentOutput",
		},
		callbacks: {
			getData: function() {
				return {
					baseUrl: "example.org/",
					snippetCite: document.getElementById("editable-post-name").innerHTML,
					title: document.getElementById("title").value,
					keyword: document.getElementById( "focusKeyword" ).value,
					meta: document.getElementById("zeo_description_id").value,
					text: tinymce.activeEditor.getContent(),
				};
			},
		},
		marker: function( paper, marks ) {
			var text = paper.getText();

			forEach( marks, function( mark ) {
				text = mark.applyWithReplace( text );
			} );

			document.getElementsByClassName( "marked-text" )[ 0 ].innerHTML = text;

			document.getElementsByClassName( "marked-text-raw" )[ 0 ].innerHTML = escape( text );

		},
	} );
	

	bindEvents( app );

	app.refresh();

	var args = {
		usedKeywords: { keyword: [ 1 ], test : [ 2, 3, 4 ] },
		postUrl: "http://example.com/post?id={id}",
		searchUrl: "http://example.com/search?kw={keyword}",
	};

	//var testPlugin = new TestPlugin( app, args, app.i18n );

	//testPlugin.addPlugin();

	/*var previouslyUsedKeywordsPlugin = new PreviouslyUsedKeywords(
		app, args, app.i18n
	);*/
	//previouslyUsedKeywordsPlugin.registerPlugin();

	var refreshAnalysis = document.getElementById( "refresh-analysis" );

	refreshAnalysis.addEventListener( "click", function() {
		app.getData();
		app.runAnalyzer();
	} );
};

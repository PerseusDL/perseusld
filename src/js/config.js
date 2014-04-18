require.config({
  shim: {
     'perseusld' : {
        deps: ['jquery','converter'],
        exports: 'PerseusLD'
     },
     'converter' : {
       exports: 'Markdown'
     },
     'sanitizer' : {
       deps: ['converter']
     }
  },
  paths: {
    jquery: "lib/jquery/jquery",
    converter: "lib/pagedown/Markdown.Converter",
    sanitizer: "lib/pagedown/Markdown.Sanitizer",
  }
});

require(['jquery','converter','sanitizer','app'],
function(jQuery,converter,app) {
});

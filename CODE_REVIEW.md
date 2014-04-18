# 2014-04-17 
(Responses inline prefaced with BMA:)
# Overview
I think it's best to decouple the UI from this widget.

    BMA: Ok, I agree. Was trying to make it so that UI wouldn't have to be implemented separately but you are probably right.

I think it's best to think of the widget as only data retrieval tool.
I added some event triggers.  

    BMA: I like the event triggers. We have a little more work to do to finish implementing them, especially with the filter_text_annotations formatter function:
      1. the formatter functions should not call the show_[type]_annotations method
      2. we either need to send annotation-type specific events, rather than just ready event, or the ready event should include data about the type of annotations that are ready to be shown (filter text has 'text','passage','work' which each would require a separate show call)

If you look at examples/sidecart.html you can see how I listen for events and then start-up different plug-ins designed specifically for display once the data is retrieved.
I think this decoupling is best.
It makes the widget more reusable IMO.

I added submodules for the sidecart plugin and its dependencies.
I'll be looking at grunt and figure out how to put it all together.

    BMA: ok yes I'd like a single consistent build approach

# Bugs / Improvements
## Code did not work out of the box.

I was getting this error... Seems like the url for the annotation is malformed.

	http://localhost/annotations/urn:cite:perseus:mythcomm.40.1/oac 404 (Not Found) jquery.js:8706

It was happening on this line.

	PerseusLD._show_annotations perseusld.js:323

I just restructured the tests/data/annotations directory rather than messing with the code.
I figured the tests were oddities and the code was meant to work with our production system.

    BMA: maybe I missed a step in the examples README. You needed to make the annotations available under your
    local apache server. I think I have a rewrite rule in mine that handles the /oac format extension. This is how
    I intend to deploy them (the annotations are actually already available in the production location but more on
    that later.

## dataType 'xml'...
This was a tricky bug to track down.
The xml being passed to the XSLT transform here.

	PerseusLD._add_annotation = function( a_processor, a_xml, a_elem, a_opts) {
		var html = a_processor.transformToDocument( a_xml );

a_xml in this case is a string and not an XML dom object.
This will cause the tranformToDocument( a_xml ) call to fail silently.

The fix was to pass 'xml' explicitly as the dataType to the jQuery.ajax() method.

		jQuery.ajax( 
			PerseusLD.results[a_type][i]+"/" + format,
			{
				type: 'GET',
				xhrFields: {data: {"last":last, "next":next, "type":a_type}},
				processData: false,
				dataType: 'xml'
			}
		)

## Moved examples/README.md to README.md
Documentation should really always be in the project root.

## Events?
Why not announce events?  Other tools might want to know when this widget changes.
This widget uses ajax calls which are asynchronous.
In order to get helper code to run at the proper time events are necessary.

## data-activator="#annotation_query_button"
I think it would be best not to have activation of the widget be tied only to a click of a DOM element.
We may want some other kind of UI or code event to trigger activation.
I think it's best to limit what this widget does.
I don't think it needs to be tightly coupled with a UI.
It probably is best to view the widget as a data retrieval system only.

    BMA: okay so we are moving these triggers to the sidecart plugin anyway now correct?

## Singleton?
You could make this class a singleton so you could call class methods with the this keyword.

	this.results.artifact.push( ... );

Instead of...

	PerseusLD.results.artifact.push(a_results[i].annotation.value);

Here's an example of a singleton in Javascript

	https://raw.githubusercontent.com/caesarfeta/jslib/master/src/js/SharedConfig.js

...

    BMA: agree a singleton is probably better here
    
## jQuery callbacks
Declaring functions within a jQuery callback is inevitable.  But long functions... like more than 2 lines... probably should be pulled out into a full-fledged class method and then called from within the callback.

## Tablet-proof your click events
Instead of... 

	jQuery(activator).click( function() { PerseusLD._show_annotations('artifact',a_elem,0);});

use ...

	jQuery(activator).on( 'touchstart click', function() { PerseusLD._show_annotations('artifact',a_elem,0);});

## Hiding  long text "Readmore"
I think it makes more sense to use a more generalized plugin for the "Readmore" feature.
So I've included it here and removed references to 'elided'.

    BMA: like this much better, thanks.

## Dollar signs
Writing 'jQuery' instead of '$' is kind of a drag, but we've been burned by conflicts with Prototype.js before.
Might be good to just do a find and replace before committing, 
making sure you don't inadvertantly change a dollar sign in a string literal.
I've been doing this with my latest jQuery plug-ins.

## Make dates more readable
I changed up the XSLT stylesheet to make dates show day of the week.
I was thinking instructors might want to have that handy without doing any mental calculations.
I know class assignment due dates are often thought in these terms.

    BMA: Okay. It's a shame that the browsers don't support XSLT 2.0 which has a format-date function.
    
## Make sosol username link more human readable
I think it's good practice to shorten anchor tag targets to just a nickname or handle and leave the full URL only in the href.  I switched up the XSLT stylesheet to do this.

# Formatting
I'm a zealot when it comes to code formatting.
So that's what the rest of my feedback will be about.

## Indentation
I use tabs for indentation.  I know for some people that's heresy and they prefer just spaces.

    BMA: I prefer 4 spaces -- tried to be consistent but maybe some tabs slipped in there. Sorry.
    
Whatever your preference is it's good to stick to one method.
You can't guarantee how another person sets up there text editor.
Some people set tabs to be equivalent to 4 spaces, 6 spaces and I've known sickos who do 2 spaces.
Inconsistency can make code look really messy if people have custom tab spacing.

## Comments
The standard I use for Javascript comments is JSDoc style for methods.

	/**
	 * Print out the hex representation of all the colors
	 *
	 * @param { string } _name The name of the palette.
	 */

I always put a space between method description and the argument documentation.
Putting the datatype of the parameter in braces is really useful.
Especially when you're passing along custom objects and not just simple scalars and arrays.

Inline comments I like to sandwich comments between lines of dashes.

	//------------------------------------------------------------
	//  Build the palette wrapper
	//------------------------------------------------------------

This helps to isolate comments when the code isn't syntax highlighted.
It also reminds me to keep my code less horizontal ( I don't want code to go beyond those dashes... it looks ugly to me ) and therefore more readable.  Aesthetics can be used as a force for good and not just Hitlerian evil ;)

Also comments explaining an "if" or similar statement should come right before the statement and not inside it.
I find this more readable...

	//------------------------------------------------------------
	//  we've come from a click on the more button 
	//  so remove it for now
	//------------------------------------------------------------
	else {
		jQuery(".perseusld_results.perseusld_"+a_type+" .more_annotations",a_elem).hide();
	}

than this...

	else {
		//------------------------------------------------------------
		//  we've come from a click on the more button 
		//  so remove it for now
		//------------------------------------------------------------
		jQuery(".perseusld_results.perseusld_"+a_type+" .more_annotations",a_elem).hide();
	}

## "} else if {" or just "else if {"
There's inconsistency with your else and else if statements. 

	else if (target.match(new RegExp(text_uri_regex)) != null) {
	    // the annotation is for the text as a whole
	    annotations.text.push(a_results[i].annotation.value);
	} else if (version_passage_start != null) {

## Multiline strings
I write multiline strings like this.

		var query = "\
			SELECT distinct ?annotation ?target ?who "+ dataset_query + "\
	    	WHERE { ?annotation "  + "<"  + verb + "> ?target.\
				FILTER regex( str(?target), \"" + sbj + "\").\
				?annotation <http://www.w3.org/ns/oa#annotatedBy> ?who\
			}\
		";

I treat quotes in multiline strings like braces in functions.
Our programmer eyes are trained to see this as one block like a short function declaration.

	function() {
		return "SELECT distinct ?annotation ?target ?who "+ dataset_query + "\
    	WHERE { ?annotation "  + "<"  + verb + "> ?target.\
			FILTER regex( str(?target), \"" + sbj + "\").\
			?annotation <http://www.w3.org/ns/oa#annotatedBy> ?who\
		}"
	}

Why not take advantage of that?

Also passing multiline strings as function arguments directly is visually messy.
It may seem wasteful to declare a variable just so you can pass it to a function, but it's much more readable.
Let Javascript garbage collection do its thing... until it doesn't.

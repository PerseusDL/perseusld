# Formatting
I'm a zealout when it comes to code formatting.
What you are about to read may sound petty, and it is ;)

## Indentation
I use tabs for indentation.  I know for some people that's heresy and they prefer just spaces.
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
It also reminds me to keep my code less horizontal ( I don't want code to go beyond those dashes... it looks ugly to me ) and therefore more readable.

Also comments explaining an "if" or similar statement should come right before the statement and not inside it.
I may be alone in this but I find this more readable...

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

# Dollar signs
Writing 'jQuery' instead of '$' is kind of a drag, but we've been burned by conflicts with Prototype.js before.
Might be good to just do a find and replace before committing, 
making sure you don't inadvertantly change a dollar sign in a string literal.
I've been doing this with my latest jQuery plug-ins.

# Multiline strings
I write multiline strings like this.

		var query = "\
			SELECT distinct ?annotation ?target ?who "+ dataset_query + "\
	    	WHERE { ?annotation "  + "<"  + verb + "> ?target.\
				FILTER regex( str(?target), \"" + sbj + "\").\
				?annotation <http://www.w3.org/ns/oa#annotatedBy> ?who\
			}\
		";

I treat quotes in multiline strings like braces in functions.
Our programmer eyes are trained to see this as one block.

	function() {
		"SELECT distinct ?annotation ?target ?who "+ dataset_query + "\
    	WHERE { ?annotation "  + "<"  + verb + "> ?target.\
			FILTER regex( str(?target), \"" + sbj + "\").\
			?annotation <http://www.w3.org/ns/oa#annotatedBy> ?who\
		}"
	}

Why not take advantage of that?

Also passing multiline strings as function arguments directly is visually messy.
It may seem wasteful to declare a variable just so you can pass it to a function, but it's much more readable.
Let Javascript garbage collection do its thing... until it doesn't.

# Singleton?
You could make this class a singleton so you could call class methods with the this keyword.

	this.results.artifact.push( ... );

Instead of...

	PerseusLD.results.artifact.push(a_results[i].annotation.value);

Here's an example of a singleton in Javascript

	https://raw.githubusercontent.com/caesarfeta/jslib/master/src/js/SharedConfig.js

# jQuery callbacks
Declaring functions within a jQuery callback is inevitable.  But long functions... like more than 2 lines... should be pulled out into its own class method and then called from within the callback.



# Tablet-proof your click events
Instead of... 

	jQuery(activator).click( function() { PerseusLD._show_annotations('artifact',a_elem,0);});

use ...

	jQuery(activator).on( 'touchstart click', function() { PerseusLD._show_annotations('artifact',a_elem,0);});

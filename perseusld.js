(function(c){function g(b,a){this.element=b;this.options=c.extend({},h,a);c(this.element).data("max-height",this.options.maxHeight);c(this.element).data("height-margin",this.options.heightMargin);delete this.options.maxHeight;if(this.options.embedCSS&&!k){var d=".readmore-js-toggle, .readmore-js-section { "+this.options.sectionCSS+" } .readmore-js-section { overflow: hidden; }",e=document.createElement("style");e.type="text/css";e.styleSheet?e.styleSheet.cssText=d:e.appendChild(document.createTextNode(d));
document.getElementsByTagName("head")[0].appendChild(e);k=!0}this._defaults=h;this._name=f;this.init()}var f="readmore",h={speed:100,maxHeight:200,heightMargin:16,moreLink:'<a href="#">Read More</a>',lessLink:'<a href="#">Close</a>',embedCSS:!0,sectionCSS:"display: block; width: 100%;",startOpen:!1,expandedClass:"readmore-js-expanded",collapsedClass:"readmore-js-collapsed",beforeToggle:function(){},afterToggle:function(){}},k=!1;g.prototype={init:function(){var b=this;c(this.element).each(function(){var a=
c(this),d=a.css("max-height").replace(/[^-\d\.]/g,"")>a.data("max-height")?a.css("max-height").replace(/[^-\d\.]/g,""):a.data("max-height"),e=a.data("height-margin");"none"!=a.css("max-height")&&a.css("max-height","none");b.setBoxHeight(a);if(a.outerHeight(!0)<=d+e)return!0;a.addClass("readmore-js-section "+b.options.collapsedClass).data("collapsedHeight",d);a.after(c(b.options.startOpen?b.options.lessLink:b.options.moreLink).on("click",function(c){b.toggleSlider(this,a,c)}).addClass("readmore-js-toggle"));
b.options.startOpen||a.css({height:d})});c(window).on("resize",function(a){b.resizeBoxes()})},toggleSlider:function(b,a,d){d.preventDefault();var e=this;d=newLink=sectionClass="";var f=!1;d=c(a).data("collapsedHeight");c(a).height()<=d?(d=c(a).data("expandedHeight")+"px",newLink="lessLink",f=!0,sectionClass=e.options.expandedClass):(newLink="moreLink",sectionClass=e.options.collapsedClass);e.options.beforeToggle(b,a,f);c(a).animate({height:d},{duration:e.options.speed,complete:function(){e.options.afterToggle(b,
a,f);c(b).replaceWith(c(e.options[newLink]).on("click",function(b){e.toggleSlider(this,a,b)}).addClass("readmore-js-toggle"));c(this).removeClass(e.options.collapsedClass+" "+e.options.expandedClass).addClass(sectionClass)}})},setBoxHeight:function(b){var a=b.clone().css({height:"auto",width:b.width(),overflow:"hidden"}).insertAfter(b),c=a.outerHeight(!0);a.remove();b.data("expandedHeight",c)},resizeBoxes:function(){var b=this;c(".readmore-js-section").each(function(){var a=c(this);b.setBoxHeight(a);
(a.height()>a.data("expandedHeight")||a.hasClass(b.options.expandedClass)&&a.height()<a.data("expandedHeight"))&&a.css("height",a.data("expandedHeight"))})},destroy:function(){var b=this;c(this.element).each(function(){var a=c(this);a.removeClass("readmore-js-section "+b.options.collapsedClass+" "+b.options.expandedClass).css({"max-height":"",height:"auto"}).next(".readmore-js-toggle").remove();a.removeData()})}};c.fn[f]=function(b){var a=arguments;if(void 0===b||"object"===typeof b)return this.each(function(){if(c.data(this,
"plugin_"+f)){var a=c.data(this,"plugin_"+f);a.destroy.apply(a)}c.data(this,"plugin_"+f,new g(this,b))});if("string"===typeof b&&"_"!==b[0]&&"init"!==b)return this.each(function(){var d=c.data(this,"plugin_"+f);d instanceof g&&"function"===typeof d[b]&&d[b].apply(d,Array.prototype.slice.call(a,1))})}})(jQuery);

/**
 * Remove newlines and tabs
 */
String.prototype.smoosh = function() {
	return this.replace(/(\r\n+|\n+|\r+|\t+)/gm,'');
}

/**
 * Splice in a string at a specified index
 *
 * @param { string } _string
 * @param { int } _index The position in the string
 */
String.prototype.splice = function( _string, _index ) {
    return ( this.slice( 0, Math.abs( _index ) ) + _string + this.slice( Math.abs( _index )));
};

/**
 * Strip html tags
 */
String.prototype.stripTags = function() {
	return this.replace(/<\/?[^>]+(>|$)/g, '' );
}

/**
 * Remove extra spaces
 */
String.prototype.oneSpace = function() {
	return this.replace(/\s{2,}/g, ' ');
}

/**
 * Alpha-numeric and spaces only
 */
String.prototype.alphaSpaceOnly = function() {
	return this.replace(/[^\w\s]/gi, '');
}

/**
 * Alpha-numeric characters only
 */
String.prototype.alphaOnly = function() {
	return this.replace(/[^\w]/gi, '');
}

/**
 * Capitalize the first letter of a string
 */
String.prototype.capitalize = function() {
	return this.charAt(0).toUpperCase() + this.slice(1);
}

/**
 * Repeat a string n times
 *
 * @param {string} _n How many times you want to repeat a string
 */
String.prototype.repeat = function( _n ) {
	return new Array( _n + 1 ).join( this );
}

/**
 * Count the occurences of a string in a larger string
 *
 * @parm {string} _sub : The search string
 * @param {boolean} _overlap : Optional. Default: false
 * @return {int} : The count
 */
String.prototype.occurs = function( _search, _overlap ) {
	var string = this;
	//------------------------------------------------------------
	//  If _search is null just return a char count
	//------------------------------------------------------------
	if ( _search == undefined ) {
		return string.length;
	}
	//------------------------------------------------------------
	//  Make sure _search is a string
	//------------------------------------------------------------
	_search+="";
	//------------------------------------------------------------
	//  If no search term is past just return a character count
	//------------------------------------------------------------
	if ( _search.length <= 0 ) {
		return string.length;
	}
	//------------------------------------------------------------
	//  Otherwise start counting.
	//------------------------------------------------------------
	var n=0;
	var pos=0;
	var step = ( _overlap ) ? 1 : _search.length;
	while ( true ) {
		pos = string.indexOf( _search, pos );
		if ( pos >= 0 ) {
			n++;
			pos += step;
		}
		else {
			break;
		}
	}
	return n;
}

/**
 * Find the positions of occurences of a substring
 *
 * @parm {string} _sub : The search string
 * @param {boolean} _overlap : Optional. Default--false.
 * @param {boolean} _ignoreXML : Optional. Check to see if string is inside XML/HTML element.
 * @param {boolean} _onlyWords : Optional. Make sure string is a discrete word.
 * @return {Array} : An array of integers.
 */
String.prototype.positions = function( _search, _overlap, _ignoreXML, _onlyWords ) {
//	console.log( '----------' );
//	console.log( _search );
	var string = this;
	//------------------------------------------------------------
	//  Make sure _search is a string
	//------------------------------------------------------------
	_search+="";
	//------------------------------------------------------------
	//  Otherwise start counting.
	//------------------------------------------------------------
	var pos=0;
	//------------------------------------------------------------
	//  String overlapping allowed?
	//------------------------------------------------------------
	var step = ( _overlap ) ? 1 : _search.length;
	var p = [];
	while ( true ) {
		var ok = true;
		pos = string.indexOf( _search, pos );
		if ( pos >= 0 ) {
			//------------------------------------------------------------
			//  Ignore if search string was found within an XML/HTML tag
			//------------------------------------------------------------
			if ( _ignoreXML == true ) {
				for ( var i=pos; i<string.length; i++ ) {
					if ( string[i] == '<' ) {
						break;
					}
					if ( string[i] == '>' ) {
						ok = false;
					}
				}
			}
			//------------------------------------------------------------
			//  Check to see if search string is an isolated word
			//------------------------------------------------------------
			if ( _onlyWords == true ) {
//				console.log( string.substr((pos-1),(pos+_search.length+1)) );
//				console.log( string.substr((pos-1),(pos+_search.length+1)).isAlphaNum() );
				if ( string.substr((pos-1),(pos+_search.length+1)).isAlphaNum() == true ) {
					ok = false;
				}
			}
			//------------------------------------------------------------
			//  If everything is good
			//------------------------------------------------------------
			if ( ok == true ) {
				p.push( pos );
			}
			pos += step;
		}
		else {
			break;
		}
	}
	return p;
}

/*
 * Insert a substring at a particular index
 *
 * @return { string } The modified string
 */
String.prototype.insertAt = function( _index, _string ) {
	return this.substr( 0, _index) + _string + this.substr( _index );
}

/*
 * Turn a string with HTTP GET style parameters to an object
 *
 * @return { obj } A collection of keys and values
 */
String.prototype.params = function() {
	var arr = this.split('?');
	var get = arr[1];
	arr = get.split('&');
	var out = {};
	for ( var i=0, ii=arr.length; i<ii; i++ ) {
		if ( arr[i] != undefined ) {
			var pair = arr[i].split('=');
			out[ pair[0] ] = pair[1];
		}
	}
	return out;
}

/*
 * Check for the existence of an upper-case letter
 *
 * @return { boolean }
 */
String.prototype.hasUpper = function() {
	return /[A-Z]/.test( this );
}

/*
 * Create a word frequency report object
 *
 * @return { obj } Report object
 */
String.prototype.report = function() {
	var words = this.toLowerCase().split(' ');
	var stats = {};
	for ( var i=0, ii=words.length; i<ii; i++ ) {
		var word = words[i];
		if ( ! ( word in stats ) ) {
			stats[word] = 1;
		}
		else {
			stats[word] += 1;
		}
	}
	return stats;
}

/*
 * Divide text into an array of lines by splitting on linebreaks
 *
 * @return { array } An array of lines
 */
String.prototype.lines = function() {
	return this.split("\n");
}

/*
 * Check to see if string is composed of only alphanumeric characters
 *
 * @return { boolean }
 */
String.prototype.isAlphaNum = function() {
	if ( /[^a-zA-Z0-9]/.test( this ) ) {
		return false;
	}
	return true;
}

/*
 * Divide text into an array of individual sentences
 * This is English-centric.  Forgive me.
 *
 * @return { array } An array of sentences
 */
String.prototype.sentences = function() {
	var check = this.match( /[^\.!\?]+[\.!\?]+/g );
	
	//------------------------------------------------------------
	//  Make sure characters aren't used for purposes other than
	//  sentences.
	//------------------------------------------------------------
	var vowels = [ 'a','e','i','o','u','y' ];
	var out = [];
	var carry = '';
	for ( var i=0; i<check.length; i++ ) {
		//------------------------------------------------------------
		//  Clean up.
		//------------------------------------------------------------
		var strCheck = carry + check[i];
		carry = '';
		//------------------------------------------------------------
		//  Check for the existence of a vowel, so we aren't
		//  accidentally thinking part of an abbreviation is its
		//  own sentence.
		//------------------------------------------------------------
		var merge = true;
		for ( var j=0; j<vowels.length; j++ ) {
			if ( strCheck.indexOf( vowels[j] ) != -1 ) {
				merge = false;
				break;
			}
		}
		//------------------------------------------------------------
		//  Also check for a capital letter on the first word.  
		//  Most sentences have those too.
		//------------------------------------------------------------
		var capTest = strCheck.trim();
		if ( ! capTest[0].hasUpper() ) {
			merge = true;
		}
		//------------------------------------------------------------
		//  If no vowel exists in the sentence you're probably
		//  dealing with an abbreviation.  Merge with last sentence.  
		//------------------------------------------------------------
		if ( merge ) {
			if ( out.length > 0 ) {
				out[ out.length-1 ] += strCheck;
			}
			else {
				carry = strCheck;
			}
			continue;
		}
		
		//------------------------------------------------------------
		//  Prepare output.
		//------------------------------------------------------------
		out.push( strCheck.smoosh().trim() );
	}
	return out;
}
/**
 * Add/Change CSS with Javascript,
 * working at the class/selector level instead of the tag level.
 */
function Styler() {
	this.head = document.getElementsByTagName('head')[0];
	this.style = document.createElement('style');
	this.style.type = 'text/css';
	this.head.appendChild( this.style );
}

/**
 * Add CSS declarations
 * @param { obj } _rules An object of selector:style pairs.
 */
Styler.prototype.add = function( _rules ) {
	for ( var selector in _rules ) {
		var dec = document.createTextNode( selector+' { '+_rules[ selector ]+' }' );
		if ( this.style.styleSheet ) {
			style.styleSheet.cssText = dec.nodeValue;
		}
		else {
			this.style.appendChild( dec );
		}
	}
}
/**
 * Extend jQuery
 */
jQuery.fn.cursorToEnd = function() {
	return this.each( function() {
		jQuery( this ).focus();
		
		//------------------------------------------------------------
		//   If this function exists...
		//------------------------------------------------------------
		if ( this.setSelectionRange ) {
			//------------------------------------------------------------
			// ... then use it ( Doesn't work in IE )
			// Double the length because Opera is inconsistent 
			// about whether a carriage return is one character or two.
			//------------------------------------------------------------
			var len = jQuery( this ).val().length * 2;
			this.setSelectionRange( len, len );
		} 
		else {
			//------------------------------------------------------------
			// ... otherwise replace the contents with itself
			// ( Doesn't work in Google Chrome )
			//------------------------------------------------------------
			jQuery( this ).val( jQuery( this ).val() );
		}
		//------------------------------------------------------------
		// Scroll to the bottom, in case we're in a tall textarea
		// ( Necessary for Firefox and Google Chrome )
		//------------------------------------------------------------
		this.scrollTop = 999999;
	});
};

/**
 *  Get an element's html
 */
jQuery.fn.myHtml = function() {
	return jQuery( this ).clone().wrap( '<div>' ).parent().html();
}

/**
 *  Get transition time in milliseconds
 *
 *  @return { Number } Time in milliseconds
 */
jQuery.fn.transLength = function() {
	var trans = jQuery( this ).css( 'transition' );
	var res = trans.match( / [\d|\.]+s/g );
	var sec = Number( res[0].replace( 's','' ) );
	return sec*1000;
}
/*!
 * sidecart - sidecart
 * http://adamtavares.com
 * 
 * Permission is hereby granted, free of charge, to any person obtaining
 * a copy of this software and associated documentation files (the
 * "Software"), to deal in the Software without restriction, including
 * without limitation the rights to use, copy, modify, merge, publish,
 * distribute, sublicense, and/or sell copies of the Software, and to
 * permit persons to whom the Software is furnished to do so, subject to
 * the following conditions:
 * 
 * The above copyright notice and this permission notice shall be
 * included in all copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
 * MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 * NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
 * LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
 * OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
 * WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */
;( function( jQuery ) {
    
    /**
     * Holds default options, adds user defined options, and initializes the plugin
     *
     * @param { obj } _elem The DOM element where the plugin will be drawn
     * @param { obj } _config Key value pairs to hold the plugin's configuration
     * @param { string } _id The id of the DOM element
     */
    function sidecart( _elem, _config, _id ) {
        var self = this;
        self.elem = _elem;
        self.id = _id;
        self.init( _elem, _config );
    }
    
    /**
     * Holds default options, adds user defined options, and initializes the plugin
     *
     * @param { obj } _elem The DOM element where the plugin will be drawn
     * @param { obj } _config Key value pairs to hold the plugin's configuration
     */
    sidecart.prototype.init = function( _elem, _config ) {
        var self = this;
        //------------------------------------------------------------
        //  Mark your territory
        //------------------------------------------------------------
        jQuery( self.elem ).addClass('sidecart')
        //------------------------------------------------------------
        //  User options 
        //------------------------------------------------------------
        self.config = jQuery.extend({
            side: 'right',
            inside: false,
            'bottom-space': 40,
            theme: null,
            'tab-pad': 2,
            'anim-length': .25
        }, _config );
        //------------------------------------------------------------
        //  Get a styler object handy
        //------------------------------------------------------------
        self.styler = new Styler();
        //------------------------------------------------------------
        //  Start me up!
        //------------------------------------------------------------
        self.start();
    }
    
    /**
     * Start up sidecart.
     */
    sidecart.prototype.start = function() {
        this.theme();
        this.buildWrapper();
        this.buildViews();
        this.resize();
        this.hide();
    }
    
    /**
     *  Apply sidecart theme.
     */
    sidecart.prototype.theme = function() {
        if ( this.config['theme'] != null ) {
            jQuery( this.elem ).addClass( this.config['theme'] );
        }
    }
    
    /**
     * Build the application wrapper.
     */
    sidecart.prototype.buildWrapper = function() {
        //------------------------------------------------------------
        //  Hide initially
        //------------------------------------------------------------
        jQuery( this.elem ).addClass('hidden');
        //------------------------------------------------------------
        //  Left side
        //------------------------------------------------------------
        switch ( this.config['side'] ) {
            case 'left':
                this.buildTabsLast();
                jQuery( this.elem ).addClass('left');
                break;
            case 'top':
                this.buildTabsLast();
                jQuery( this.elem ).addClass('top');
                break;
            default: // right side
                this.buildTabsFirst();
        }
        //------------------------------------------------------------
        //  Inside parent?
        //------------------------------------------------------------
        this.fitToParent();
    }
    
    /**
     * Fit sidecart inside parent.
     */
    sidecart.prototype.fitToParent = function() {
        if ( this.config['inside'] == true ) {
            var parent = jQuery( this.elem ).parent();
            var position = parent.position();
            jQuery( this.elem ).css({ left: position.left });
            if ( this.config['side'] == 'top' ) {
                jQuery( this.elem ).width( parent.outerWidth() );
                var height = parent.height()-jQuery( '.tabs', this.elem ).height()-this.config['bottom-space'];
                var style = {};
                style[this.id+' .inner'] = 'height:'+height+'px';
                style[this.id+'.hidden .inner'] = 'height:0';
                this.styler.add( style );
            }
        }
    }
    
    /**
     * Build with tab after inner.
     */
    sidecart.prototype.buildTabsLast = function() {
        jQuery( this.elem ).append( '\
            <div class="wrapper">\
                <div class="inner">\
                    <div class="views"></div>\
                </div>\
            </div>\
            <div class="tabs"></div>\
        ');
    }
    
    /**
     * Build with tab before inner.
     */
    sidecart.prototype.buildTabsFirst = function() {
        jQuery( this.elem ).append( '\
            <div class="tabs"></div>\
            <div class="wrapper">\
                <div class="inner">\
                    <div class="views"></div>\
                </div>\
            </div>\
        ');
    }
    
    /**
     * Build all of the views.
     */
    sidecart.prototype.buildViews = function() {
        //------------------------------------------------------------
        //  No views?  Get outta there.
        //------------------------------------------------------------
        if ( this.config['views'] == undefined ) {
            return;
        }
        //------------------------------------------------------------
        //  Build each view.
        //------------------------------------------------------------
        for ( var i=0, ii=this.config['views'].length; i<ii; i++ ) {
            var view = this.config['views'][i];
            this.buildView( view );
        }
    }
    
    /**
     * Add a view.
     */
    sidecart.prototype.addView = function( _view ) {
        if ( this.config['views'] == undefined ) {
            this.config['views'] = [];
        }
        this.config['views'].push( _view );
        this.buildView( _view );
    }
    
    /**
     * Build a single view.
     *
     * @param { Object } _view      A single view config object.
     *                              See constructor.
     */
    sidecart.prototype.buildView = function( _view ) {
        //------------------------------------------------------------
        //  Build the view
        //------------------------------------------------------------
        jQuery( '.views', this.elem ).append('\
            <div id="'+ _view.id +'" class="'+ _view.type +'"></div>\
        ');
        //------------------------------------------------------------
        //  Already in the dom?
        //------------------------------------------------------------
        if ( _view.src != undefined && _view.src != '' ) {
            var src = jQuery( _view.src );
            //------------------------------------------------------------
            //  Move the source html
            //------------------------------------------------------------
            src.detach().appendTo( '#'+_view.id );
        }
        //------------------------------------------------------------
        //  Passed as a text string?
        //------------------------------------------------------------
        else if ( _view.text != undefined ) {
            jQuery( '#'+_view.id ).append( _view.text );
        }
        //------------------------------------------------------------
        //  Build the link
        //------------------------------------------------------------
        var link = '<a href="#'+ _view.id +'">'+ _view.link +'</a>';
        jQuery( '.tabs', this.elem ).append( link );
        //------------------------------------------------------------
        //  Run view init function
        //------------------------------------------------------------
        if ( _view['init'] != undefined ) {
            _view['init']( this );
        }
        //------------------------------------------------------------
        //  View events
        //------------------------------------------------------------
        this.viewEvents( _view );
        this.showView( _view.id );
        this.hide();
    }
    
    /**
     * Start event listeners.
     * @param { _obj } _view A view configuration object;
     */
    sidecart.prototype.viewEvents = function( _view ) {
        this.tabClick( _view );
    }
    
    /**
     * Start window resize listener.
     */
    sidecart.prototype.resize = function() {
        var self = this;
        jQuery( window ).resize( function() {
            self.fitToParent();
        })
    }
    
    /**
     * Click a tab and things happen.
     */
    sidecart.prototype.tabClick = function( _view ) {
        var self = this;
        jQuery( '.tabs a[href="#'+_view.id+'"]', self.elem ).on( 'touchstart click', function( _e ) {
            _e.preventDefault();
            var id = jQuery( this ).attr('href').replace('#','');
            self.showView( id );
        });
    }
    
    /**
     * Slide cart in and out.
     */
    sidecart.prototype.slide = function() {
        if ( this.hidden() ) {
            this.show();
        }
        else {
            this.hide();
        }
    }
    
    /**
     * Check if sidecart is hidden.
     */
    sidecart.prototype.hidden = function() {
        return jQuery( this.elem ).hasClass('hidden');
    }
    
    /**
     * Show the cart.
     */
    sidecart.prototype.show = function() {
        jQuery( this.elem ).removeClass('hidden');
        jQuery( this.elem ).removeClass('wayback');
    }
    
    /**
     * Hide the cart.
     */
    sidecart.prototype.hide = function() {
        var self = this;
        jQuery( self.elem ).addClass('hidden');
        setTimeout( function(){
            jQuery( self.elem ).addClass('wayback');
        }, self.config['anim-length']*1000 );
    }
    
    /**
     * Hide all the views.
     */
    sidecart.prototype.hideViews = function() {
        jQuery( '.views ', this.elem ).children().hide();
    }
    
    /**
     * Show a specific view and hide the others.
     *
     * @param { string } _id The id of the view.
     */
    sidecart.prototype.showView = function( _id ) {
        if ( _id !== this.last_tab ) {
            this.last_tab = _id;
            this.hideViews();
            jQuery( '#'+_id, this.elem ).show();
            jQuery( '.tabs a', this.elem ).removeClass('selected');
            jQuery( '.tabs a[href="#'+_id+'"]', this.elem ).addClass('selected');
            if ( this.hidden() ) {
                this.slide();
            }
        }
        else {
            this.slide();
        }
        //------------------------------------------------------------
        //  Run view refresh callback
        //------------------------------------------------------------
        this.refreshView( _id );
    }
    
    /**
     * Show a specific view and hide the others.
     *
     * @param { string } _id The id of the view.
     */
    sidecart.prototype.refreshView = function( _viewName ) {
        for ( var i=0, ii=this.config['views'].length; i<ii; i++ ) {
            var view = this.config['views'][i];
            if ( view.id == _viewName && view.refresh != undefined ) {
                view.refresh( this );
            }
        }
    }
    
    /**
     * Show the first tab. 
     */
    sidecart.prototype.showFirst = function() {
        var self = this;
        var first = this.config['views'][0];
        this.showView( first.id );
    }
    
    //----------------
    //  Extend JQuery 
    //----------------
    jQuery( document ).ready( function( jQuery ) {
        jQuery.fn.sidecart = function( _config ) {
            var id = jQuery( this ).selector;
            return this.each( function() {
                jQuery.data( this, id, new sidecart( this, _config, id ) );
            });
        };
    })
})( jQuery );
;( function( jQuery ) {

    /**
     * Holds default options, adds user defined options, and initializes the plugin
     *
     * @param { obj } _elem The DOM element where the plugin will be drawn
     * @param { obj } _config Key value pairs to hold the plugin's configuration
     * @param { string } _id The id of the DOM element
     */
    function PerseusLD( _elem, _config, _id ) {
        var self = this;
        self.elem = _elem;
        self.id = _id;
        self.init( _elem, _config );
    }

    /**
     * Holds default options, adds user defined options, and initializes the plugin
     *
     * @param { obj } _elem The DOM element where the plugin will be drawn
     * @param { obj } _config Key value pairs to hold the plugin's configuration
     */
    PerseusLD.prototype.init = function( _elem, _config ) {
        var self = this;
        //------------------------------------------------------------
        //  User options 
        //------------------------------------------------------------
        self.config = jQuery.extend({}, _config );
        //------------------------------------------------------------
        //  Results
        //------------------------------------------------------------
        self.results = { 
            passage: [], 
            text: [], 
            work: [], 
            artifact: [] 
        };
        //------------------------------------------------------------
        //  Events
        //------------------------------------------------------------
        self.events = { loaded: 'PerseusLD--LOADED' };
        //------------------------------------------------------------
        //  Go Go Go!
        //------------------------------------------------------------
        self.userConfig();
        self.query_md_annotations();
    }
    
    /**
     * Retrieve user configuration from the DOM
     */
    PerseusLD.prototype.userConfig = function() {
        var self = this;
        //------------------------------------------------------------
        //  XSLT transform and data
        //------------------------------------------------------------
        self.xslt_url = jQuery( self.elem ).attr("data-lib_root") + "/xslt/oactohtml.xsl";
        self.xslt_processor = null;
        self.sbj_elemname = jQuery( jQuery( self.elem ).attr("data-sbj") );
        self.verb = jQuery( self.elem ).attr("data-verb");
        self.dataset = jQuery( self.elem ).attr("data-set");
        self.formatter = jQuery( self.elem ).attr("data-formatter");
        self.datatype = jQuery( self.elem ).attr("data-class");
        //------------------------------------------------------------
        //  Other goodies
        //------------------------------------------------------------
        self.format = jQuery( self.elem ).attr("data-serialization");
        self.max_results = jQuery( self.elem ).attr("data-pagemax");
        //------------------------------------------------------------
        //  Find the type of subject
        //------------------------------------------------------------
        self.sbj_elem = jQuery( "*[typeof='http://lawd.info/ontology/Citation']", self.sbj_elemname );
        if ( self.sbj_elem.length != 0 ) {
            //----------------------------------------------------------
            //  it's a text resource so query on the conceptual work and
            //  Remove the uri prefix - just the URN to keep it simple
            //----------------------------------------------------------
            self.sbj = self._strip_uri_prefix(jQuery( "*[typeof='http://lawd.info/ontology/ConceptualWork']", self.sbj_elem ).attr("resource")); 
        }
        else {
            self.sbj_elem = jQuery("*[typeof='http://www.cidoc-crm.org/cidoc-crm/E22_Man-Made_Object']", self.sbj_elemname );
        }
        if ( self.sbj_elem.length == 0 ) {
            self.sbj_elem = jQuery("*[typeof='http://www.cidoc-crm.org/cidoc-crm/E53_Place']", self.sbj_elemname );
        }
        if ( self.sbj_elem.length == 0) {
            return;
        }
        //------------------------------------------------------------
        // assign the subject if we haven't already - we will have if
        // if it's a text resource
        //------------------------------------------------------------
        if ( !self.sbj ) {
            self.sbj = self.sbj_elem.attr("resource");   
        }
        self.queryuri = jQuery( self.elem ).attr("data-endpoint");

       
        //------------------------------------------------------------
        //  Need to use quote meta to escape the uri because it
        //  could contain regex protected chars like + 
        //------------------------------------------------------------ 
        self.sbj = "\\\\Q" + self.sbj + "\\\\E";    
    }
    
    /**
     * Show an error
     */
    PerseusLD.prototype.showError = function() {
        if ( window.console ) { 
            console.log( "Error retrieving annotations" );
        }
    }
    
    /**
     * Retrieve the annotations
     */
    PerseusLD.prototype.query_md_annotations = function() {
        var self = this;  
        var dataset_query = "";
        if ( self.dataset ) {
            dataset_query = "FROM <" + self.dataset + "> "
        }
        //------------------------------------------------------------
        // Retrieve all annotations from the requested set for this work
        // TODO eventually we will want to separate this out by annotation/collection type 
        // TODO sort by ?date
        //------------------------------------------------------------
        if ( self.queryuri && self.sbj && self.verb ) {
            //------------------------------------------------------------
            //  The SPARQL annotation query
            //------------------------------------------------------------
            var query = "\
                SELECT distinct ?annotation ?target ?who \
                "+ dataset_query + "\
                WHERE { ?annotation "  + "<"  + self.verb + "> ?target.\
                    FILTER regex( str(?target), \"" + self.sbj + "\").\
                    ?annotation <http://www.w3.org/ns/oa#annotatedBy> ?who\
                }\
            ";
            //------------------------------------------------------------
            //  Issue the query and get the results
            //------------------------------------------------------------
            var query = self.queryuri + encodeURIComponent( query.smoosh().oneSpace() ) + "&format=json";
            jQuery.get( query )
            .done( function( _data ) {
                self.sparql_results( _data );
            })
            .fail( function() {
                self.showError();
            });
        }
    }
    
    /**
     * Retrieve SPARQL query results and format them
     *
     * @param {obj} _data jQuery.get().done response object
     */
    PerseusLD.prototype.sparql_results = function( _data ) {
        var self = this;
        var results = [];
        if ( _data.results.bindings.length > 0) {
            jQuery.each( _data.results.bindings, function( _i, _row ) {
                results.push( _row );
            });
        }
        self[ self.formatter ]( results );
    }
    
    /**
     * Helper method to strip the uri prefix from a CTS URN enabled URI
     *
     * @param a_str the uri string
     * @returns the string with the uri prefix (everything up to urn:cts...) stripped
     *          if the uri doesn't contain a cts urn then it just returns the original string
     */
    PerseusLD.prototype._strip_uri_prefix = function( _str ) {
        var stripped = _str;
        var match = _str.match("^https?://.*?/(urn:cts:.*)$");
        if ( match != null ) {
            stripped = match[1];
        }
        return stripped;
    }
    
    PerseusLD.prototype.show = function() {
        var self = this;
        jQuery( self.elem ).show();
    }
    
    /**
     * Helper method called by filter_text_annotations and filter_artifact_annotations
     * to append results to the page. Results traversed from the PerseusLD.results object.
     * 
     * @param a_type the type of result target (i.e. 'artifact', 'text','work','passage')
     * @param a_start the starting index of the result
     */
    PerseusLD.prototype._show_annotations = function( _type, _start ) {
        var self = this;
        //------------------------------------------------------------
        //  if we haven't been given a paging max, show all the results
        //------------------------------------------------------------
        if ( ! self.max_results || self.max_results == '' ) {
            self.max_results = self.results[ _type ].length;
        }
        //------------------------------------------------------------
        // make sure we don't have any old results loaded
        //------------------------------------------------------------
        if ( _start == 0 ) {
            jQuery( ".perseusld_results.perseusld_"+_type, self.elem ).children().remove();
        } 
        else {
            //------------------------------------------------------------
            //  we've come from a click on the more button so remove it for now
            //------------------------------------------------------------
            jQuery( ".perseusld_results.perseusld_"+_type+" .more_annotations", self.elem ).hide();
        }
        jQuery( ".perseusld_results.perseusld_"+_type, self.elem ).addClass( "loading" );
        var end = _start + self.max_results-1;
        if ( end > self.results[_type].length-1 ) {
            end = self.results[_type].length-1;
        }
        for ( var i=_start; i<=end; i++ ) {
            //------------------------------------------------------------
            //  flags to indicate if on last and if there are any more to show
            //------------------------------------------------------------
            var next = null;
            var last = ( i == end );
            if ( last && end < self.results[_type].length-1 ) {
                next = end + 1;        
            }
            //------------------------------------------------------------
            //  Send the request
            //------------------------------------------------------------
            jQuery.ajax( 
                self.results[_type][i]+"/" + self.format,
                {
                    type: 'GET',
                    xhrFields: { data: { "last":last, "next":next, "type":_type } },
                    processData: false,
                    dataType: 'xml'
                }
            )
            .done( function( _data, _status, _req ) { 
                var elem = jQuery( ".perseusld_results.perseusld_"+_type, self.elem );
                jQuery( ".perseusld_results.perseusld_"+_type, self.elem ).removeClass( "loading" );
                self._transform_annotation( _data, elem, this.xhrFields.data );
            })
            .fail( function( _req ) { 
                var elem = jQuery( ".perseusld_results.perseusld_"+_type, self.elem );
                self._fail_annotation( this.xhrFields.data.last );
            });
         }
    }
    
    /**
     * Removes the loading class if annotation loading fails
     *
     * @param { boolean } _is_last Indicates the last annotation to be retrieved
     */
    PerseusLD.prototype._fail_annotation = function( _is_last) {
        if ( _is_last ) {
            jQuery( this.elem ).removeClass( "loading" );
        }
    }
    
    /**
     * Helper method to transform an annotation using an XSLT transformation, initializing
     * the xslt processor first
     *
     * @param { xml } _xml The xml to transform
     * @param { dom } _elem The element where output is written
     * @param { object } _options Key value pairs 
     *      { 'last' : boolean flag to indicate if this is the last transformation,
     *        'next': int index of the next result,
     *        'type' : target type ('text','passage','work','artifact')
     *       } 
     */
    PerseusLD.prototype._transform_annotation = function( _xml, _elem, _opts ) {
        var self = this;
        //------------------------------------------------------------
        //  load the xslt processor if we haven't already)
        //------------------------------------------------------------
        if ( self.xslt_processor == null ) {
            //------------------------------------------------------------
            //  TODO this transform should show the target if it's 
            //  different than the passage
            //------------------------------------------------------------
            jQuery.get( self.xslt_url,
                function( _data, _status, _req ) {
                    self.xslt_processor = new XSLTProcessor();
                    self.xslt_processor.importStylesheet( _data );
                    self._add_annotation( _xml, _elem, _opts );
                },
                'xml'
            );
        //------------------------------------------------------------
        //  otherwise just pass to _add_annotation
        //------------------------------------------------------------
        }
        else {
            self._add_annotation( _xml, _elem, _opts );
        }
    }
    
    /**
     * Helper method to transform and add an annotation to the display
     *
     * @param _xml the xml of the annotation
     * @param _options key value pairs 
     *      { 'last' : boolean flag to indicate if this is the last transformation,
     *        'next': int index of the next result,
     *        'type' : target type ('text','passage','work','artifact')
     *       } 
     */
    PerseusLD.prototype._add_annotation = function( _xml, _elem, _opts ) {
        var self = this;
        var html = self.xslt_processor.transformToDocument( _xml );
        var node = document.importNode( jQuery( 'div', html ).get(0), true );
        var converter = new Markdown.getSanitizingConverter();
        var textElem = jQuery( ".oac_cnt_chars", node ).get(0);
        var ptext = converter.makeHtml( jQuery( textElem ).html() );
        jQuery( textElem ).html( ptext );
        jQuery( _elem ).append( node );
        //------------------------------------------------------------
        //  Let everyone know you're ready.
        //------------------------------------------------------------
        if ( _opts['last'] ==  true ) {
            jQuery( self.elem ).trigger( self.events['loaded'], [ _opts, self.elem ] );
        }
    }
    
    /**
     * Appends all results of the SPARQL query to the specified element
     *
     * @param {array} a_results Results where each result is a JSON object with the following properties
     *      [{
     *        "annotation": { "value"="<annotationuri>", "type"="uri" },
     *        "target": { "value"="<annotation target uri>", "type"="uri" },
     *        "who": {"value"="<agent uri>", "type"="uri"}
     *      }]
     */
    PerseusLD.prototype.filter_artifact_annotations = function( _results ) {
        var self = this;
        var count = _results.length;
        if ( count == 0 ) {
            jQuery( self.elem ).append( '<p>No Annotations Found</p>' ).removeClass( "loading" );
        } 
        else {
            for ( var i=0; i<count; i++ ) {
                self.results.artifact.push( _results[i].annotation.value );
            }
        }
        self._show_annotations( 'artifact', 0 );
    };
    
    /**
     * Sorts the results of the SPARQL query into results which target the passage, the specific text and
     * the conceptual work and appends all the results of the SPARQL query to the specific results element.
     * Supports paging
     *
     * @param _results an array of results where each result is a JSON object with the following properties
     *      {
     *        "annotation" = { "value"="<annotationuri>", "type"="uri" },
     *        "target" = { "value"="<annotation target uri>", "type"="uri" },
     *        "who" = {"value"="<agent uri>", "type"="uri"}
     *      }
     *        
     */
    PerseusLD.prototype.filter_text_annotations = function( _results ) {
        var self = this;
        //------------------------------------------------------------
        //  Grab work, text, and passage elements
        //------------------------------------------------------------
        var cts_work = jQuery( "*[typeof='http://lawd.info/ontology/ConceptualWork']", self.sbj_elem );
        var cts_text = jQuery( "*[typeof='http://lawd.info/ontology/WrittenWork']", self.sbj_elem );
        // the passage is the subject
        var cts_passage = self.sbj_elem;
        
        var work_uri = self._strip_uri_prefix( cts_work.attr("resource") );
        var text_uri = self._strip_uri_prefix( cts_text.attr("resource") );

        var text_uri_regex = "^" + text_uri + "$";
        var work_uri_regex = "^" + work_uri + "$";
        
        var version_passage_start = null;
        var version_passage_end = null;
        var annotations = { "work": [], "text" : [], "passage" : [] };
        //------------------------------------------------------------
        //  Extract the starting passage of the displayed text version
        //------------------------------------------------------------
        if ( cts_passage.length > 0 ) {
            var passage_uri = self._strip_uri_prefix( cts_passage.attr("resource") );
            var passage_regex = new RegExp("^" + text_uri + ":(.+)$");
            var passage_match = passage_regex.exec(passage_uri);
            if ( passage_match != null ) {
                var version_passage = passage_match[1];
                if (version_passage.match(/-/)) {
                    var parts = version_passage.split(/-/);
                    version_passage_start = parts[0];
                    version_passage_end = parts[1];
                }
                else {
                    version_passage_start = version_passage;
                }
            }
        }
        var num_results = _results.length;
        if ( num_results == 0 ) {
            jQuery( self.elem ).append('<p>No Annotations Found</p>').removeClass("loading");
        } 
        else if ( num_results > 0 ) {
            for (var i=0; i<num_results; i++) {
                var target = self._strip_uri_prefix( _results[i].target.value );
                //------------------------------------------------------------
                //  The annotation is for the work as a whole
                //------------------------------------------------------------
                if ( target.match( new RegExp(work_uri_regex)) != null ) {
                    annotations.work.push( _results[i].annotation.value );
                }
                //------------------------------------------------------------
                //  the annotation is for the text as a whole
                //------------------------------------------------------------
                else if ( target.match( new RegExp( text_uri_regex ) ) != null ) {
                    annotations.text.push( _results[i].annotation.value );
                }
                //------------------------------------------------------------
                // extract the passage from the target
                // compare passage from the target to see if it falls within the range of the shown passage
                // passage matched can either be on the work as a whole or on this specific version
                //------------------------------------------------------------
                else if (version_passage_start != null) {
                    var target_passage = null;
                    var work_passage_regex = new RegExp("^" + work_uri + ":(.+)$");
                    var version_passage_regex = new RegExp("^" + text_uri + ":(.+)$");
                    var work_passage_match = work_passage_regex.exec(target);
                    var version_passage_match = version_passage_regex.exec(target);
                
                    if (work_passage_match != null) {
                        target_passage = work_passage_match[1];
                    }
                    else if (version_passage_match != null) {
                        target_passage = version_passage_match[1];
                    }
                    if (target_passage != null) {
                        var target_passage_start = null;
                        var target_passage_end = null;
                        var range_match = target_passage.match(/^(.+?)-(.+)$/); 
                        //------------------------------------------------------------
                        //  strip subrefs for now - check # and @ for backwards compatibility
                        //------------------------------------------------------------
                        if ( range_match != null) {
                            target_passage_start = range_match[1].replace(/[@#].*$/, '');
                            target_passage_end = range_match[2].replace(/[@#].*$/, '');
                        }
                        //------------------------------------------------------------
                        // no range - start and end are the same
                        // strip subrefs for now - check # and @ for backwards compatibility
                        //------------------------------------------------------------
                        else {
                            target_passage_start = target_passage_end = target_passage.replace(/[@#].*$/, '');
                        }
                        //-------------------------------------------------------------
                        // at least the start of the target passage should be contained within the 
                        // displayed version passge. The end might extend past what is displayed.
                        //--------------------------------------------------------------
                        if (target_passage_start >= version_passage_start &&
                            (version_passage_end == null || target_passage_start <= version_passage_end)) {
                                annotations.passage.push(_results[i].annotation.value);
                        }
                    }
                }
            }
        }
    
        self.results.passage = jQuery.unique(annotations.passage);
        //------------------------------------------------------------
        //  Some annotations may target both an entire text and a 
        //  specific passage so we need to dedupe 
        //  TODO- there's probably a better way to do this 
        //------------------------------------------------------------
        self.results.text = jQuery.grep(annotations.text, function(a) { 
            return jQuery.inArray( a, self.results.passage ) == -1
        });
        self.results.work = jQuery.grep(annotations.work, function(a) { 
            return jQuery.inArray( a, self.results.passage ) == -1 && jQuery.inArray(a,self.results.text) == -1;
        });
        var hasPassage = self.results.passage.length > 0;
        var hasText = self.results.text.length > 0;
        var hasWork = self.results.work.length > 0;
        if ( hasPassage ) { self._show_annotations( 'passage', 0 ); }
        if ( hasText ) { self._show_annotations( 'text',0 ); }
        if ( hasWork ) { self._show_annotations( 'work',0 ); }
    };

    //----------------
    //  Extend JQuery 
    //----------------
    jQuery( document ).ready( function( jQuery ) {
        jQuery.fn.PerseusLD = function( _config ) {
            var id = jQuery( this ).selector;
            return this.each( function() {
                jQuery.data( this, id, new PerseusLD( this, _config, id ) );
            });
        };
    })
})( jQuery );


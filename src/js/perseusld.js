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
        if ( self.sbj_elem.length == 0 ) {
            self.sbj_elem = jQuery("*[typeof='http://www.cidoc-crm.org/cidoc-crm/E22_Man-Made_Object']", self.sbj_elemname );
        }
        if ( self.sbj_elem.length == 0 ) {
            self.sbj_elem = jQuery("*[typeof='http://www.cidoc-crm.org/cidoc-crm/E53_Place']", self.sbj_elemname );
        }
        if ( self.sbj_elem.length == 0) {
            return;
        }
        //------------------------------------------------------------
        //  Remove the uri prefix - 
        //  Let's work just with the URNs to keep it simple
        //------------------------------------------------------------
        self.queryuri = jQuery( self.elem ).attr("data-endpoint");
        //------------------------------------------------------------
        //  Need to use quote meta to escape the uri because it
        //  could contain regex protected chars like + 
        //------------------------------------------------------------ 
        self.sbj = "\\\\Q" + self._strip_uri_prefix( self.sbj_elem.attr("resource") ) + "\\\\E";    
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
        var node = document.importNode( jQuery( 'div', html ).get(0) );
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
        var cts_passage = jQuery( "*[typeof='http://lawd.info/ontology/Citation']", self.sbj_elem );
        
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
                        if (target_passage_start >= version_passage_start &&
                            (version_passage_end == null || target_passage_end <= version_passage_end)) {
                                annotations.passage.push(a_results[i].annotation.value);
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
        if ( hasText ) { self._show_annotations( 'text',a_elem,0 ); }
        if ( hasWork ) { self._show_annotations( 'work',a_elem,0 ); }
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

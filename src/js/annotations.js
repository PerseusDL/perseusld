var PerseusLD;

PerseusLD = PerseusLD || {};

PerseusLD.max_results = 1;

PerseusLD.results = { "passage": [], "text": [], "work": [], "artifact": [] };

/**
 * query_text_annotations operates on a div with the following attributes:
 *    data-sbj: the css identifier of an element containing the subject of the query
 *    data-set: the uri of the data set to query 
 *    data-verb: the verb for the SPARQL query 
 *    data-formatter: the name of a javascript function in the PerseusLD namespace to use to format
 *    data-sbjclass: the type of object the subject is (currently supported: 'text' and 'object')
 *        for class of 'text', the widget expects elements with the following rdf-a key/value pairs to be in the element
 *        identified by data-sbj:
 *             @typeof ==  http://lawd.info/ontology/ConceptualWork and @resource == work uri
 *             @typeof ==  http://lawd.info/ontology/WrittenWork and @resource == edition_uri
 *             @typeof ==  http://lawd.info/ontology/Citation and @resource == passage_uri
 *
 *        for class of 'object', the widget expects an element with the id perseus-object-uri on the page
 *              
 */
PerseusLD.query_text_annotations  = function(a_query_elem) {
    var sbj_elem = $($(a_query_elem).attr("data-sbj"));
    var cts_work = $("*[typeof='http://lawd.info/ontology/ConceptualWork']",sbj_elem);
    if (cts_work.length == 0) {
        return;
    } else {
        cts_work = cts_work.attr("resource");
    }
    // remove the uri prefix - let's work just with the URNs to keep it simple
    var queryuri = $("meta[name='Perseus-Sparql-Endpoint']").attr("content");
    var verb = $(a_query_elem).attr("data-verb");
	var dataset = $(a_query_elem).attr("data-set");
	var formatter = $(a_query_elem).attr("data-formatter");
	var datatype = $(a_query_elem).attr("data-sbjclass");
    var sbj;
    if (datatype == 'text') {
        // we want to query on the conceptual work
        
        sbj = PerseusLD.strip_uri_prefix(cts_work);   
    } else {
        
    }


    var dataset_query = "";
	if (dataset) {
	   dataset_query = "from <" + dataset + "> "
	}

    // retrieve all annotations from the requested set for this work
    // TODO eventually we will want to separate this out by annotation/collection type 
    // TODO sort by ?date
	if (queryuri && sbj && verb) {
    	   $.get(
    	           queryuri + encodeURIComponent( "select distinct ?annotation ?target ?who "+ dataset_query + 
    	               "where { ?annotation "  + "<"  + verb + "> ?target. FILTER regex(str(?target), \"" + sbj + "\"). ?annotation <http://www.w3.org/ns/oa#annotatedBy> ?who}") + "&format=json")
    	         .done( 
                    	   function(data) {
                    	       var results = [];
                    	       if (data.results.bindings.length > 0) {
                    	           jQuery.each(data.results.bindings, function(i, row) {
                    	               results.push(row);
                    	           })
                    	       }
                    	       PerseusLD[formatter]($(a_query_elem),results);
                    	   })
                 .fail(
    	                   function(){
    	                       if (window.console) { console.log("Error retrieving annotations"); }
    	                   }
    	         );
    }	
};

PerseusLD.filter_text_annotations = function(a_elem,a_results) { 
    var sbj_elem = $($(a_elem).attr("data-sbj"));
    var cts_work = $("*[typeof='http://lawd.info/ontology/ConceptualWork']",sbj_elem);
    var cts_text = $("*[typeof='http://lawd.info/ontology/WrittenWork']",sbj_elem);
    var cts_passage = $("*[typeof='http://lawd.info/ontology/Citation']",sbj_elem);
    var work_uri = PerseusLD.strip_uri_prefix(cts_work.attr("resource"));
    var text_uri = PerseusLD.strip_uri_prefix(cts_text.attr("resource"));
    var text_uri_regex = "^" + text_uri + "$";
    var work_uri_regex = "^" + work_uri + "$";
    var version_passage_start = null;
    var version_passage_end = null;
    var annotations = { "work": [], "text" : [], "passage" : [], "artifact": []};
    
    // extract the starting passage of the displayed text version
    if (cts_passage.length > 0) {
        var passage_uri = PerseusLD.strip_uri_prefix(cts_passage.attr("resource"));
        var passage_regex = new RegExp("^" + text_uri + ":(.+)$");
        var passage_match = passage_regex.exec(passage_uri);
        if (passage_match != null) {
            var version_passage = passage_match[1];
            if (version_passage.match(/-/)) {
                var parts = version_passage.split(/-/);
                version_passage_start = parts[0];
                version_passage_end = parts[1];
            } else {
                version_passage_start = version_passage;
            }
        }
    }
    var num_results = a_results.length;
	if (num_results == 0) {
		$(a_elem).append('<p>No Annotations Found</p>').removeClass("loading");
	} else if(num_results > 0) {
		for (var i=0; i<num_results; i++) {
		  var target = PerseusLD.strip_uri_prefix(a_results[i].target.value);
		  if (target.match(new RegExp(work_uri_regex)) != null) {
              // the annotation is for the work as a whole
		      annotations.work.push(a_results[i].annotation.value);		      
		  }
		  else if (target.match(new RegExp(text_uri_regex)) != null) {
		      // the annotation is for the text as a whole
		      annotations.text.push(a_results[i].annotation.value);
		  } else if (version_passage_start != null) {
		      // extract the passage from the target
		      // compare passage from the target to see if it falls within the range of the shown passage
		      // passage matched can either be on the work as a whole or on this specific version
		      var target_passage = null;
		      var work_passage_regex = new RegExp("^" + work_uri + ":(.+)$");
		      var version_passage_regex = new RegExp("^" + text_uri + ":(.+)$");
              var work_passage_match = work_passage_regex.exec(target);
              var version_passage_match = version_passage_regex.exec(target);

              if (work_passage_match != null) {
                target_passage = work_passage_match[1];
              } else if (version_passage_match != null) {
                 target_passage = version_passage_match[1];
              }
              if (target_passage != null) {
                var target_passage_start = null;
                var target_passage_end = null;
                var range_match = target_passage.match(/^(.+?)-(.+)$/); 
                if ( range_match != null) {
                    // strip subrefs for now - check # and @ for backwards compatibility
                    target_passage_start = range_match[1].replace(/[@#].*$/, '');
                    target_passage_end = range_match[2].replace(/[@#].*$/, '');
                } else {
                     // no range - start and end are the same
                     // strip subrefs for now - check # and @ for backwards compatibility
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
	PerseusLD.results.passage = $.unique(annotations.passage);
	// Some annotations may target both an entire text and a specific passage so we need to dedupe - there's probably a better way to do this 
	PerseusLD.results.text = $.grep(annotations.text,function(a) { return $.inArray(a,PerseusLD.results.passage) == -1});
	// Some annotations may target a work, a text and a specific passage so we need to dedupe - there's probably a better way to do this
	PerseusLD.results.work = $.grep(annotations.work,function(a) { return $.inArray(a,PerseusLD.results.passage) == -1 && $.inArray(a,PerseusLD.results.text) == -1;});
    var hasPassage = PerseusLD.results.passage.length > 0;
    var hasText = PerseusLD.results.text.length > 0;
    var hasWork = PerseusLD.results.work.length > 0;
    var showType = hasPassage ? 'passage' : hasText ? 'text' : hasWork ? 'work' : '';
	if ( hasPassage || hasText || hasWork) {
	    $("#annotation_query_button").click(function() { PerseusLD.show_annotations(showType,a_elem,0);});
	    $("#annotation_query_button").show();
    } else {
        // hide the button, just for good measure
        $("#annotation-query-button").hide();
    }
};

PerseusLD.show_annotations = function(a_type,a_elem,a_start) {
    if (a_start == 0) {
        // make sure we don't have any old results loaded
        $(".results."+a_type,a_elem).children().remove();
    } else {
        // we've come from a click on the more button so remove it for now
        $(".results."+a_type+" .more_annotations",a_elem).hide();
    }
    // TODO add UI elements for other annotation types
    $("#annotation_query_button").addClass("clicked");
    $(".results."+a_type,a_elem).addClass("loading");
    $(a_elem).show();
    var end = a_start + PerseusLD.max_results -1;
    if (end > PerseusLD.results[a_type].length - 1) {
        end = PerseusLD.results[a_type].length - 1;
    }
    for (var i=a_start; i<=end; i++) {
        // flags to indicate if on last and if there are any more to show
        var next = null;
       	var last = ( i == end );
       	if (last && end < PerseusLD.results[a_type].length - 1) {
       	    next = end + 1;        
       	}
        	$.ajax(PerseusLD.results[a_type][i]+"/oac",
       	    {
       	        type: 'GET',
       	        xhrFields: {data: {"last":last, "next":next}},
       	        processData: false
       	    }).done(function(a_data,a_status,a_req) { 
       	        PerseusLD.transform_annotation(a_data,$(".results."+a_type,a_elem),this.xhrFields.data.last,this.xhrFields.data.next);    
       	    }).fail(
       	        function(a_req) { 
       	            PerseusLD.fail_annotation($(".results."+a_type,a_elem),a_req.data.last)
       	        }
       	    );
     }
}
PerseusLD.strip_uri_prefix = function(a_str) {
    var stripped = a_str;
    var match = a_str.match("^https?://.*?/(urn:cts:.*)$");
    if (match != null) {
        stripped = match[1];
    }
    return stripped;
}

PerseusLD.fail_annotation = function(a_elem,a_is_last) {
    if (a_is_last) {
        $(a_elem).removeClass("loading");
    }
}

PerseusLD.transform_annotation = function(a_xml,a_elem,a_is_last,a_next) {
    var xsltProcessor = new XSLTProcessor();
    // TODO this transform should show the target if it's different than the passage
	var xslt_url = "http://localhost/xslt/oactohtml.xsl"
	$.get(xslt_url,
	   function(a_data,a_status,a_req) {
	       xsltProcessor.importStylesheet(a_data);
	       PerseusLD.add_annotation(xsltProcessor,a_xml,a_elem,a_is_last,a_next);
	   },
       'xml'
    );
}

PerseusLD.add_annotation = function(a_processor,a_xml,a_elem,a_is_last,a_next) {
    var html = a_processor.transformToDocument(a_xml);
    var node = document.importNode($('div',html).get(0));
    var converter = new Markdown.getSanitizingConverter();
    var textElem = $(".oac_cnt_chars",node).get(0);
    var ptext = converter.makeHtml($(textElem).html());
    $(textElem).html(ptext);
    //$(textElem).addClass(a_typeclass);
    $("*:first-child",textElem).addClass('elided').click(PerseusLD.toggle_elided);
    a_elem.append(node);
    if (a_is_last) {
        $(a_elem).removeClass("loading");
        if (a_next != null) {
            $(a_elem).append("<button class=\"more_annotations\">More</button>");
            $(".more_annotations",a_elem).click(function() { PerseusLD.show_text_annotations($(a_elem).parent(),a_next);});
        }
    }
}

PerseusLD.toggle_elided = function() {
    $(this).toggleClass('more');
}

PerseusLD.shuffle = function(array) {
    'use strict';
    // from https://github.com/coolaj86/knuth-shuffle
    // http://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array
    var currentIndex = array.length
      , temporaryValue
      , randomIndex
      ;

    // While there remain elements to shuffle...
    while (0 !== currentIndex) {

      // Pick a remaining element...
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;

      // And swap it with the current element.
      temporaryValue = array[currentIndex];
      array[currentIndex] = array[randomIndex];
      array[randomIndex] = temporaryValue;
    }

    return array;
}

require(['jquery','perseusld'],
function(jQuery) {
    // add your application logic here
    jQuery().ready(function() {
        PerseusLD.query_md_annotations(jQuery("#perseusld_query_md_annotations"));
    });
});


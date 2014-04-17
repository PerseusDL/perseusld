require(['jquery','perseusld'],
function($) {
    // add your application logic here
    $().ready(function() {
        PerseusLD.query_md_annotations($("#perseusld_query_md_annotations"));
    });
});


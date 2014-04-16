perseus_ldwidget
================

Perseus Linked Data Widget

## Install 

To run the example code you must:

1. Load the tests/data/linkeddatatest.rdf file into a triple store at - e.g. for Fuseki:

		./fuseki-server --file=[ path-to-this-repo ]/tests/data/linkeddatatest.rdf /ds


2. Update the @content attribute, `<meta name='perseusld_SparqlEndpoint' content="http://127.0.0.1:3030/ds/query?query="/>`, in the example html files to point at your triple store's endpoint 

3. Copy or link [ path-to-this-repo ]/tests/data/annotations to [ apache-document-root ]/annotations. If you aren't running an Apache server accessible at http://localhost then update linkeddatatest.rdf changing the @rdf:about attribute to use the url of your Apache server.

		cp -R [ path-to-this-repo ]/tests/data/annotations [ apache-document-root ]/annotations

## Running the examples
When opening the examples use http://localhost/examples/*.html instead of http://127.0.0.1/examples/*.html otherwise you may get cross-domain security errors.

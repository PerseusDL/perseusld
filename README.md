perseusld
================

Perseus Linked Data Widget - Retrieve RDF data with AJAX and format it for HTML display.

## Install
###  Grunt

1. Install npm, node package manager: https://www.npmjs.org/doc/README.html
    * If you use OSX and Homebrew just run this command.

            brew install npm

2. From the root of the perseusld directory run the following commands

        npm install grunt
        npm install -g grunt-cli
        npm install grunt-bower-task
        npm install grunt-update-submodules
        grunt

###  perseusld
To run the example code you must:

1. Clone all git submodules.

        git submodule update --init --recursive

3. Load the tests/data/linkeddatatest.rdf file into a triple-store, e.g. for Fuseki:

        ./fuseki-server --file=[ path-to-this-repo ]/tests/data/linkeddatatest.rdf /ds


4. Update the @content attribute, `<meta name='perseusld_SparqlEndpoint' content="http://127.0.0.1:3030/ds/query?query="/>`, in the example html files to point at your triple store's endpoint 

5. Copy or link [ path-to-this-repo ]/tests/data/annotations to [ apache-document-root ]/annotations. If you aren't running an Apache server accessible at http://localhost then update linkeddatatest.rdf changing the @rdf:about attribute to use the url of your Apache server.

        cp -R [ path-to-this-repo ]/tests/data/annotations [ apache-document-root ]/annotations

## Running the examples
When opening the examples use http://localhost/examples/*.html instead of http://127.0.0.1/examples/*.html otherwise you may get cross-domain security errors.

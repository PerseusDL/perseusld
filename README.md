perseusld
================

Perseus Linked Data Widget

## Install

1. Run the build script.

        ./BUILD.sh

2. Load the tests/data/linkeddatatest.rdf file into a triple-store, e.g. for Fuseki:

        ./fuseki-server --file=[ path-to-this-repo ]/tests/data/linkeddatatest.rdf /ds

3. Update the @endpoint attribute, in the example html files to point at your triple store's endpoint if it isn't running on "localhost:3030"

4. Copy or link [ path-to-this-repo ]/tests/data/annotations to [ apache-document-root ]/annotations. If you aren't running an Apache server accessible at http://localhost then update linkeddatatest.rdf changing the @rdf:about attribute to use the url of your Apache server.
>>>>>>> 3ac0733d92c48a7f252d3c7e0b0f1b7cf474d383

        cp -R [ path-to-this-repo ]/tests/data/annotations [ apache-document-root ]/annotations

## Running the examples
When opening the examples use http://localhost/examples/*.html instead of http://127.0.0.1/examples/*.html otherwise you may get cross-domain security errors.

## Note to developers
If you want to make changes to the code please make changes to the files in **src/** and then use the BUILD.sh script to update the perseusld.js, perseusld.min.js, and perseusld.css files in the project root.

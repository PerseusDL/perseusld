## Prerequisites 

to run the example code you need to:

1. Follow the instructions in INSTALL.md to install the javascript dependencies

2. load the tests/data/linkeddatatest.rdf file into a triple store at - e.g. for Fuseki:

3. `./fuseki-server --file=/home/baas/workspace/perseus_ldwidget/tests/data/linkeddatatest.rdf /ds`

4. update the @content attribute of 
`<meta name='perseusld_SparqlEndpoint' content="http://localhost:3030/ds/query?query="/>`
in the example html files to point at your triple store's endpoint 

5. copy the annotations folder under tests/data to your local apache server's document root. (if you don't run an apache server under localhost:80 then you will also have to update the @rdf:about attribute of the annotations in linkeddatatest.rdf to use the url of your test Apache environment).


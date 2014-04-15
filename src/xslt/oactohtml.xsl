<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet 
    xmlns:xsl="http://www.w3.org/1999/XSL/Transform" 
    version="1.0" xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#" 
    xmlns:dc="http://purl.org/dc/elements/1.1/" 
    xmlns:dcterms="http://purl.org/dc/terms/" 
    xmlns:dctypes="http://purl.org/dc/dcmitype/" 
    xmlns:foaf="http://xmlns.com/foaf/0.1/" 
    xmlns:oac="http://www.w3.org/ns/oa#" 
    xmlns:cnt="http://www.w3.org/2008/content#" 
    xmlns:rdfs="http://www.w3.org/2000/01/rdf-schema#"
    xmlns:exsl="http://exslt.org/common">
    
    <xsl:output method="html" indent="yes"/>
    
    <xsl:variable name="labels">
        <!-- TODO should support localization of lables -->
        <motivation type="http://www.w3.org/ns/oa#commenting">Commentary</motivation>
        <motivation type="http://www.w3.org/ns/oa#linking">Links</motivation>
    </xsl:variable>
    
    <xsl:template match="/rdf:RDF">
    	<xsl:apply-templates select="oac:Annotation"/>
    </xsl:template>
    
    <xsl:template match="oac:Annotation">
          		<div class="oac_annotation" about="{@rdf:about}" typeof="oac:Annotation">
          		    <div class="oac_annotation_uri"><span class="label">Annotation:</span><xsl:value-of select="@rdf:about"/></div>
          		    <div class="annotation clearfix">
          		        <xsl:apply-templates select="oac:hasBody"/>
          		    </div>
          		    <xsl:variable name="target">
          		        <xsl:apply-templates select="oac:hasTarget"/>
          		    </xsl:variable>
          		    <div class="metadata clearfix" title="Annotation on {$target}">
                         	<xsl:apply-templates select="oac:annotatedAt"/>
                          <xsl:apply-templates select="oac:annotatedBy"/>
                 		    <xsl:apply-templates select="rdfs:label"/>
                 		    <xsl:apply-templates select="oac:motivatedBy"/>
          		    </div>          		
          		</div>
    </xsl:template>
    
    <xsl:template match="oac:hasTarget">
        <xsl:value-of select="@rdf:resource"/><xsl:text> </xsl:text> 
    </xsl:template>
    
    <xsl:template match="oac:hasBody">
        <xsl:choose>
            <xsl:when test="@rdf:resource">
                <div class="oac_body" rel="oac:hasBody">
                    <a href="{@rdf:resource}">
                        <xsl:value-of select="@rdf:resource"/>
                    </a>
                </div>        
            </xsl:when>
            <xsl:otherwise>
                <xsl:apply-templates/>
            </xsl:otherwise>
        </xsl:choose>
        
    </xsl:template>
    
    <xsl:template match="cnt:ContentAsText">
        <div class="oac_body_text" rel="oac:hasBody" typeof="dctypes:Text" resource="{@rdf:about}">
            <div class="oac_cnt_chars" property="cnt:chars"><xsl:value-of select="cnt:chars"/></div>
        </div>
    </xsl:template>
    
    <xsl:template match="rdfs:label">
        <div class="oac_label" property="rdfs:label">
            <xsl:if test="@rdf:about">
                <a href="{@rdf:about}"><xsl:value-of select="@rdf:about"/></a>
            </xsl:if>
            <xsl:if test="text()">
                <xsl:copy-of select="text()"/>
            </xsl:if>
        </div>
    </xsl:template>
    
    <xsl:template match="oac:annotatedBy">
        <div class="oac_creator" rel="oac:annotatedBy">
            <span class="label">Annotator:</span>
            <xsl:apply-templates/>
        </div>
    </xsl:template>
    
    <xsl:template match="foaf:Person">
        <div class="foaf_person">
            <xsl:choose>
                <xsl:when test="node()">
                    <xsl:attribute name="property">foaf:Person</xsl:attribute>
                    <xsl:attribute name="resource"><xsl:value-of select="@rdf:about"/></xsl:attribute>
                    <xsl:apply-templates/>
                </xsl:when>
                <xsl:otherwise><a href="{@rdf:about}" property="foaf:Person"><xsl:value-of select="@rdf:about"/></a></xsl:otherwise>
            </xsl:choose>
        </div>
    </xsl:template>
    
    <xsl:template match="foaf:name">
        <div class="foaf_name" property="foaf:name">
            <xsl:copy/>
        </div>
    </xsl:template>
    
    <xsl:template match="oac:annotatedAt">
        
        <div class="oac_annotatedAt" rel="oac:annotatedAt">
            <span class="label">Created at:</span>
            <!-- drop the time string if it's present -->
            <xsl:choose>
                <xsl:when test="contains(.,'T')">
                    <xsl:value-of select="substring-before(.,'T')"/>
                </xsl:when>
                <xsl:otherwise><xsl:value-of select="."/></xsl:otherwise>
            </xsl:choose>
        </div>
    </xsl:template>
    
    <xsl:template match="oac:motivatedBy">
        <xsl:variable name="motivation"><xsl:value-of select="@rdf:resource"/></xsl:variable>
        <xsl:variable name="label" select="exsl:node-set($labels)/motivation[@type=$motivation]"/>
        <div class="oac_motivation" rel="oac:motivatedBy" resource="{@rdf:resource}">
            <span class="label">
                <xsl:choose>
                    <xsl:when test="$label"><xsl:value-of select="$label"/></xsl:when>
                    <xsl:otherwise><xsl:value-of select="@rdf:resource"/></xsl:otherwise>
                </xsl:choose>
            </span>
        </div>
    </xsl:template>
</xsl:stylesheet>
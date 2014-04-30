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
        <xsl:variable name="target">
            <xsl:apply-templates select="oac:hasTarget"/>
        </xsl:variable>
        <div class="oac_annotation" about="{@rdf:about}" typeof="oac:Annotation">
            <xsl:apply-templates select="rdfs:label"/>
            <xsl:apply-templates select="oac:motivatedBy"/>
            <a href="{@rdf:about}" class="oac_annotation_uri"  title="Annotation on {$target}">Permalink</a>
            <div class="annotation">
                <xsl:apply-templates select="oac:hasBody"/>
            </div>
            <div class="metadata">
                <xsl:apply-templates select="oac:annotatedBy"/>
                <xsl:apply-templates select="oac:annotatedAt"/>
                <!-- TODO eventually the rights should be coming from the annotation -->
                <div class="copyright">
                    This work is licensed under a 
                    <a rel="license" href="http://creativecommons.org/licenses/by-sa/3.0/us/">Creative Commons Attribution-ShareAlike 3.0 United States License</a>.
                </div>
            </div>
			<div class="clear"></div>
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
                <xsl:otherwise>
                    <a href="{@rdf:about}" property="foaf:Person">
                        <!-- Retrieve just the username from a perseus sosol user url-->
                        <!-- strReplace() -->
                        <xsl:call-template name="strReplace">
                            <xsl:with-param name="text">
                                <!-- lastDir() -->
                                <xsl:call-template name="lastDir">
                                    <xsl:with-param name="path"><xsl:value-of select="@rdf:about"/></xsl:with-param>
                                </xsl:call-template>
                            </xsl:with-param>
                            <xsl:with-param name="replace" select="'%20'" />
                            <xsl:with-param name="with" select="' '"/>
                        </xsl:call-template>
                    </a>
                </xsl:otherwise>
            </xsl:choose>
        </div>
    </xsl:template>
    
    <xsl:template match="foaf:name">
        <div class="foaf_name" property="foaf:name">
            <a href="{../@rdf:about}"><xsl:value-of select="."/></a>
        </div>
    </xsl:template>
    
    <xsl:template match="oac:annotatedAt">
        <div class="oac_annotatedAt" rel="oac:annotatedAt">
            <!-- drop the time string if it's present -->
            <xsl:choose>
                <xsl:when test="contains(.,'T')">
                    <!-- Format the date so it's human friendly -->
                    <xsl:call-template name="dateFormat">
                        <xsl:with-param name="yyyy-mm-dd">
                            <xsl:value-of select="substring-before(.,'T')"/>
                        </xsl:with-param>
                    </xsl:call-template>
                </xsl:when>
                <xsl:otherwise>
                    <!-- Format the date so it's human friendly -->
                    <xsl:call-template name="dateFormat">
                        <xsl:with-param name="yyyy-mm-dd">
                            <xsl:value-of select="."/>
                        </xsl:with-param>
                    </xsl:call-template>
                </xsl:otherwise>
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
    
    <!-- lastDir(): Get last directory/filename from path
    
        Example:
        <xsl:call-template name="lastDir">
            <xsl:with-param name="path"><xsl:value-of select="@rdf:about"/></xsl:with-param>
        </xsl:call-template>
    -->
    <xsl:template name="lastDir">
        <xsl:param name="path" />
        <xsl:choose>
            <xsl:when test="contains($path,'/')">
                <xsl:call-template name="lastDir">
                    <xsl:with-param name="path" select="substring-after($path,'/')" />
                </xsl:call-template>
            </xsl:when>
            <xsl:otherwise>
                <xsl:value-of select="$path"/>
            </xsl:otherwise>
        </xsl:choose>
    </xsl:template>

    <!-- strReplace(): Replace a string with another string in a large string
    
        Example:
        <xsl:call-template name="strReplace">
            <xsl:with-param name="text" select="'aa::bb::cc'"/>
            <xsl:with-param name="replace" select="'::'" />
            <xsl:with-param name="with" select="','"/>
        </xsl:call-template>
    -->
    <xsl:template name="strReplace">
        <xsl:param name="text"/>
        <xsl:param name="replace"/>
        <xsl:param name="with"/>
        <xsl:choose>
            <xsl:when test="contains($text,$replace)">
                <xsl:value-of select="substring-before($text,$replace)"/>
                <xsl:value-of select="$with"/>
                <xsl:call-template name="strReplace">
                    <xsl:with-param name="text" select="substring-after($text,$replace)"/>
                    <xsl:with-param name="replace" select="$replace"/>
                    <xsl:with-param name="with" select="$with"/>
                </xsl:call-template>
            </xsl:when>
            <xsl:otherwise>
                <xsl:value-of select="$text"/>
            </xsl:otherwise>
        </xsl:choose>
    </xsl:template>
    
    <!-- dateFormat(): Take a date in 2014-01-01 type format and turn it into a more human readable for
    
        Example:
        <xsl:call-template name="dateFormat">
            <xsl:with-param name="yyyy-mm-dd" select="'2014-01-01'"/>
        </xsl:call-template>
    -->
    <xsl:template name="dateFormat">
        <xsl:param name="yyyy-mm-dd"/>

        <xsl:variable name="yyyy" select="substring-before($yyyy-mm-dd, '-')"/>
        <xsl:variable name="mm-dd" select="substring-after($yyyy-mm-dd, '-')"/>
        <xsl:variable name="mm" select="substring-before($mm-dd, '-')"/>
        <xsl:variable name="dd" select="substring-after($mm-dd, '-')"/>

        <xsl:variable name="Y">
            <xsl:choose>
                <xsl:when test="$mm &lt; 3">
                    <xsl:value-of select="$yyyy - 1"/>
                </xsl:when>
                <xsl:otherwise>
                    <xsl:value-of select="$yyyy + 0"/>
                </xsl:otherwise>
            </xsl:choose>
        </xsl:variable>
        
        <xsl:variable name="y" select="$Y mod 100"/>
        <xsl:variable name="c" select="floor($Y div 100)"/>
        <xsl:variable name="d" select="$dd+0"/>
        <xsl:variable name="m">
            <xsl:choose>
                <xsl:when test="$mm &lt; 3"><xsl:value-of select="$mm + 12"/></xsl:when>
                <xsl:otherwise><xsl:value-of select="$mm + 0"/></xsl:otherwise>
            </xsl:choose>
        </xsl:variable>
        
        <xsl:variable name="w" select="($d + floor(($m + 1) * 2.6) + $y + floor($y div 4) + floor($c div 4) - $c * 2 - 1) mod 7"/>
        <xsl:variable name="www">
            <xsl:choose>
                <xsl:when test="$w = 0">Sunday</xsl:when>
                <xsl:when test="$w = 1">Monday</xsl:when>
                <xsl:when test="$w = 2">Tuesday</xsl:when>
                <xsl:when test="$w = 3">Wednesday</xsl:when>
                <xsl:when test="$w = 4">Thursday</xsl:when>
                <xsl:when test="$w = 5">Friday</xsl:when>
                <xsl:when test="$w = 6">Saturday</xsl:when>
            </xsl:choose>
        </xsl:variable>

        <xsl:variable name="mmm">
            <xsl:choose>
                <xsl:when test="$mm =  1">January</xsl:when>
                <xsl:when test="$mm =  2">February</xsl:when>
                <xsl:when test="$mm =  3">March</xsl:when>
                <xsl:when test="$mm =  4">April</xsl:when>
                <xsl:when test="$mm =  5">May</xsl:when>
                <xsl:when test="$mm =  6">June</xsl:when>
                <xsl:when test="$mm =  7">July</xsl:when>
                <xsl:when test="$mm =  8">August</xsl:when>
                <xsl:when test="$mm =  9">September</xsl:when>
                <xsl:when test="$mm = 10">October</xsl:when>
                <xsl:when test="$mm = 11">November</xsl:when>
                <xsl:when test="$mm = 12">December</xsl:when>
            </xsl:choose>
        </xsl:variable>
        <xsl:value-of select="concat($www, ', ', $mmm, ' ', $d, ' ', $yyyy)"/>
    </xsl:template>
</xsl:stylesheet>
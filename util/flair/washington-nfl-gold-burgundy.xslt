<?xml version="1.0" encoding="utf-8"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform" xmlns:svg="http://www.w3.org/2000/svg">
    <!-- Change colours of NFL logo SVG from nfl.com to Washington colours -->
    <xsl:output method="xml" encoding="utf-8" indent="yes"/>

    <!-- Copy everything as-is -->
    <xsl:template match="@*|node()">
        <xsl:copy>
            <xsl:apply-templates select="@*|node()"/>
        </xsl:copy>
    </xsl:template>

    <!-- Except for the blue bits, which become #5A1414 -->
    <xsl:template match="//svg:path[@fill = '#013369']/@fill">
        <xsl:attribute name="fill">#5A1414</xsl:attribute>
    </xsl:template>

    <!-- Except for the red buts, which become #FFB612 -->
    <xsl:template match="//svg:path[@fill = '#D50A0A']/@fill">
        <xsl:attribute name="fill">#FFB612</xsl:attribute>
    </xsl:template>
</xsl:stylesheet>

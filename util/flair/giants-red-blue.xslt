<?xml version="1.0" encoding="utf-8"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform" xmlns:svg="http://www.w3.org/2000/svg">
    <!-- Change colours of New York Giants logo SVG from nfl.com -->
    <xsl:output method="xml" encoding="utf-8" indent="yes"/>

    <!-- Copy everything as-is -->
    <xsl:template match="@*|node()">
        <xsl:copy>
            <xsl:apply-templates select="@*|node()"/>
        </xsl:copy>
    </xsl:template>

    <!-- Except for this path (outline), which becomes #c4122e -->
    <xsl:template match="/svg:svg/svg:g/svg:g/svg:path[1]/@fill">
        <xsl:attribute name="fill">#c4122e</xsl:attribute>
    </xsl:template>

    <!-- Except for this path (fill), which becomes #1b458f -->
    <xsl:template match="/svg:svg/svg:g/svg:g/svg:path[2]/@fill">
        <xsl:attribute name="fill">#1b458f</xsl:attribute>
    </xsl:template>

</xsl:stylesheet>

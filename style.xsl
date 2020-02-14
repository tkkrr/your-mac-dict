<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform" xmlns:d="http://www.apple.com/DTDs/DictionaryService-1.0.rng">

<xsl:template match="dictionary">
    <html lang="en">
        <head>
            <meta charset="UTF-8"/>
            <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
            <title>Your Mac Dict</title>
        </head>
        <body>
            <xsl:for-each select="d:entry">
                <xsl:copy-of select="."/>
            </xsl:for-each>
        </body>
    </html>
</xsl:template>

</xsl:stylesheet>
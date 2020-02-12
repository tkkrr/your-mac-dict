const fs = require('fs')
const zlib = require('zlib')


const pochi = (searchWord) => {
    const filename = '/System/Library/AssetsV2/com_apple_MobileAsset_DictionaryServices_dictionaryOSX/7725cba5b321a8308a603a40ac808699175c4aae.asset/AssetData/Sanseido The WISDOM English-Japanese Japanese-English Dictionary.dictionary/Contents/Resources/Body.data'

    const content = fs.readFileSync(filename)

    let dictionary = [
        '<?xml version="1.0" encoding="UTF-8"?>',
        '<?xml-stylesheet type="text/xsl" href="style.xsl" ?>',
        '<dictionary>'
    ]

    const binaryContent = Buffer.from(content, 'binary')

    let seeker = 0x40
    const limit = binaryContent.readInt32LE(seeker) + 0x40
    seeker = 0x60

    while (seeker < limit) {
        const sz = binaryContent.readInt32LE(seeker)
        seeker += 4
        const binaryDataBlock = binaryContent.slice(seeker+8, seeker + sz)
        seeker += sz
        const buf = zlib.unzipSync( binaryDataBlock )
        let pos = 0

        while (pos < buf.length) {
            const chunksize = Buffer.from( buf.slice(pos, pos+4) ).readUInt32LE(0)
            pos += 4
            const entry = buf.slice( pos, pos + chunksize).toString("utf-8")
            const title = entry.match(/d:title="(.*?)"/)

            if (title[1] == searchWord) {
                dictionary.push(entry)
            }

            pos += chunksize
        }
    }

    dictionary.push("</dictionary>")
    return dictionary.join("")
}

module.exports = {
    pochi
}
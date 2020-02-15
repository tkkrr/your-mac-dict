const fs = require('fs')
const zlib = require('zlib')

const pochi = (dictPath, searchWord) => {
    const filename = dictPath

    const content = fs.readFileSync(filename)
    const binaryContent = Buffer.from(content, 'binary')
    let entries = []

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
            // Tips: 英和辞典における最長単語は「セントビンセントおよびグレナディーンしょとう」
            //       この単語は最低でも 91--168bytes 読む必要がある．
            // Tips: 国語辞典における最長単語は「聞くは＝一時（いつとき）／＝一旦（いつたん）の恥（はじ），聞かぬは＝末代（まつだい）／＝一生の恥」
            //       この単語は 60--210bytes 読む必要がある
            //       したがって辞書の更新を考慮して多めに 40--240Bytes 読む
            let entry = buf.slice( pos + 40, pos + 240).toString("utf-8")
            try{
                const title = entry.match(/d:title="(.*?)"/)
                if (title[1] == searchWord) {
                    // console.log(entry.match(/d:title="(.*?)"/)[1])
                    entry = buf.slice( pos, pos + chunksize).toString("utf-8")
                    entries.push(entry)
                }
            }catch(e){
                console.log(e)
            }
            // let entry = buf.slice( pos, pos + chunksize).toString("utf-8")
            // const title = entry.match(new RegExp(`${searchWord}`))

            pos += chunksize
        }
    }

    let dictionary = [
        '<html lang="en">',
        '<head>',
        '<meta charset="UTF-8"/>',
        '<meta name="viewport" content="width=device-width, initial-scale=1.0"/>',
        '<title>Your Mac Dict</title>',
        '</head>',
        '<html>',
        '<body>',
        entries.length === 0 ? `<em style="color: grey; font-size: 24pt;">Not found ${searchWord}</em>` : entries.join(""),
        '</body>',
        "</html>"
    ]
    return dictionary.join("")
}

module.exports = {
    pochi
}
const path = require("path")
const execSync = require("child_process").execSync


const xsltproc = () => {
    const pathToXml = path.resolve(__dirname, "setup.xml") 
    const pathToXsl = path.resolve(__dirname, "style.xsl") 

    // we will implementation on webView
    const cmd = ["xsltproc", pathToXsl, pathToXml].join(" ")

    let child
    try {
        child = execSync(cmd).toString()
    }catch(e){
        console.log(e)
    }

    return child
}


module.exports = { 
    xsltproc
}
import { exec } from "child_process"
var child

const child_search_process = () => {
    child = exec(
        "python3 /Users/tucker/Desktop/test_test/english-to-japanese-dict/src/hoge.py railwayman",
        function (error, stdout, stderr) {
            console.log("This is working!")
            console.log(stdout)
            console.log(stderr)
            if (error !== null) {
                console.log('exec error: ' + error)
            }
        }
    )
    // console.log(child.std)
}

export default child_search_process
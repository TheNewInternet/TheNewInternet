//Wraps Diode.exe to execute it with the given arguments.
const spawn = require( 'child_process' ).spawn;
var path = require('path');
appRoot = path.resolve(__dirname);

function publishDevice(port, isPublic,whitelistFile) {
    console.log('Publishing device on port ' + port + ' as ' + (isPublic ? 'public' : 'whitelisted'));
    let command = appRoot + '/binary/diode.exe ';
    let args = ['publish']
    if (isPublic) {
        args.push('-public');
        args.push(port);
    }else {
        args.push('-private');
        whitelistedArray = fs.readFileSync(whitelistFile).toString().split("\n");
        //format into port:port,adress1,adress2,adress3...
        let whitelist = port + ':' + port + ',' + whitelistedArray.join(',');
        args.push(whitelist);
    }
    
    const child = spawn(command, {
        shell: true
    });
    child.stdout.on('data', function(data) {
        console.log(data.toString());
    });
    child.stderr.on('data', function(data) {
        console.log(data.toString());
    });
    child.on('exit', function(code) {
        console.log('child process exited with code ' + code.toString());
    });
}

module.exports = {
    publishDevice
};

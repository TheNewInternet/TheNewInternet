//A CLI that uses binaryWrapper to publish websites on Diode Network. 
// Options are: Public or Whitelisted. For whitelist, you need to provide the whitelist file.
// default is public and port 8080. Default defaulf whitelist file is whitelist.txt

const { publishDevice } = require('./binaryWrapper');
const fs = require('fs');
const readline = require('readline');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

async function main() {
    let port = 8080;
    let isPublic = true;
    let whitelistFile = 'whitelist.txt';

    if (process.argv.length <= 2) {
        rl.question('Enter port number: ', (answer) => {
            port = parseInt(answer);
            rl.question('Public or Whitelisted? ', (answer) => {
                if (answer === 'Public') {
                    isPublic = true;
                } else {
                    isPublic = false;
                    rl.question('Enter whitelist file name: ', (answer) => {
                        whitelistFile = answer;
                        publishDevice(port, isPublic, whitelistFile);
                        rl.close();
                    });
                }
                publishDevice(port, isPublic, whitelistFile);
                rl.close();
            });
        });
    }else{
        if (process.argv.length > 2) {
            port = parseInt(process.argv[2]);
        }
    
        if (process.argv.length > 3) {
            if (process.argv[3] === 'whitelist') {
                isPublic = false;
            }
        }
    
        if (process.argv.length > 4) {
            whitelistFile = process.argv[4];
        }
    
    
    
        publishDevice(port, isPublic, whitelistFile);
    }
    
}

main();
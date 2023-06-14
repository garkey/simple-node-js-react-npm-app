const fspromise = require('fs/promises');
const { readFile } = fspromise;
const xml2js = require('xml2js');
var parser = new xml2js.Parser();
const projdir = 'force-app/main/default/';
const { exec } = require('child_process');
const DIR = 'manifest/CAMS';

function execWithPromise(cmd, { verbose } = { verbose: false }) {
    return new Promise((resolve, reject) => {
        console.log('running..', cmd);
        exec(cmd, (err, stdout, stderr) => {
            if (err) {
                console.log('err', err);
                reject(err);
            }

            if (stderr) {
                console.log('stderr', stderr);
                // reject(stderr);
            }

            // if (argvs.verbose || argvs["_"][0] === "list") {
            if (verbose) {
                console.log(stdout);
            }

            resolve(stdout);
        });
    });
}

async function readPackageXml() {
    const xml = await readFile(`${DIR}/package.xml`);
    const toappendxml = await parser.parseStringPromise(xml);
    // console.log('toappendxml', toappendxml);
    // console.log('toappendxml.Package.types', toappendxml.Package.types);
    const lwc = toappendxml.Package.types.find(
        (e) => e.name[0] === `LightningComponentBundle`,
    );

    return lwc.members;
}

async function main() {
    const m = await readPackageXml();
    const d = m.map((e) => projdir + 'lwc/' + e);
    const cmd = [
        'npx',
        'prettier',
        '--config .prettierrc',
        '--ignore-path .prettierignore',
        process.env.CHECK ? '--check' : '-w',
        d.join(' '),
    ];
    const validate = await execWithPromise(cmd.join(' '));
}

main();

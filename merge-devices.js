#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const xml2js = require('xml2js');
const inquirer = require('inquirer');

async function main() {
    const parser = new xml2js.Parser();
    const builder = new xml2js.Builder({ headless: false, renderOpts: { pretty: true } });


const workingDir = process.cwd(); 
const xmlFiles = fs.readdirSync(workingDir).filter(file => file.toLowerCase().endsWith('.xml'));


if (xmlFiles.length < 2) {
    console.error('❌ You need at least two XML files in the folder to run this tool.');
    process.exit(1);
}


const { sourceFile, targetFile } = await inquirer.prompt([
    {
        type: 'list',
        name: 'sourceFile',
        message: 'Select the SOURCE file (contains the device to copy):',
        choices: xmlFiles
    },
    {
        type: 'list',
        name: 'targetFile',
        message: 'Select the TARGET file (where device should be inserted):',
        choices: (answers) => xmlFiles.filter(f => f !== answers.sourceFile)
    }
]);

const sourcePath = path.resolve(workingDir, sourceFile);
const targetPath = path.resolve(workingDir, targetFile);

console.log(`Reading source file: ${sourcePath}`);
const sourceXml = fs.readFileSync(sourcePath, 'utf8');

console.log(`Reading target file: ${targetPath}`);
const targetXml = fs.readFileSync(targetPath, 'utf8');



    console.log(`Reading source file: ${sourceFile}`);
    
    const sourceParsed = await parser.parseStringPromise(sourceXml);

    console.log(`Reading target file: ${targetFile}`);
   
    const targetParsed = await parser.parseStringPromise(targetXml);

    const sourceDevices = sourceParsed.profile.devices[0].device;
    const targetDevices = targetParsed.profile.devices[0].device || [];

    if (!sourceDevices || sourceDevices.length === 0) {
        console.error('No devices found in source file.');
        process.exit(1);
    }

    
    const { chosenDeviceIndex } = await inquirer.prompt([
        {
            type: 'list',
            name: 'chosenDeviceIndex',
            message: 'Select a device to copy into the target file:',
            choices: sourceDevices.map((dev, idx) => {
                
                let containerCount = 0;
                if (dev.mode) {
                    for (const mode of dev.mode) {
                        if (mode.axis) {
                            for (const axis of mode.axis) {
                                if (axis.container) containerCount += axis.container.length;
                            }
                        }
                        if (mode.button) {
                            for (const button of mode.button) {
                                if (button.container) containerCount += button.container.length;
                            }
                        }
                        if (mode.hat) {
                            for (const hat of mode.hat) {
                                if (hat.container) containerCount += hat.container.length;
                            }
                        }
                    }
                }
            
                return {
                    name: `${dev.$.name.trim()} [GUID: ${dev.$['device-guid']}] (Containers: ${containerCount})`,
                    value: idx
                };
            })
            
        }
    ]);

    const deviceToInsert = sourceDevices[chosenDeviceIndex];

    
    const existing = targetDevices.find(d => d.$['device-guid'] === deviceToInsert.$['device-guid']);
    if (existing) {
        console.log('⚠️ Device with same GUID already exists in target file. It will NOT be inserted again.');
        process.exit(1);
    }

    
    console.log(`Inserting device: ${deviceToInsert.$.name}`);
    targetParsed.profile.devices[0].device.push(deviceToInsert);

    const mergedXml = builder.buildObject(targetParsed);

    const outputFile = path.resolve(workingDir, 'Joystick Gremlin Merged VKB');
fs.writeFileSync(outputFile, mergedXml, 'utf8');

    console.log(`✅ Done! Created: ${outputFile}`);
  
waitForExit();

}

main().catch(err => {
    console.error(err);
    waitForExit();
});



function waitForExit() {
    const readline = require('readline');
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });
    rl.question('\n✅ Press ENTER to exit...', () => {
        rl.close();
        process.exit();
    });
}

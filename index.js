#! /usr/bin/env node

const csv = require('csvtojson');

if (process.argv.length != 4) {
    console.log(
        "You need to pass in two arguments:\n"
        + "\n"
        + "1. CSV file\n"
        + "2. Path to project resource directory\n"
        + "\n"
        + "Example:\n"
        + "\n"
        + "\ttranslation-copier mycsv.csv ~/Workspace/MyProject/app/src/main/res\n"
        );

    return;
}

csv().fromFile(process.argv[2])
    .on('json', (item) => {
        console.log(item);
    })
    .on('done', (error) => {
        console.log('Done!')
    });

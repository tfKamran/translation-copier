#! /usr/bin/env node

const csv = require('csvtojson');
const fs = require('fs');
const xml2js = require('xml2js');

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

const CSVFile = process.argv[2];
const resFolder = process.argv[3];

csv().fromFile(CSVFile)
    .on('json', (item) => {
        const language = item[Object.keys(item)[0]];

        delete item[Object.keys(item)[0]];
        
        const valuesFolder = (language == "en" ? resFolder + "/values" : resFolder + "/values-" + language);

        if (!fs.existsSync(valuesFolder)) {
            fs.mkdirSync(valuesFolder);
        }

        const stringsFile = valuesFolder + "/strings.xml";

        if (!fs.existsSync(stringsFile)) {
            fs.writeFileSync(stringsFile,
                '<resources></resources>',
                'utf8');
        }

        const stringsXMLContent = fs.readFileSync(stringsFile, 'utf8');

        const isFourSpacesTabbed = stringsXMLContent.indexOf('    ') != -1
                && (stringsXMLContent.indexOf('string-array') == -1
                    || stringsXMLContent.indexOf('    ') < stringsXMLContent.indexOf('string-array'));

        xml2js.parseString(stringsXMLContent, (error, xmlJSON) => {
            Object.keys(item).forEach(key => {;

                if (!xmlJSON.resources) {
                    xmlJSON.resources = {};
                }

                if (!xmlJSON.resources.string) {
                    xmlJSON.resources.string = [];
                }

                xmlJSON.resources.string = xmlJSON.resources.string.filter(item => {
                    if (item.$.name == key) {
                        return false;
                    }

                    return true;
                });

                xmlJSON.resources.string.push({
                    "_": item[key],
                    "$": {
                        "name": key
                    }
                });
            });

            var xml = new xml2js.Builder({
                'xmldec': '<?xml version="1.0" encoding="UTF-8"?>'
            }).buildObject(xmlJSON);

            xml = '<?xml version="1.0" encoding="UTF-8"?>\n'
                + xml.replace('<?xml version="1.0"?>\n', '');

            if (isFourSpacesTabbed) {
                xml = xml.split('  <').join('    <');
            }

            fs.writeFileSync(stringsFile, xml, 'utf8');
        });
    })
    .on('done', (error) => {
        console.log('Done!')
    });

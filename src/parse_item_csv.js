const csvFilePath = './constants/items.csv';
const csv = require('csvtojson');
const fs = require('fs');

console.log('Converting Items JSON...');
csv()
  .fromFile(csvFilePath)
  .then(jsonObj => {
    fs.writeFileSync(
      './constants/items.json',
      JSON.stringify(jsonObj, null, 2)
    );
    console.log('Items converted!');
  });

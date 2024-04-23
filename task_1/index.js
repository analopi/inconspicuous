import {encoded, translations} from './data.js'



function decodeFields(encodedData, translationsDict) {

    const uniqueIds = new Set();
    
    const decodedData = encodedData.map(obj => {
      const decodedObj = {};
  

      for (const key in obj) {
        if (key.endsWith("Id") && !["groupId", "service", "formatSize", "ca"].includes(key)) {
          const decodedValue = translationsDict[obj[key]] || obj[key]; 
          decodedObj[key] = decodedValue;
          uniqueIds.add(obj[key]); 
        } else {

          decodedObj[key] = obj[key];
        }
      }
  
      return decodedObj;
    });
  

    return { decodedData, uniqueIds: Array.from(uniqueIds) };
  }
  

const { decodedData, uniqueIds } = decodeFields(encoded, translations);
console.log("Decoded Data:", decodedData);
console.log("Unique IDs:", uniqueIds);



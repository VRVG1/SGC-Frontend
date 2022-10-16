import addHeaderAuth from '../Auth/AuthPostBasis'

const makeRestore = (token, formData, callback) => {
  let post = {
    method: 'POST',
    headers: {
    },
    body: formData
  };

  post = addHeaderAuth(token, post);
  const jsonData = require('../../../variables.json'); 
    const url = jsonData.host + "respaldo/upload-restore";
  fetch(url, post)
    .then(async response => ({
      isOperationSuccess: response.ok,
      message: await response.text()
    }))
    .then(resObj => {
      console.log('Is OK?: ', resObj.isOperationSuccess)
      console.log('Message: ', resObj.message)
      callback(resObj)
      //if (resObj.isOperationSuccess) {
      //  successCallback(resObj.message);
      //} else {
      //  failureCallback(resObj.message);
      //}
    });
}

export default makeRestore;

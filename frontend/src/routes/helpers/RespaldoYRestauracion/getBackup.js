import addHeaderAuth from '../Auth/AuthPostBasis'

/**
  * La función getBackup se encarga de ejecutar una Request al servidor con la
  * cual se obtendrá el archivo de respaldo de la base de datos y los archivos
  * de media dentro de un archivo comprimido de tipo .zip.
  *
  * @params {*} token
  * **/
const getBackup = (token) => {
  let get = {
    method: 'GET',
    headers: {
    }
  };

  /**
    * La función getFilenameFromHeader se encarga de obtener y limpiar el
    * nombre del archivo tal cual y como se encuentra en el lado del servidor.
    *
    * @param header
    * @returns String \n
    * El nombre del archivo en formato de string.
    * **/
  function getFilenameFromHeader(header) {
    let filename = 'backupFile.zip';
    if(header && header.indexOf('attachment') !== -1) {
      let filenameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/;
      let matches = filenameRegex.exec(header);
      if (matches != null && matches[1]) {
        filename = matches[1].replace(/['"]/g, '');
      }
    }
    return filename;
  }

  get = addHeaderAuth(token, get);
  const url = "http://localhost:8000/respaldo/make-backup";
  fetch(url, get)
    .then(async response => ({
      filename: getFilenameFromHeader(response.headers.get('Content-Disposition')),
      blob: await response.blob()
    }))
    .then(resObj => {
      // El archivo comprimido
      let zipFile = resObj.blob;

      let link = document.createElement('a'); // Se crea un elemento ancla en el doc
      link.href = window.URL.createObjectURL(zipFile); // Se agrega la referencia al tag
      document.body.appendChild(link); // Se agrega el ancla al cuerpo del body
      link.download = resObj.filename; // Se le da un nombre por defecto al archivo a descargar
      link.click(); // Se ejecuta clic sobre el elemento ancla de forma automatica
    })
    .catch((error) => {
      console.log('Error en la descarga: ', error);
    });
}
export default getBackup;

import addHeaderAuth from '../Auth/AuthPostBasis'

const getDataSheet = (token) => {
  let get = {
    method: 'GET',
    headers: {
    }
  }

  function getFilenameFromHeader(header) {
    let filename = 'Reporte_de_entregas_del_sistema_SGC.xlsx';
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
  const url = "http://localhost:8000/exportar/make-datasheet";
  fetch(url, get)
    .then(async response => ({
      filename: getFilenameFromHeader(response.headers.get('Content-Disposition')),
      blob: await response.blob()
    }))
    .then(resObj => {
      let sheetFile = resObj.blob;

      let link = document.createElement('a');
      link.href = window.URL.createObjectURL(sheetFile);
      document.body.appendChild(link);
      link.download = resObj.filename;
      link.click();
    })
    .catch(error => {
      console.log('Error en la descarga: ', error);
    });
}
export default getDataSheet;

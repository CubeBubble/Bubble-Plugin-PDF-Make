async function(properties, context) {
  var PdfPrinter = require("pdfmake");

  const generatePDF = async () => {
    return new Promise((resolve, reject) => {
      var fonts = {
        Courier: {
          normal: "Courier",
          bold: "Courier-Bold",
          italics: "Courier-Oblique",
          bolditalics: "Courier-BoldOblique",
        },
        Helvetica: {
          normal: "Helvetica",
          bold: "Helvetica-Bold",
          italics: "Helvetica-Oblique",
          bolditalics: "Helvetica-BoldOblique",
        },
        Times: {
          normal: "Times-Roman",
          bold: "Times-Bold",
          italics: "Times-Italic",
          bolditalics: "Times-BoldItalic",
        },
        Symbol: {
          normal: "Symbol",
        },
        ZapfDingbats: {
          normal: "ZapfDingbats",
        },
      };

      let printer = new PdfPrinter(fonts);
      let documentDefinition = JSON.parse(properties.definition);

      const stream = printer.createPdfKitDocument(documentDefinition);
      const chunks = [];

      stream.on("data", (chunk) => {
        chunks.push(chunk);
      });

      stream.on("end", () => {
        const blob = new Blob(chunks, { type: "application/pdf" });
        resolve(blob);
      });

      stream.end();
    });
  };

  try {
    const blob = await generatePDF();
    let formData = new FormData();
    formData.append("", blob, properties.fileName + ".pdf");
    const url = properties.websiteHomeUrl + "fileupload";

    var requestOptions = {
      method: "POST",
      body: formData,
    };

    const response = await fetch(url, requestOptions);
    const body = await response.text();
    const file = body.split('"')[1];
    return {
      file: file,
    };
  } catch (error) {
    throw error;
  }
}
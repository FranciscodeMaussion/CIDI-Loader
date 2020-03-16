// content.js
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.message == "chooseFile") {
    /* Creates an `input[type="file]` */
    var fileChooser = document.createElement('input');
    fileChooser.type = 'file';

    fileChooser.addEventListener('change', function () {
      console.log("file change");
      var file = fileChooser.files[0];

      var reader = new FileReader();
      reader.onload = function(){
        var data = reader.result;
        var NOTAS = $.csv.toArrays(data)
        var CANTIDAD_NOTAS = 2;

        var DESDE = 6; // la primera nota es el 6, la ultima es el 12. Cambiar deacuerdo a esa situacion. El casillero a cargar (en el cidi)
        var tabla_tbody = $("#tblNotasTrimestre").children()[1]; // Devuelve el tbody con todos los alumnos y sus notas
        var alumnos = tabla_tbody.children; // Todos los alumnos
        var alumno;
        var documento;
        var notas;
        var __slice = Array.prototype.slice;
        for (var i = 0; i < alumnos.length; i++) {
          alumno = alumnos[i];
          documento = alumno.children[2].firstElementChild.firstElementChild.textContent;
          notas = __slice.call(alumno.children, DESDE, DESDE+CANTIDAD_NOTAS); // array de td con select con notas
          console.log(documento);
          if (documento == NOTAS[i][0]) {
            for (var j = 0; j < notas.length; j++) {
              console.log(notas[j].firstElementChild.selectedIndex); // nota
              notas[j].firstElementChild.selectedIndex = NOTAS[i][j+1] // +1 por el doc
            }
          } else{
            console.log("Error, el orden de los doc es incorrecto");
          }
        }
        //fields = $.parseJSON(data);
        // now send the message to the background
        chrome.runtime.sendMessage({message: "import", fields: NOTAS}, function(response) {
          console.log(response.response);
        });
      };
      reader.readAsText(file);
      form.reset();   // <-- Resets the input so we do get a `change` event,
      //     even if the user chooses the same file
    });

    /* Wrap it in a form for resetting */
    var form = document.createElement('form');
    form.appendChild(fileChooser);

    fileChooser.click();
    sendResponse({response: "fileChooser clicked"});
  }

});

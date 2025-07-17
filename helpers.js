function limpiarTextoDeIa(texto) {
   txtArray = texto.split("**");
   txtResultado = "";
   if(txtArray.length == 1 ) {
        return saltosDeLinea(texto);
   }
   for(i=0; i<txtArray.length; i++) {
        if (i == 0) {
            txtResultado += txtArray[i];
        } else {
             if(i%2 == 1) {
                txtResultado +=  "<b>" + txtArray[i];
            } else {
                txtResultado += "</b>" + txtArray[i];
            }
        }
       
   }
   return saltosDeLinea(txtResultado);
}


function saltosDeLinea(texto) {
   return texto.split("{").join("{ <br> ").split("}").join("<br> } <br>").split("//").join("// <br>").split(";").join("; <br>").split("*").join("<br>*").split("```").join("<br>");

   
}


/*Obtención de token para peticiones*/
let token = localStorage.getItem("token");

/*Creacion de Headers para peticiones*/
let headersCreado = new Headers();
headersCreado.append("Authorization", "Bearer " + token);
headersCreado.append("Content-type", "application/json");
headersCreado.append("Access-Control-Allow-Origin", "*")

export const headers = headersCreado;

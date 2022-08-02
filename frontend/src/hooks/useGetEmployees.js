import { headers } from "../containers/headers/headers";

/*Hook para obtener la data de cada usuario*/

export const useGetEmployees = async (idWorker) => {

    const requestOptions = {
        method: 'GET',
        headers: headers,
    }

    const ruta = `http://${document.domain}:4001/api/worker/info/` + idWorker;

    const res = await fetch(ruta, requestOptions);
    const data = await res.json();

    return data[0];
}


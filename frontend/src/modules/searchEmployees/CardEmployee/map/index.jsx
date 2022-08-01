import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from "react-leaflet";
import 'leaflet/dist/leaflet.css';


const MapWorkerView = ({ direccion_cliente, direccion_trabajador, nombre_trabajador }) => {

    console.log('direccion_cliente', direccion_cliente)


    let [state, setState] = useState({
        lat: null,
        lng: null
    })


    let [coordsCliente, setCoordsCliente] = useState({
        lat: null,
        lng: null
    })


    let [coordsTrabajador, setCoordTrabajador] = useState({
        lat: null,
        lng: null
    })


    const getCoords = () => {

        console.log(typeof direccion_cliente)

        let latTrabajador = direccion_trabajador.split(',')[0].split('(')[1]
        let lngTrabajador = direccion_trabajador.split(',')[1].split(')')[0]

        let latCliente = direccion_cliente.split(',')[0].split('(')[1]
        let lngCliente = direccion_cliente.split(',')[1].split(')')[0]

        setCoordTrabajador({
            lat: latTrabajador,
            lng: lngTrabajador
        })

        setCoordsCliente({
            lat: latCliente,
            lng: lngCliente
        })

    }

    useEffect(() => {
        getCoords()
    }, [])

    const LocationMarkerClient = () => {
        const map = useMapEvents({

        })

        useEffect(() => {

            map.flyTo(coordsCliente)

        }, [])
        return (

            <Marker position={coordsCliente} >
                <Popup>Tú estás aquí</Popup>
            </Marker>
        )
    }

    const LocationMarkerWorker = () => {
        return (

            <Marker position={coordsTrabajador} >
                <Popup>{nombre_trabajador} está aquí</Popup>
            </Marker>
        )
    }




    return (
        <MapContainer center={state} zoom={12}>
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            <LocationMarkerClient />
            <div className="direccion_trabajador">
                <LocationMarkerWorker />
            </div>
        </MapContainer>
    )
}

export default MapWorkerView;
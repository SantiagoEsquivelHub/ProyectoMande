import React, { useEffect, useState, useCallback } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from "react-leaflet";
import 'leaflet/dist/leaflet.css';
import './map.css';



const MapView = ({ setDatosCliente, datosCliente, setDatosTrabajador, datosTrabajador }) => {

    let [state, setState] = useState({
        lat: null,
        lng: null
    })

    const compareinfo = (e) => {
        if (setDatosTrabajador == undefined && datosTrabajador == undefined) {
            setDatosCliente({
                ...datosCliente,
                direccion_residencia_cliente: `(${e.lat}, ${e.lng})`
            })
        } else if (setDatosCliente == undefined && datosCliente == undefined) {
            setDatosTrabajador({
                ...datosTrabajador,
                direccion_residencia_trabajador: `(${e.lat}, ${e.lng})`
            })
        }
    }

    const compareInfoCallBack = useCallback(() => {

        if (setDatosTrabajador == undefined && datosTrabajador == undefined) {
            setDatosCliente({
                ...datosCliente,
                direccion_residencia_cliente: `(${state.lat}, ${state.lng})`
            })
        } else if (setDatosCliente == undefined && datosCliente == undefined) {
            setDatosTrabajador({
                ...datosTrabajador,
                direccion_residencia_trabajador: `(${state.lat}, ${state.lng})`
            })
        }
    })

    function LocationMarker() {


        const map = useMapEvents({
            click(e) {
               
                setState(
                    e.latlng
                );

                compareinfo(e.latlng)

                map.flyTo(e.latlng);

            }
        })

        useEffect(() => {

            map.flyTo(state)

        }, [])


        return (

            <Marker position={state} >
                <Popup>Tú estás aquí</Popup>
            </Marker>
        )
    }

    const getCurrentPosition = () => {
        navigator.geolocation.getCurrentPosition(
            function (position) {

                let localizacion = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude,
                }
               
                setState(localizacion);
                if (setDatosTrabajador == undefined && datosTrabajador == undefined) {
                    setDatosCliente({
                        ...datosCliente,
                        direccion_residencia_cliente: `(${localizacion.lat}, ${localizacion.lng})`
                    })
                } else if (setDatosCliente == undefined && datosCliente == undefined) {
                    setDatosTrabajador({
                        ...datosTrabajador,
                        direccion_residencia_trabajador: `(${localizacion.lat}, ${localizacion.lng})`
                    })
                }
                //state = localizacion

                console.log("position.coords", position.coords)
                console.log("state despues", state)
            },
            function (error) {
                console.error("Error Code = " + error.code + " - " + error.message);
            },
            {
                enableHighAccuracy: true,
            }
        );
    }



    useEffect(() => {
      
        //compareInfoCallBack();
        getCurrentPosition()

    }, []);


    return (
        <MapContainer center={state} zoom={17}
            whenReady={() => {

            }}
            whenCreated={() => {

            }}>
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            <LocationMarker />
        </MapContainer>
    )
}

export default MapView;
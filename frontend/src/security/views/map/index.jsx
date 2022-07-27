import React, { useEffect, useState, useCallback } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from "react-leaflet";
import 'leaflet/dist/leaflet.css';
import './map.css';



const MapView = ({ setDatosCliente, datosCliente, setDatosTrabajador, datosTrabajador }) => {

    const [state, setState] = useState({
        lat: 3.3758343361732397,
        lng: -76.52997526101733
    })

    const compareinfo = () => {
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
    }

    function LocationMarker() {

    
        const map = useMapEvents({
            click(e) {
                //setPosition(e.latlng);
                console.log(e.latlng)
                setState(
                    e.latlng
                );

                compareinfo()

                map.flyTo(e.latlng);
                console.log(e.latlng)
            }, load() {
                console.log('cague')
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
                //console.log(position);
                setState({
                    lat: position.coords.latitude,
                    lng: position.coords.longitude,

                });
                //compareinfo()

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
        getCurrentPosition()
    }, []);


    return (
        <MapContainer center={state} zoom={17}
            whenReady={() => {
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
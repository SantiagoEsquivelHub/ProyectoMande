import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from "react-leaflet";
import 'leaflet/dist/leaflet.css';
import './map.css';



const MapView = () => {

    const [state, setState] = useState({
        lat: 0,
        lng: 0
    })

    //const [position, setPosition] = useState([3.375864823339008, -76.52989561728656])

    function LocationMarker() {

        const map = useMapEvents({
            click(e) {
                //setPosition(e.latlng);
                console.log(e.latlng)
                setState(
                    e.latlng
                );
                map.flyTo(e.latlng);
                localStorage.setItem("position", e.latlng);
                console.log(e.latlng)
            },

        })

        useEffect(() => {
            map.flyTo(state)
        }, [])


        return (
            <Marker position={state}>
                <Popup>Tú estás aquí</Popup>
            </Marker>
        )
    }

    const getCurrentPosition = () => {
        navigator.geolocation.getCurrentPosition(
            function (position) {
                console.log(position);
                setState({
                    lat: position.coords.latitude,
                    lng: position.coords.longitude,

                });

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
        <MapContainer center={state} zoom={17}>
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            <LocationMarker />
        </MapContainer>
    )
}

export default MapView;
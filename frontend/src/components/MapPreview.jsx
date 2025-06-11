import React from "react";
import { MapContainer, TileLayer, Marker, Polyline, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { Box } from "@chakra-ui/react";

const MapPreview = ({ route = [] }) => (
  <Box w="100%" h="100%">
    <MapContainer center={route[0] || [10.7769, 106.7009]} zoom={10} style={{ height: "100%", width: "100%" }}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution="&copy; OpenStreetMap contributors"
      />
      {route.length > 0 && (
        <>
          <Polyline positions={route} color="blue" />
          {route.map((pos, idx) => (
            <Marker key={idx} position={pos}>
              <Popup>Điểm {idx + 1}</Popup>
            </Marker>
          ))}
        </>
      )}
    </MapContainer>
  </Box>
);

const getRoute = async (start, end) => {
  const apiKey = "YOUR_API_KEY";
  const url = `https://api.openrouteservice.org/v2/directions/driving-car?api_key=${apiKey}&start=${start[1]},${start[0]}&end=${end[1]},${end[0]}`;
  const res = await fetch(url);
  const data = await res.json();
  // data.features[0].geometry.coordinates là mảng [lng, lat]
  // Chuyển thành [lat, lng] cho leaflet
  return data.features[0].geometry.coordinates.map(([lng, lat]) => [lat, lng]);
}

export default MapPreview; 
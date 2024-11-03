import React, { useState } from "react";
import { GiHamburgerMenu } from "react-icons/gi";
import { IoIosArrowDropdownCircle } from "react-icons/io";
// Leaflet imports
import "leaflet/dist/leaflet.css";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polyline,
} from "react-leaflet";

const mapboxToken = import.meta.env.VITE_MAPBOX_TOKEN; // Access the token from the environment variable

const Home = () => {
  const [departure, setDeparture] = useState("");
  const [destination, setDestination] = useState("");
  const [departureCoords, setDepartureCoords] = useState(null);
  const [destinationCoords, setDestinationCoords] = useState(null);
  const [departureSuggestions, setDepartureSuggestions] = useState([]);
  const [destinationSuggestions, setDestinationSuggestions] = useState([]);
  const [showMarkers, setShowMarkers] = useState(false); // New state to control marker display
  const [routeCoordinates, setRouteCoordinates] = useState([]); // State to store route coordinates

  // Fetch autocomplete suggestions from Mapbox
  const fetchSuggestions = async (query, setSuggestions) => {
    if (!query) return setSuggestions([]);
    const response = await fetch(
      `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
        query
      )}.json?access_token=${mapboxToken}&autocomplete=true&limit=5`
    );
    const data = await response.json();
    setSuggestions(
      data.features.map((feature) => ({
        place_name: feature.place_name,
        center: feature.center,
      }))
    );
  };

  const handleDepartureSelect = (suggestion) => {
    {
      console.log(suggestion.place_name);
    }
    {
      console.log(suggestion.center);
    }
    setDeparture(suggestion.place_name);
    setDepartureCoords([suggestion.center[1], suggestion.center[0]]);
    setDepartureSuggestions([]); // Clear suggestions after selecting
  };

  const handleDestinationSelect = (suggestion) => {
    {
      console.log(suggestion.place_name);
    }
    {
      console.log(suggestion.center);
    }
    setDestination(suggestion.place_name);
    setDestinationCoords([suggestion.center[1], suggestion.center[0]]);
    setDestinationSuggestions([]); // Clear suggestions after selecting
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Set showMarkers to true only when search is clicked
    console.log(showMarkers);
    console.log(departureCoords);
    console.log(destinationCoords);

    setShowMarkers(true);

    // Fetch route between departure and destination using Mapbox Directions API
    const response = await fetch(
      `https://api.mapbox.com/directions/v5/mapbox/driving/${departureCoords[1]},${departureCoords[0]};${destinationCoords[1]},${destinationCoords[0]}?geometries=geojson&access_token=${mapboxToken}`
    );
    const data = await response.json();
    console.log(data);

    // Extract route coordinates from the response
    const route = data.routes[0].geometry.coordinates.map((coord) => [
      coord[1],
      coord[0],
    ]);
    setRouteCoordinates(route); // Store the route coordinates for rendering
  };

  return (
    <div className="flex flex-col justify-center h-full">
      <div className="flex items-center sticky top-0 justify-between h-14 mt-1 mx-2 p-4 bg-blue-400 rounded-md bg-clip-padding backdrop-filter backdrop-blur-sm bg-opacity-50 border border-gray-100">
        <div>Drop</div>
        <div className="hidden sm:flex">Choose a zebi</div>

        <div className="flex flex-row justify-between items-center">
          <div className="flex bg-slate-500 h-10 rounded-badge items-center me-2 p-1">
            there
          </div>
          <div className="me-1">Jone Doe</div>
          <div className="md:hidden">
            <GiHamburgerMenu className="text-3xl" />
          </div>
          <div className="hidden md:flex">
            <IoIosArrowDropdownCircle className="text-3xl" />
          </div>
        </div>
      </div>

      <div className="flex flex-col h-full md:flex-row justify-evenly m-2 p-2 bg-green-600">
        <section className="flex flex-col justify-start bg-yellow-400 md:m-12">
          <div className="text-2xl md:text-4xl text-gray-900 font-bold">
            The title
          </div>
          <div className="ms-3 md:m-4 md:p-5">
            <form
              onSubmit={handleSubmit}
              className="flex flex-col space-y-2 items-center md:min-w-11"
            >
              {/* Departure Input and Suggestions */}
              <div className="relative w-full max-w-xs">
                <input
                  type="text"
                  placeholder="lieu de depart"
                  className="input input-bordered w-full"
                  value={departure}
                  onChange={(e) => {
                    setDeparture(e.target.value);
                    fetchSuggestions(e.target.value, setDepartureSuggestions);
                  }}
                />
                {departureSuggestions.length > 0 && (
                  <div className="suggestions-dropdown absolute top-full left-0 w-full bg-white shadow-lg z-10">
                    {departureSuggestions.map((suggestion, index) => (
                      <div
                        key={index}
                        onClick={() => handleDepartureSelect(suggestion)}
                        className="suggestion-item p-2 cursor-pointer hover:bg-gray-200"
                      >
                        {suggestion.place_name}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Destination Input and Suggestions */}
              <div className="relative w-full max-w-xs">
                <input
                  type="text"
                  placeholder="destination"
                  className="input input-bordered w-full"
                  value={destination}
                  onChange={(e) => {
                    setDestination(e.target.value);
                    fetchSuggestions(e.target.value, setDestinationSuggestions);
                  }}
                />
                {destinationSuggestions.length > 0 && (
                  <div className="suggestions-dropdown absolute top-full left-0 w-full bg-white shadow-lg z-10">
                    {destinationSuggestions.map((suggestion, index) => (
                      <div
                        key={index}
                        onClick={() => handleDestinationSelect(suggestion)}
                        className="suggestion-item p-2 cursor-pointer hover:bg-gray-200"
                      >
                        {suggestion.place_name}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <button className="btn btn-outline w-3/4 md:w-full sm:w-1/2">
                Search
              </button>
            </form>
          </div>
        </section>

        {/* Map Container */}
        <div className="bg-orange-500 flex-grow">
          <MapContainer
            center={[45.5927, -73.5994]}
            zoom={13}
            style={{ height: "100%", width: "100%" }}
          >
            <TileLayer
              url={`https://api.mapbox.com/styles/v1/mapbox/streets-v11/tiles/{z}/{x}/{y}?access_token=${mapboxToken}`}
              attribution='&copy; <a href="https://www.mapbox.com/about/maps/">Mapbox</a> contributors'
            />

            <Marker position={[45.6352, -73.609821]}>
              <Popup>Montréal-Nord, Canada</Popup>
            </Marker>

            {/* Show markers only if showMarkers is true */}
            {showMarkers && departureCoords && (
              <Marker position={departureCoords}></Marker>
            )}
            {showMarkers && destinationCoords && (
              <Marker position={destinationCoords}></Marker>
            )}

            {/* Draw the route as a Polyline */}
            {routeCoordinates.length > 0 && (
              <Polyline positions={routeCoordinates} color="blue" />
            )}
          </MapContainer>
        </div>
      </div>

      {/* Styles for the suggestions dropdown */}
      <style jsx>{`
        .suggestions-dropdown {
          position: absolute;
          border: 1px solid #ddd;
          background: white;
          max-width: 100%;
          width: 100%;
          z-index: 1000;
        }
        .suggestion-item {
          padding: 8px;
          cursor: pointer;
        }
        .suggestion-item:hover {
          background-color: #f0f0f0;
        }
      `}</style>
    </div>
  );
};

export default Home;

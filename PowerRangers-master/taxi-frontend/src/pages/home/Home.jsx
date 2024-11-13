import "./Home.css";
import L from "leaflet";
import iamge from "../../../public/icon.jpg";
import { useMap } from "react-leaflet";
import { toast, Toaster } from "react-hot-toast";
import React, { useEffect, useState } from "react";
import { GiHamburgerMenu } from "react-icons/gi";
import { IoIosArrowDropdownCircle } from "react-icons/io";
import "../../../public/economy-car.webp";
import "../../../public/premium-car.webp";
import "../../../public/Lux-car.webp";
// Leaflet imports
import "leaflet/dist/leaflet.css";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polyline,
} from "react-leaflet";
import { useAuthContext } from "../../context/AuthContext";
import PayPalButton from "./components/paypalButton/PaypalButton";
import createRides from "../../api/rides/createRides";
import logout from "../../api/auth/logout";

const mapboxToken = import.meta.env.VITE_MAPBOX_TOKEN; // Access the token from the environment variable

const Home = () => {
  const MapHandler = ({ onMapLoad }) => {
    const map = useMap(); // This hook gives access to the map instance

    useEffect(() => {
      if (onMapLoad) {
        onMapLoad(map);
      }
    }, [map, onMapLoad]);

    return null; // This component doesn't render anything itself
  };
  const [mapInstance, setMapInstance] = useState(null);
  const handleMapLoad = (map) => {
    setMapInstance(map);
  };

  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    console.log(isOpen);

    setIsOpen(!isOpen);
  };

  const [departure, setDeparture] = useState("");
  const [destination, setDestination] = useState("");
  const [time, setTime] = useState("");
  const [departureCoords, setDepartureCoords] = useState(null);
  const [destinationCoords, setDestinationCoords] = useState(null);
  const [departureSuggestions, setDepartureSuggestions] = useState([]);
  const [destinationSuggestions, setDestinationSuggestions] = useState([]);
  const [showMarkers, setShowMarkers] = useState(false); // New state to control marker display
  const [routeCoordinates, setRouteCoordinates] = useState([]); // State to store route coordinates
  const [routeDriverToDeparture, setRouteDriverToDeparture] = useState([]);
  const [rideOptions, setRideOptions] = useState([]); // State to store ride options

  const [rideData, setRideData] = useState([]);
  // State to track the selected item
  const [selectedKey, setSelectedKey] = useState(null);

  const [driverCoords, setDriverCoords] = useState([45.514919, -73.559753]);
  const [showDriverMarker, setShowDriverMarker] = useState(false);
  const [showDriverRoute, setShowDriverRoute] = useState(false);
  const [showTrajectRoute, setShowTrajectRoute] = useState(false);

  const [routeColor, setRouteColor] = useState("blue");
  const logRides = () => {
    console.log(rideOptions);
  };

  // for the info that
  const { authUser, setAuthUser } = useAuthContext();

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

    if (!destination || !departure || !time) {
      setRideOptions([]);
      setShowMarkers(false);
      setRouteCoordinates([]);
      setShowTrajectRoute(false);

      return toast.error("Please fill the addresses first !");
    }

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
    setShowTrajectRoute(true);

    // Fetch and store routes
    const responseDriverToDeparture = await fetch(
      `https://api.mapbox.com/directions/v5/mapbox/driving/${driverCoords[1]},${driverCoords[0]};${departureCoords[1]},${departureCoords[0]}?geometries=geojson&access_token=${mapboxToken}`
    );
    const dataDriverToDeparture = await responseDriverToDeparture.json();
    console.log(dataDriverToDeparture);

    const routeDriverToDeparture =
      dataDriverToDeparture.routes[0].geometry.coordinates.map((coord) => [
        coord[1],
        coord[0],
      ]);
    setRouteDriverToDeparture(routeDriverToDeparture);

    const res = await fetch("http://127.0.0.1:8000/calculate_pricing/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        departureCoords: departureCoords,
        destinationCoords: destinationCoords,
        // vehicle_type: vehicleType,
        time: time,
      }),
    });

    const option_info = await res.json();
    console.log(option_info);

    setRideOptions(option_info); // Set the ride options
  };

  const handleChoice = (e) => {
    // setIsClicked(!isClicked);
    setSelectedKey(e["key"]);

    // console.log(userData);
    console.log(authUser.email);

    // the userId, departure, destination, rideType, time, eta, price

    setRideData({
      userEmail: authUser.email,
      departure_adress: departure ? departure : "",
      departure_coord: departureCoords ? [departureCoords] : "",
      destination_adress: destination ? destination : "",
      destination_coord: destinationCoords ? destinationCoords : "",
      rideType: e["key"] ? e["key"] : "",
      eta: e.option.estimated_wait_time ? e.option.estimated_wait_time : null, // minutes : int
      arrival_time: e.option.arrival_time, // exact time
      price: e.option.estimated_price, // price : float
    });

    console.log(rideData);
    // console.log(JSON.parse(rideData));

    // animateFullRoute(
    //   mapInstance,
    //   driverCoords,
    //   departureCoords,
    //   destinationCoords
    // );

    // when the driver is selected we show the driver route and hide the traject route
    setShowTrajectRoute(false);
    setShowDriverRoute(true);
    setShowDriverMarker(true);
  };

  const animateMarkerAlongRoute = (
    mapInstance,
    routeCoordinates,
    speed = 500,
    callback
  ) => {
    try {
      if (!mapInstance || routeCoordinates.length === 0) {
        console.error("Map instance or route coordinates are not provided.");
        return;
      }

      // Initialize the marker at the starting point
      let currentStep = 0;
      const totalSteps = routeCoordinates.length;
      let movingMarker = L.marker(routeCoordinates[0]).addTo(mapInstance);

      // Function to move the marker at regular intervals
      const interval = setInterval(() => {
        if (currentStep >= totalSteps) {
          clearInterval(interval);
          console.log("Marker has reached the destination.");
          if (callback) callback(); // Start the next segment if a callback is provided
          return;
        }

        // Update the marker's position to the next coordinate
        movingMarker.setLatLng(routeCoordinates[currentStep]);
        currentStep++;
      }, speed); // Adjusted the speed for a smoother animation
    } catch (error) {
      console.log("Error in animating marker:", error);
    }
  };

  // Function to animate the entire journey in two segments
  const animateFullRoute = (
    mapInstance,
    driverCoords,
    departureCoords,
    destinationCoords
  ) => {
    try {
      console.log("Animating from driver to user's departure");

      // Animate the first segment (driver to user's departure)
      animateMarkerAlongRoute(mapInstance, routeDriverToDeparture, 1000, () => {
        console.log("Driver has arrived at the user's departure");
        toast.success("The driver has arrived at your door step !");
        setShowTrajectRoute(true);
        setShowDriverRoute(false);
        setShowDriverMarker(false);

        // Add a 10-second timeout before starting the next animation
        setTimeout(() => {
          console.log(
            "Starting animation from user's departure to destination"
          );
          animateMarkerAlongRoute(mapInstance, routeCoordinates, 1000, () => {
            toast.success("You have reached your destination !");
            setShowTrajectRoute(false);
            setShowDriverRoute(false);
            setShowMarkers(false);
            window.location.href = "/history"; // Replace "/new-path" with the desired URL or path
          });
        }, 10000); // 10,000 milliseconds = 10 seconds
      });
    } catch (error) {
      console.log("Error in animating full route:", error);
    }
  };

  const glassmorph =
    "bg-white-400 rounded-md bg-clip-padding backdrop-filter backdrop-blur-2xl bg-opacity-10  border-gray-100";
  return (
    <div className="flex flex-col justify-center h-full page">
      <div
        className={` z-[10000] flex items-center sticky top-0 justify-between h-14 mx-2 p-4 mt-7 rounded-lg bg-clip-padding backdrop-filter backdrop-blur-sm bg-opacity-50 border border-gray-100
      
      ${glassmorph}`}
      >
        <div className="text-2xl text-white font-bold">Drop</div>
        <div className="hidden sm:flex text-2xl text-white font-bold">
          Hey {authUser?.username || "Guest"}
        </div>

        <div className="flex flex-row justify-between items-center">
          <div className="menu-container">
            {!isOpen && (
              <>
                <div
                  className=" md:flex text-white dropdown-hover"
                  onClick={toggleMenu}
                >
                  <GiHamburgerMenu className="text-3xl" />
                </div>
              </>
            )}
            {isOpen && (
              <div className="dropdown">
                <button onClick={toggleMenu} className="close-button">
                  X
                </button>
                <ul>
                  <li
                    onClick={() => {
                      window.location.href = "/profile";
                    }}
                  >
                    Settings
                  </li>
                  <li
                    onClick={() => {
                      window.location.href = "/history";
                    }}
                  >
                    History
                  </li>
                  <li
                    onClick={() => {
                      logout();
                    }}
                  >
                    Logout
                  </li>
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="flex flex-col h-full md:flex-row justify-evenly m-2 p-2">
        <section className="flex flex-col justify-start md:m-12">
          <div className="text-2xl md:text-4xl text-gray-900 font-bold">
            Enter the address
          </div>
          <div className="ms-3 md:m-4 md:p-5">
            <form
              onSubmit={handleSubmit}
              className="flex flex-col space-y-3 items-center md:min-w-11"
            >
              {/* Departure Input and Suggestions */}
              <div className="relative w-full max-w-xs">
                <input
                  type="text"
                  placeholder="Departure"
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
                  placeholder="Destination"
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
                <input
                  type="time" // Set the type to "time"
                  placeholder="Select time"
                  className="input input-bordered w-full mt-3"
                  value={time}
                  onChange={(e) => setTime(e.target.value)} // Update state with selected time
                />
              </div>

              <button className="btn btn-outline w-3/4 md:w-full sm:w-1/2">
                Search
              </button>
            </form>
          </div>
          {/* Ride options */}
          <div className="p-4 pb-0">
            {Object.keys(rideOptions).length > 0 && (
              <div>
                <h2 className="text-xl font-bold mb-2">
                  Choisissez une course
                </h2>
                {Object.entries(rideOptions).map(([key, option]) => (
                  <div
                    key={key}
                    className={`cursor-pointer flex justify-between items-center p-4 border border-gray-300 rounded-lg mb-2 
                      hover:bg-violet-500 ${
                        selectedKey === key ? "bg-violet-600" : "bg-white"
                      }
                      focus:outline-none focus:ring focus:ring-violet-300`}
                    onClick={() => handleChoice({ key, option })}
                  >
                    {console.log("choice clicked")}
                    <div className="flex items-center">
                      <img
                        src={
                          key === "economy"
                            ? "/economy-car.webp"
                            : key === "premium"
                            ? "/premium-car.webp"
                            : key === "luxury"
                            ? "/Lux-car.webp"
                            : ""
                        }
                        alt={`${key} car`}
                        className="w-12 h-12 mr-4 avatar"
                      />
                      <div>
                        <div className="font-bold">
                          {key.charAt(0).toUpperCase() + key.slice(1)}
                        </div>
                        <div className="text-sm text-gray-600">
                          {option.details}
                        </div>
                        <div className="text-sm">
                          Dans {option.estimated_wait_time} mins •{" "}
                          {option.distance_km} km
                        </div>
                      </div>
                    </div>
                    <div className="font-bold text-lg">
                      {option.estimated_price} $CA
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* payment option  */}
          {Object.keys(rideOptions).length > 0 && (
            <>
              <PayPalButton
                amount={rideData.price}
                onSuccess={async (details) => {
                  toast.success(
                    "Transaction completed by " + details.payer.name.given_name
                  );

                  // Only create ride after successful payment
                  try {
                    // await createRides(rideData);
                    toast.success("Ride created successfully!");

                    setRideOptions([]);
                    // Clear previous markers and add new ones for the driver and user.
                    setShowMarkers(false);
                    // setRouteCoordinates([]); // Clear previous route

                    setShowMarkers(true);
                    animateFullRoute(
                      mapInstance,
                      driverCoords,
                      departureCoords,
                      destinationCoords
                    );
                  } catch (error) {
                    toast.error("Failed to create ride. Please try again.");
                  }

                  // Redirect to a different page or perform any other state updates
                  // handleConfirm(); // Replace with your desired path
                }}
              />
            </>
          )}
        </section>

        {/* Map Container */}
        <div className="bg-orange-500 flex-grow min-h-[280px]">
          <MapContainer
            center={[45.5927, -73.5994]}
            zoom={13}
            style={{ height: "100%", width: "100%" }}
          >
            <TileLayer
              url={`https://api.mapbox.com/styles/v1/mapbox/streets-v11/tiles/{z}/{x}/{y}?access_token=${mapboxToken}`}
              attribution='&copy; <a href="https://www.mapbox.com/about/maps/">Mapbox</a> contributors'
            />
            <MapHandler onMapLoad={handleMapLoad} />

            {/* <Marker position={[45.6352, -73.609821]}>
              <Popup>Montréal-Nord, Canada</Popup>
            </Marker> */}

            {/* Show markers only if showMarkers is true */}
            {/* {showMarkers && departureCoords && (
              <Marker position={departureCoords}></Marker>
            )}
            {showMarkers && destinationCoords && (
              <Marker position={destinationCoords}></Marker>
            )} */}

            {/* Draw the route as a Polyline */}
            {/* {routeCoordinates.length > 0 && (
              <Polyline positions={routeCoordinates} color="blue" />
            )} */}

            {showDriverMarker && (
              <Marker position={driverCoords}>
                <Popup>Driver Location</Popup>
              </Marker>
            )}

            {showMarkers && departureCoords && (
              <Marker position={departureCoords}>
                <Popup>User Departure</Popup>
              </Marker>
            )}

            {showMarkers && destinationCoords && routeColor === "red" && (
              <Marker position={destinationCoords}>
                <Popup>Destination</Popup>
              </Marker>
            )}

            {showTrajectRoute && (
              <Polyline positions={routeCoordinates} color={"red"} />
            )}

            {showDriverRoute && (
              <Polyline positions={routeDriverToDeparture} color={"blue"} />
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

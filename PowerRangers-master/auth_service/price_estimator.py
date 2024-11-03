from flask import Flask, request, jsonify
from flask_cors import CORS
from geopy.geocoders import Nominatim
from geopy.distance import geodesic
import random
from datetime import datetime

app = Flask(__name__)

# Enable CORS for Flask
CORS(app)

geolocator = Nominatim(user_agent="drop")

@app.route("/calculate_pricing/", methods=["POST"])
async def calculate_pricing():
    try:
        # Get JSON data from the request
        data = request.get_json()
        
        # Extract parameters from JSON
        start_location = data.get("departureCoords")
        end_location = data.get("destinationCoords")
        time_str = data.get("time")
        print(start_location, end_location, time_str)
        print(start_location[0], end_location[0], time_str)

        if not start_location or not end_location or time_str is None:
            return jsonify({"error": "Missing required fields"}), 400
        
        time_obj  = datetime.strptime(time_str, "%H:%M")
        current_hour = time_obj.hour
        print(current_hour)


        # the adresses will be sent in cooediantes 

        # # Geocode the addresses
        # start_location = geolocator.geocode(start_address, timeout=50)
        # end_location = geolocator.geocode(end_address, timeout=50)

        # if not start_location or not end_location:
        #     return jsonify({"error": "Unable to geocode one or both addresses"}), 400

        # Calculate distance in kilometers
        start_coords = (start_location[0], start_location[1])
        end_coords = (end_location[0], end_location[1])
        distance_km = geodesic(start_coords, end_coords).kilometers

        # Define base rates for each vehicle type
        base_rates = {
            "economy": 1.5,
            "premium": 2.25,
            "luxury": 3.0
        }

        results = {}

        for vehicle_type, base_rate in base_rates.items():
            # Adjust for peak hours
            if 7 <= current_hour <= 9 or 17 <= current_hour <= 19:
                base_rate *= 1.2  # 20% increase for peak hours

            # Calculate final price
            estimated_price = base_rate * distance_km

            # Random wait time
            estimated_wait_time = random.randint(5, 15)

            # Add the results for each vehicle type
            results[vehicle_type] = {
                "estimated_price": round(estimated_price, 2),
                "estimated_wait_time": estimated_wait_time,
                "distance_km": round(distance_km, 2),
                "details": ""
            }

        print(f"The results are: {results}")
        return jsonify(results)

    except Exception as e:
        print(f"An error occurred: {e}")
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, port=8000)

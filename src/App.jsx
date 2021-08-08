import React from "react";
import { Loader } from "@googlemaps/js-api-loader";

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      map: null
    };
  }

  componentDidMount() {
    const loader = new Loader({
      apiKey: process.env.REACT_APP_GOOGLE_API_KEY,
      version: 'weekly',
      libraries: ["places"],
    });

    loader.load().then((google) => {
      const cebu = new google.maps.LatLng(10.370314120057401, 123.82706631655005);
      const infoWindow = new google.maps.InfoWindow();
      const map = new google.maps.Map(document.getElementById("map"), {
        center: cebu,
        zoom: 12,
      });

      let request = {
        location: cebu,
        radius: '500',
        type: ['restaurant']
      };

      this.setState({
        map: map,
        google: google,
        infoWindow: infoWindow
      });

      const service = new google.maps.places.PlacesService(map);
      service.nearbySearch(request, this.nearbySearchFunction.bind(this))
    });
  }

  nearbySearchFunction(results, status) {
    const { google } = this.state;

    if (status === google.maps.places.PlacesServiceStatus.OK) {
      for(let i=0; i < results.length; i++ ) {
        this.createMarker(results[i]);
      }
    }
  }

  createMarker(place) {
    const { map, google, infoWindow } = this.state;

    if (!place.geometry || !place.geometry.location) return;
    const marker = new google.maps.Marker({
      map,
      position: place.geometry.location,
    });
    google.maps.event.addListener(marker, "click", () => {
      infoWindow.setContent(place.name || "");
      infoWindow.open(map);
    });
  }

  render() {
    return(
      <div id="map"></div>
    );
  }
}

export default App;

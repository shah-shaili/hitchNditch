import React from "react";
import { withRouter } from "react-router";

import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import SearchMap from "../components/search-map";
import IconButton from "@material-ui/core/IconButton";
import SendIcon from "@material-ui/icons/Send";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";

class Reserve extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            destination: "",
            location: undefined
        };
    }

    /**
     * Request user's location from the browser and save to state.
     * Component will not display map until location is retrieved.
     */
    componentDidMount() {
        navigator.geolocation.getCurrentPosition((position) => {
            this.setState({
                location: {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude
                }
            });
        });
    }

    /**
     * Changes destination string
     */
    onChange = (event) => {
        this.setState({
            destination: event.target.value
        });
    };

    /**
     * Get first result for this.state.destination and use it
     * as the intended location
     */
    submit = () => {
        // Create a dummy map object since do not need to render map
        const map = new window.google.maps.Map(
            document.getElementById("dummy"),
            {
                center: this.state.location
            }
        );

        // Look up destination query with PlacesService
        // const service = new window.google.maps.places.PlacesService(map);
        const service = new window.google.maps.places.AutocompleteService();
        const request = {
            input: this.state.destination,
            location: new window.google.maps.LatLng(this.state.location.lat, this.state.location.lng),
            radius: 40233.6
        };

        service.getPlacePredictions(request, (results, status) => {
            if (status === window.google.maps.places.PlacesServiceStatus.OK) {
                // Grab first result and pass to next screen
                if (results.length > 0) {
                    this.props.history.push(
                        "/driver-rider",
                        {
                            startLocation: this.state.location,
                            endLocationPlaceId: results[0].place_id
                        }
                    );
                }
                // No results found
                else {
                    alert("Could not find any results");
                }
            }
        });
    };

    render() {
        const firstName = window.localStorage.getItem("name").split(" ")[0];
        const history = window.localStorage.getItem("history")
            ? JSON.parse(window.localStorage.getItem("history"))
            : [];

        return (
            <div>
                <div style={{
                    height: "70vh"
                }}>
                    <SearchMap location={this.state.location} />
                </div>
                <Paper style={{
                    padding: "1rem",
                    height: "30vh",
                    overflowY: "auto"
                }}>
                    <div style={{
                        display: "flex"
                    }}>
                        <TextField
                            autoFocus
                            fullWidth
                            label={`Good morning, ${firstName}`}
                            placeholder="Where would you like to go?"
                            onChange={this.onChange}
                            value={this.state.value}
                            variant="outlined" />
                        <IconButton onClick={this.submit}>
                            <SendIcon />
                        </IconButton>
                    </div>
                    <Typography
                        style={{
                            marginTop: "1rem"
                        }}
                        variant="h6">
                        History
                    </Typography>
                    
                    {
                        history.length > 0
                            ? (
                                <List>
                                    {
                                        history.map((item, index) => {
                                            return (
                                                <ListItem key={index}>
                                                    <ListItemText
                                                        primary={item.name}
                                                        secondary={item.address}/>
                                                </ListItem>
                                            );
                                        })
                                    }
                                </List>
                            )
                            : <Typography>No ride history.</Typography>
                    }
                </Paper>
            </div>
        );
    }
}

export default withRouter(Reserve);
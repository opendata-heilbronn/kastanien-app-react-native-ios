'use strict';

var React = require('react-native');
var {
    AppRegistry,
    MapView,
    StyleSheet,
    Text,
    TextInput,
    View,
    } = React;

var regionText = {
    latitude: '0',
    longitude: '0',
    latitudeDelta: '0',
    longitudeDelta: '0',
};

var MapViewExample = React.createClass({

    getInitialState() {
        return {
            mapRegion: null,
            mapRegionInput: null,
            annotations: null,
            isFirstLoad: true,
        };
    },

    componentDidMount() {
        navigator.geolocation.getCurrentPosition(
            (initialPosition) => this.didGetPosition(initialPosition.coords.latitude, initialPosition.coords.longitude),
            (error) => alert(error.message),
            {enableHighAccuracy: true, timeout: 20000, maximumAge: 1000}
        );
    },

    didGetPosition(latitude, longitude) {
        fetch('http://api.grundid.de/tree/near?latitude=' + latitude + '&longitude=' + longitude+'&treeType=CASTANEA&size=500')
            .then((response) => response.json())
            .then((featurecollection) => {
                var annotations = featurecollection.features.map((feature) => {
                    return {
                        latitude: feature.geometry.coordinates[1],
                        longitude: feature.geometry.coordinates[0],
                        title: feature.properties.deuText+" - "+feature.properties.stUmfang
                    }
                });

                this.setState({annotations});

            })
            .catch((error) => {
                console.warn(error);
            });
    },

    render() {
        return (
            <MapView
                style={styles.map}
                mapType="satellite"
                showsUserLocation={true}
                onRegionChange={this._onRegionChange}
                onRegionChangeComplete={this._onRegionChangeComplete}
                region={this.state.mapRegion || undefined}
                annotations={this.state.annotations || undefined}
                />
        );
    },

    _getAnnotations(region) {
        return [{
            longitude: region.longitude,
            latitude: region.latitude,
            title: 'You Are Here',
        }];
    },

    _onRegionChange(region) {
    },

    _onRegionChangeComplete(region) {
        this.didGetPosition(region.latitude, region.longitude);
    },

    _onRegionInputChanged(region) {
        this.setState({
            mapRegion: region,
            mapRegionInput: region,
            annotations: this._getAnnotations(region),
        });
    },

});

var styles = StyleSheet.create({
    map: {
        flex: 1,
        alignItems: "center",
        borderColor: '#000000'
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    textInput: {
        width: 150,
        height: 20,
        borderWidth: 0.5,
        borderColor: '#aaaaaa',
        fontSize: 13,
        padding: 4,
    },
    changeButton: {
        alignSelf: 'center',
        marginTop: 5,
        padding: 3,
        borderWidth: 0.5,
        borderColor: '#777777',
    },
});


AppRegistry.registerComponent('kastanienApp', () => MapViewExample);

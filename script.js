//document is AI-assisted
async function wait(ms){
    return new Promise(resolve => setTimeout(resolve, ms));
}
const roke = document.getElementById('roke');
const zoomback = document.getElementById('zoomback');
const filterdis = document.getElementById('filter');
const submitsearch = document.getElementById('search');
const resultmap = document.getElementById('resultmap');
const addresslink = document.getElementById('addresslink');
const resultzoom = document.getElementById('resultzoom');
let userLocation;
let marker;
let position = null;
let sortedCuisines = null;
let elements = null;
let currentlon = null, currentlat = null;
const results = document.getElementById('results');
const resultcuisine = document.getElementById('resultcuisines');
document.getElementById('map').style.width = '75%';
document.getElementById('map').style.height = '400px';
document.getElementById('map').style.margin = '0 auto';
// document.getElementById('min-price').addEventListener('input', price);
// document.getElementById('max-price').addEventListener('input', price);
document.getElementById('distance').addEventListener('input', distance);
const search = document.getElementById('search');
let pcondition = 1, dcondition = false;
        const theresultmap = new ol.Map({
            target: 'resultmap',
            layers: [
                new ol.layer.Tile({
                    source: new ol.source.OSM()
                })
            ]
        });
filterdis.setAttribute('disabled', true);
// function price() {
//     const minPrice = parseFloat(document.getElementById('min-price').value);
//     const maxPrice = parseFloat(document.getElementById('max-price').value);
//     const errorElement = document.getElementById('price-error');

//     if (isNaN(minPrice) || isNaN(maxPrice) || minPrice < 0 || maxPrice < 0) {
//         errorElement.textContent = 'Prices must be non-negative numbers.';
//         pcondition = false;
//          search.setAttribute('disabled', true);
//     } else if (minPrice > maxPrice) {
//         errorElement.textContent = 'Min Price cannot be greater than Max Price.';
//         pcondition = false;
//         search.setAttribute('disabled', true);
//     } else {
//         errorElement.textContent = '';
//         pcondition = true;
//         if (pcondition && dcondition) {
//             search.removeAttribute('disabled');
//         }
//     }
// }

function distance (){
    const distance = parseFloat(document.getElementById('distance').value);
    const errorElement = document.getElementById('distance-error');

    if (isNaN(distance) || distance <= 0) {
        errorElement.textContent = 'Distance must be a larger than 0.';
        dcondition = false;
        filterdis.setAttribute('disabled', true);

    } else { 
        errorElement.textContent = '';
        dcondition = true;
        if (pcondition && dcondition) {
            filterdis.removeAttribute('disabled');
        }
    }
}

document.getElementById('search').addEventListener('click', function(event) {
    if (document.getElementById('distance-error').textContent) {
        event.preventDefault();
    }
})
document.addEventListener('DOMContentLoaded', async function() {
const map = new ol.Map({
    target: 'map',
    layers: [
        new ol.layer.Tile({
            source: new ol.source.OSM()
        })
    ]
});

if (navigator.geolocation) {
 
        navigator.geolocation.getCurrentPosition(function(pos) {
            
            position = pos;
             userLocation = ol.proj.fromLonLat([position.coords.longitude, position.coords.latitude]);
            map.getView().setCenter(userLocation);
            map.getView().setZoom(18);
             marker = new ol.Feature({
        geometry: new ol.geom.Point(ol.proj.fromLonLat([position.coords.longitude, position.coords.latitude]))
    });
    const vectorSource = new ol.source.Vector({
        features: [marker]
    });
    
    const vectorLayer = new ol.layer.Vector({
        source: vectorSource,
        style: new ol.style.Style({
            image: new ol.style.Icon({
                anchor: [0.5, 1],
                src: 'https://cdn-icons-png.flaticon.com/512/9356/9356230.png',
                scale: 0.08
            })
        })
    });
    map.addLayer(vectorLayer);
    roke.textContent= 'Finding your address...';
    fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${pos.coords.latitude}&lon=${pos.coords.longitude}`)
    .then(response => response.json())
    .then(data => {
        roke.textContent = `Your address: ${data.display_name}`;
    })

    .catch(error => {
        console.error('Error fetching address:', error);
        roke.textContent = `${position.coords.latitude}, ${position.coords.longitude}`;
          
    });
    zoomback.addEventListener('click', function() {
        map.getView().animate({
            center: userLocation,
            zoom: 18,
            duration: 1000
        });

    })
    

    // const minPrice = document.getElementById('min-price').value;
    // const maxPrice = document.getElementById('max-price').value;


    //remove all event listeners from filterdis



    //collect cuisine input
    
    //error
    }, function(err) {
        console.error('Geolocation failed: ' );
        console.error(err);
        roke.textContent = 'Geolocation failed. Please enable location services.';
        alert('Geolocation failed. Please enable location services.');
    });


}





})
        filterdis.addEventListener('click', function() {
            if(position === null) return;
                                            resultmap.style.width = '0%';
                                resultmap.style.height = '0';
            resultmap.style.margin = '0 auto';
            results.textContent = '';
            resultzoom.setAttribute('hidden', true);
            addresslink.textContent = '';
            resultcuisine.textContent = '';
            document.getElementById('address').textContent = '';
            
            const distance = document.getElementById('distance').value;
            document.getElementById('cuisine').innerHTML = 'Searching...';
        const query = `[out:json];
    (
      node["amenity"="restaurant"](around:${distance}, ${position.coords.latitude}, ${position.coords.longitude});
      way["amenity"="restaurant"](around:${distance}, ${position.coords.latitude}, ${position.coords.longitude});
      relation["amenity"="restaurant"](around:${distance}, ${position.coords.latitude}, ${position.coords.longitude});
    );
    out body;
    >;
    out skel qt;`;
   fetch(`https://overpass-api.de/api/interpreter?data=${encodeURIComponent(query)}`)
    .then(response => response.json())
    .then(data => {
        console.log(data);
        elements = data;
        const cuisineDiv = document.getElementById('cuisine');
        cuisineDiv.innerHTML = ''; 
        const cuisineOptions = new Set();
        data.elements.forEach(element => {
            if (element.tags && element.tags.cuisine) {

                if (element.tags.cuisine.charAt(0) === '_') {
                    element.tags.cuisine = element.tags.cuisine.slice(1);
                }
                else if (element.tags.cuisine.includes('_')) {
                    element.tags.cuisine = element.tags.cuisine.replace(/_/g, ' ');
                }
                if(element.tags.cuisine.includes(' ')){
                    element.tags.cuisine = element.tags.cuisine.replace(/\s+/g, '');
                }
                const cuisines = (element.tags.cuisine).toLowerCase().split(/[,;]/);
                cuisines.forEach(cuisine => {
                    cuisineOptions.add(cuisine.trim());
                });
            }
        }); 

         sortedCuisines = Array.from(cuisineOptions).sort();
        if(sortedCuisines.length === 0) {
            cuisineDiv.innerHTML = 'No cuisines found in this area.';
        } else {
            cuisineDiv.innerHTML = '';
        }
        sortedCuisines.forEach(cuisine => {
            const label = document.createElement('label');
            label.className = 'cuisine-label';
            label.innerHTML = `<input type="checkbox" name="cuisine" value="${cuisine}"> ${cuisine}`;
            label.style.display = 'block';
            cuisineDiv.appendChild(label);
        });
        document.getElementById('disclaimer').textContent = data.osm3s.copyright;


        // const distance =  document.getElementById('distance').value;

        // const filteredRestaurants = data.elements.filter(element => {
        //     if (element.tags && element.tags.cuisine) {
              
        //         if (element.tags.cuisine.charAt(0) === '_') {
        //             element.tags.cuisine = element.tags.cuisine.slice(1);
        //         }
        //         else if (element.tags.cuisine.includes('_')) {
        //             element.tags.cuisine = element.tags.cuisine.replace(/_/g, ' ');
        //         }
        //         if(element.tags.cuisine.includes(' ')){
        //             element.tags.cuisine = element.tags.cuisine.replace(/\s+/g, '');
        //         }
        //         const cuisines = (element.tags.cuisine).toLowerCase().split(/[,;]/);
        //         return cuisines.some(cuisine => selectedCuisines.includes(cuisine.trim()));
        //     }
        //     return false;
        // }
        // );
        // console.log(filteredRestaurants)

    })
    
    });
        search.addEventListener('click', async function() {
            if(sortedCuisines === null || elements === null) return;
            search.setAttribute('disabled', true);


    let selectedCuisines = Array.from(document.querySelectorAll('input[name="cuisine"]:checked'))
        .map(input => input.value.toLowerCase());
        if( selectedCuisines.length === 0) {selectedCuisines = sortedCuisines}
    const filteredRestaurants = elements.elements.filter(element => {
        if (element.tags && element.tags.cuisine) {
            if (element.tags.cuisine.charAt(0) === '_') {
                element.tags.cuisine = element.tags.cuisine.slice(1);
            }
            else if (element.tags.cuisine.includes('_')) {
                element.tags.cuisine = element.tags.cuisine.replace(/_/g, ' ');
            }
            if(element.tags.cuisine.includes(' ')){
                element.tags.cuisine = element.tags.cuisine.replace(/\s+/g, '');
            }
            const cuisines = (element.tags.cuisine).toLowerCase().split(/[,;]/);
            return cuisines.some(cuisine => selectedCuisines.includes(cuisine.trim()));
        }
        return false;
    }
    );

    // console.log(filteredRestaurants[Math.floor(Math.random() * filteredRestaurants.length)])
    if(filteredRestaurants.length > 0) {
     
                                resultmap.style.width = '75%';
                                resultmap.style.height = '400px';
            resultmap.style.margin = '0 auto';
            resultzoom.removeAttribute('hidden');
                            //    document.getElementById('resultzoom').removeAttribute('hidden');
            theresultmap.getLayers().clear();
            theresultmap.addLayer(new ol.layer.Tile({
                source: new ol.source.OSM()
            }));

        const randomRestaurant = filteredRestaurants[Math.floor(Math.random() * filteredRestaurants.length)];
        console.log(randomRestaurant)
        let name = randomRestaurant.tags.name || randomRestaurant.tags["name:en"] || randomRestaurant.tags["name:de"] || randomRestaurant.tags["name:fr"] || randomRestaurant.tags["name:it"] || randomRestaurant.tags["name:es"] || randomRestaurant.tags["name:pt"] || randomRestaurant.tags["name:ru"] || randomRestaurant.tags["name:zh"] || randomRestaurant.tags["name:ja"] || randomRestaurant.tags["name:ko"] || randomRestaurant.tags["name:ar"] || randomRestaurant.tags["name:hi"] || randomRestaurant.tags["name:bn"] || randomRestaurant.tags["name:id"] || randomRestaurant.tags["name:tr"] || randomRestaurant.tags["name:vi"] || randomRestaurant.tags["name:th"] || randomRestaurant.tags["name:pl"] || randomRestaurant.tags["name:nl"] || randomRestaurant.tags["name:sv"] || randomRestaurant.tags["name:no"] || randomRestaurant.tags["name:da"] || randomRestaurant.tags["name:fi"] || "Unknown Restaurant";
        results.textContent= `${name}`
        ;
        //always use lat and lon to search for address of restaurant, ignore pretyped address

        if (randomRestaurant.lat && randomRestaurant.lon) {
            currentlat = randomRestaurant.lat;
            currentlon = randomRestaurant.lon;
            const links = document.createElement('a');
            links.textContent = 'View on Google Maps';
            links.href = `https://maps.google.com/?q=${currentlat},${currentlon}`;
            links.target = '_blank';

            addresslink.textContent = '';
            addresslink.appendChild(links);
            fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${randomRestaurant.lat}&lon=${randomRestaurant.lon}`)
                .then(response => response.json())
                .then(async data => {
    
                    address = data.display_name || `${randomRestaurant.lat}, ${randomRestaurant.lon}` || "Address not available";
                    document.getElementById("address").textContent = `${address}`;
                })
                .catch(error => {
                    console.error('Error fetching address:', error);
                    document.getElementById("address").textContent = `${randomRestaurant.lat}, ${randomRestaurant.lon}`;
                });

            } else {
                address = `Address not available`;
                document.getElementById("address").textContent = `${address}`;
                resultzoom.setAttribute('hidden', true);
                                                            resultmap.style.width = '0%';
                                resultmap.style.height = '0';
                                addresslink.textContent = '';
            resultmap.style.margin = '0 auto';
            }
        //List all cuisines of the restaurant with the format above
        const cuisines = randomRestaurant.tags.cuisine ? randomRestaurant.tags.cuisine.split(/[,;]/).map(c => c.trim().replace(/_/g, ' ')).join(', ') : 'Unknown';
        resultcuisine.textContent = `Cuisines: ${cuisines}`;
        const restaurantLocation = ol.proj.fromLonLat([randomRestaurant.lon, randomRestaurant.lat]);
        theresultmap.getView().setCenter(restaurantLocation);
        theresultmap.getView().setZoom(18);
        const restaurantMarker = new ol.Feature({
            geometry: new ol.geom.Point(restaurantLocation)
        });
        const restaurantVectorSource = new ol.source.Vector({
            features: [restaurantMarker]
        });
        const restaurantVectorLayer = new ol.layer.Vector({
            source: restaurantVectorSource,
            style: new ol.style.Style({
                image: new ol.style.Icon({
                    anchor: [0.5, 1],
                    src: 'https://cdn-icons-png.flaticon.com/512/9356/9356230.png',
                    scale: 0.08
                })
            })
            
        });

   
        theresultmap.addLayer(restaurantVectorLayer);

    } else results.textContent ='No restaurants found matching your criteria.';
 
   await wait(2500);
   search.removeAttribute('disabled');
})

resultzoom.addEventListener('click', function() {
    if (position === null || currentlat === null || currentlon === null) return;
    console.log(currentlat, currentlon);
    theresultmap.getView().animate({

        center: ol.proj.fromLonLat([currentlon, currentlat]),
        zoom: 18,
        duration: 1000
    });
})
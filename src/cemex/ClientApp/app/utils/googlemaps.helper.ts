/**
 * Google maps helper
 * Lazy loads the map, exposes the entire Javascript API via @types
 * 
 * @param: string: The <div> id
 * @callback: (): map instance
 * 
 * Example adding default options and a marker:
 * GoogleMapsHelper.lazyLoadMap("map", (map) => {
 *     map.setOptions(GoogleMapsHelper.mapOptions);
 *     var marker = new google.maps.Marker({
 *         position: { lat: -25.363, lng: 131.044 },
 *         map: map
 *     });
 * });
 */

import { } from '@types/googlemaps';

export class GoogleMapsHelper {
    private static src = "https://maps.googleapis.com/maps/api/js?key=AIzaSyCpk_GAvrtS8yi-y6Dx8k5hltS18uxjUPI"
    private static scriptId = "googlemapsapi"

    static lazyLoadMap(id = "map", callback: (map) => any) : void {
        if (!document.getElementById(this.scriptId)) {
            // Appends script into html
            document.body.appendChild(Object.assign(document.createElement('script'), {
                type: 'text/javascript',
                id: this.scriptId,
                src: this.src,
                onload: () => {
                    let map = new google.maps.Map(document.getElementById(id));
                    callback(map);
                }
            }));
        }
        else {
            // Script already added
            let map = new google.maps.Map(document.getElementById(id));
            callback(map);
        }
    }

    // Google map options
    static readonly mapOptions: google.maps.MapOptions = {
        zoom: 4,
        center: { lat: -25.363, lng: 131.044 },
    };
}
import './components/_matches.polyfill.js';
import '../../node_modules/bootstrap/js/dist/modal';

/**
 * File navigation.js.
 *
 * Handles toggling the navigation menu for small screens and enables TAB key
 * navigation support for dropdown menus.
 */
( function() {
    var incassokosten = document.querySelector('form[name=incassokosten]');
    if (incassokosten) { 
        incassokosten.addEventListener('submit', function(e) {
            e.preventDefault();
           var result = berekenIncasso(incassokosten); 
           var kostenResult = document.getElementById('kostenResult');
           kostenResult.innerHTML = result;
        });
    }
}() );

function berekenIncasso(incassoKosten) {

    var hoofdsom_euros = document.getElementById("hoofdsom_euros").value;

    var hoofdsom_centen = document.getElementById("hoofdsom_centen").value;

    var btwplichtig = document.getElementById("btwplichtig").checked;

    var hoofdsom =  hoofdsom_euros + '.' + hoofdsom_centen;

    var volledigeKosten = 0;

    if ( hoofdsom < 2500) {
        volledigeKosten = hoofdsom * 0.15;

        if ( volledigeKosten < 40 ) { volledigeKosten = 40; }
    } else if ( hoofdsom < 5000) {
        volledigeKosten = 2500 * 0.15;
        volledigeKosten += (hoofdsom - 2500) * 0.10;
    } else if ( hoofdsom < 10000) {
        volledigeKosten = 2500 * 0.15;
        volledigeKosten += 2500 * 0.10;
        volledigeKosten += (hoofdsom - 5000) * 0.05;
    } else if ( hoofdsom < 200000) {
        volledigeKosten = 2500 * 0.15;
        volledigeKosten += 2500 * 0.10;
        volledigeKosten += 5000 * 0.05;
        volledigeKosten += (hoofdsom - 10000) * 0.01;
    } else {
        volledigeKosten = 2500 * 0.15;
        volledigeKosten += 2500 * 0.10;
        volledigeKosten += 5000 * 0.05;
        volledigeKosten += 190000 * 0.01;
        volledigeKosten += (hoofdsom - 200000) * 0.005;

        if ( volledigeKosten > 6775 ) { volledigeKosten = 6775; }
    }

    if (!btwplichtig) {
        volledigeKosten = volledigeKosten * 1.21;
    }

    return volledigeKosten;
}
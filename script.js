
document.getElementById('min-price').addEventListener('input', validatePrices);
document.getElementById('max-price').addEventListener('input', validatePrices);
document.getElementById('distance').addEventListener('input', validateDistance);


function validatePrices() {
    const minPrice = parseFloat(document.getElementById('min-price').value);
    const maxPrice = parseFloat(document.getElementById('max-price').value);
    const errorElement = document.getElementById('price-error');

    if (isNaN(minPrice) || isNaN(maxPrice) || minPrice < 0 || maxPrice < 0) {
        errorElement.textContent = 'Prices must be non-negative numbers.';
    } else if (minPrice > maxPrice) {
        errorElement.textContent = 'Min Price cannot be greater than Max Price.';
    } else {
        errorElement.textContent = '';
    }
}
function validateDistance (){
    const distance = parseFloat(document.getElementById('distance').value);
    const errorElement = document.getElementById('distance-error');

    if (isNaN(distance) || distance <= 0) {
        errorElement.textContent = 'Distance must be a larger than 0.';
    } else { 
        errorElement.textContent = '';
    }
}

document.getElementById('search').addEventListener('click', function(event) {
    if (document.getElementById('price-error').textContent || document.getElementById('distance-error').textContent) {
        event.preventDefault();
    }
})

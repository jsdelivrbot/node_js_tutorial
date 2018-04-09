var button = document.querySelector('button');

button.addEventListener('click', function() {
    fetch('/times')
        .then(function(response) {
            return response.text();
        })
        .then(function(user) {
            console.log(user);
        })
        .catch(function(err) {
            console.log('error:', err);
        });
})
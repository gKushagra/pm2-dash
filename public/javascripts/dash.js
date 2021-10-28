const domain = "http://localhost:9997/";

document.onreadystatechange = function (event) {
    console.log('Before window loads');
    if (document.readyState === 'complete') {
        if (!localStorage.getItem('X-PM2DASH-TOKEN')) {
            window.location.replace(domain + 'auth/login');
        }
    }
};

window.onload = function (event) {
    console.log("After window loads");
}
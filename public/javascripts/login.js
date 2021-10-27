const domain = "http://localhost:9997/";

(function () {

    const emailInput = document.getElementById('login-email');
    const passInput = document.getElementById('login-pass');
    const submitBtn = document.getElementById('login-submit');

    submitBtn.addEventListener('click', function (event) {

        console.log(emailInput.value, passInput.value);

        fetch(domain + 'api/v1/auth/login', {
            method: 'POST',
            body: JSON.stringify({
                email: emailInput.value,
                password: passInput.value
            })
        })
            .then(response => response.json())
            .then(data => {
                console.log(data);
                if (data.message === "Account not found" ||
                    data.message === "Incorrect Email or Password") {
                    alert(data.message);
                } else {
                    alert(data.message);
                    localStorage.setItem('X-PM2DASH-TOKEN', data.token);
                }
            })
            .catch(error => alert(error))
            .finally(() => {
                window.location.replace(domain + 'dash');
            });

    });

})();
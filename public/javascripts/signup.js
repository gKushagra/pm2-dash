const domain = "http://localhost:9997/";

(function () {

    const emailInput = document.getElementById('signup-email');
    const passInput = document.getElementById('signup-pass');
    const submitBtn = document.getElementById('signup-submit');

    submitBtn.addEventListener('click', function (event) {

        console.log(emailInput.value, passInput.value);

        var accountCreated = false;

        fetch(domain + 'api/v1/auth/signup', {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                email: emailInput.value,
                password: passInput.value
            })
        })
            .then(response => response.json())
            .then(data => {
                console.log(data);
                if (data.message === "Account Created") {
                    alert(data.message);
                    accountCreated = true;
                } else {
                    alert(data.message);
                }
            })
            .catch(error => alert(error))
            .finally(() => {
                if (accountCreated) {
                    window.location.replace(domain + 'views/login');
                }
            });

    });

})();
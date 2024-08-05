document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("createAccountForm");
    fetch('https://randomuser.me/api/')
        .then(response => response.json())
        .then(apiData => {
            const apiUser = apiData.results[0];
            document.getElementById("fname").value = apiUser.name.first;
            document.getElementById("lname").value = apiUser.name.last;
            document.getElementById("email").value = apiUser.email;
            document.getElementById("pword").value = apiUser.login.password;
            document.getElementById("confirmpwd").value = apiUser.login.password;
            if (apiUser.gender === "male") {
                document.getElementById("male").checked = true;
            } else if (apiUser.gender === "female") {
                document.getElementById("female").checked = true;
            }
            document.getElementById("music").checked = true;
            document.getElementById("sports").checked = false;
            document.getElementById("travel").checked = false;
            document.getElementById("movies").checked = true;
            document.getElementById("soi").value = "employee";
            document.getElementById("age").value = apiUser.dob.age;
            document.getElementById("biotext").value = "Lorem ipsum dolor sit amet.";
        })
        .catch(error => console.error('Error fetching API data:', error));
    form.addEventListener('submit', function(event) {
        event.preventDefault(); 
        const formData = new FormData(this);
        const data = Object.fromEntries(formData.entries()); 
        console.log(data);
        fetch('https://reqres.in/api/users', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        })
        .then(response => response.json())
        .then(data => {
            console.log('Success:', data);
            alert('Form submitted successfully!');
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Form submission failed.');
        });
    });
    document.getElementById('income').addEventListener('input', function() {
        document.getElementById('incomeDisplay').textContent = `${this.value / 1000}k`;
    });
});


document.getElementById("loginForm").addEventListener("submit", async function(event) {
    event.preventDefault();

    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    // Here you can add your own validation logic
    try{
    const response=await fetch('/login',{
        method:'POST',headers:{'content-type':'application/json'},
        body:JSON.stringify({username,password})
    });
    if (response.status==200) {
        alert('Login successful!');
        window.location.href = "home.html";
    } else {
        alert('Invalid username or password!');
    }
}
    catch (error) {
        console.error('Error:', error);
        alert('An error occurred. Please try again.');}
    })
// export const PostWithoutAuth = (url) => {
//     console.log("fetching from " + url)
//     var request = fetch("http://localhost:8080/api/v1"+url,  { //ur ex. = ?username=ahmet&password=1234
//         method: "POST",
//         headers: {
//             Accept: 'application/json',
//             'Content-Type': 'application/json',
//             'Access-Control-Allow-Origin': '*',
//         },
//
//       })
//     return request
// }


import axios from "axios";

export const RefreshToken = async () => {
    console.log("Trying to refresh the token")
    const refreshTokenStr = localStorage.getItem('refresh_token');
    const refTokenResult = await axios.get("http://localhost:8080/api/v1/token/refresh",
        {headers: {"Authorization": `Bearer ${refreshTokenStr}`}})
        .catch(function (error) { // if token refresh fails then logout
            localStorage.clear()
            console.log("logout - cleared local storage", localStorage)

        });
    if (refTokenResult.status === 200) { // token refreshed
        localStorage.setItem("access_token", refTokenResult.data.access_token);
        localStorage.setItem("refresh_token", refTokenResult.data.refresh_token);
        localStorage.setItem("currentUser", refTokenResult.data.username)
        localStorage.setItem("role", refTokenResult.data.role)
        console.log("Refreshed the token")
    }
}
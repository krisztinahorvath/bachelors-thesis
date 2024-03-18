// import { BACKEND_URL } from "../constants";
// import { LoggedInUser } from "../models/LoggedInUser";
// import axios from "axios";
// import { handleLogoutUtil, setEmail, setToken, setUserType } from "../utils/auth-utils";

// export const handleLogin = (email: string, password: string): Promise<LoggedInUser> => {
//     return new Promise((resolve, reject) => {
//         axios.post(`${BACKEND_URL}/users/login`, {
//             email: email, 
//             password: password
//         }).then((response) => {
//             setToken(response.data.token);
//             setUserType(response.data.userType);
//             setEmail(response.data.email);

//             resolve(response.data);
//         }).catch((error) => {
//             if(error.response){
//                 reject(error.response);
//             }
//             else {
//                 reject("An error occured while trying to log in.")
//             }
//         });
//     });
// };

// export const handleLogout = () => {
//     handleLogoutUtil();
// }
// Constants.js
export const SERVER_IP = "http://localhost:3000";

export const ENV = {
    BASE_PATH: `http://${SERVER_IP}`,
    BASE_API: `http://${SERVER_IP}/api/usuarios`,
    API_ROUTES: {
        REGISTER: "auth/register",
        LOGIN: "auth/login",
        USER_ME: "user/me",
    }
};

const fs = require("fs");

const data = fs.readFileSync("./activity-tracker-tester.json");
const jsonData = JSON.parse(data);

let token;

(async () => {
  try {
    //Sezione login

    //Body da passare per il login
    const loginBody = {
      // email: "ycnxdfsrvvapzsdsin@cazlq.com",
      email: jsonData.users.admin.login.email,
      // password: "1wVb|&WLr,kG3P[0{4?,c&IVcMihUkUk",
      password: jsonData.users.admin.login.password,
    };

    //Chiamata alla api login
    const loginReq = await fetch("http://127.0.0.1:3000/api/v1/users/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(loginBody),
    });

    //Conversione in json della chiamata
    const loginRes = await loginReq.json();

    //salvataggio del token
    token = loginRes.token; // data.id per l'id

    //Chiamata alla api getMe
    const getMeReq = await fetch("http://127.0.0.1:3000/api/v1/users/getMe", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      credentials: "include",
    });

    //Conversione in json della chiamata
    const getMeRes = await getMeReq.json();

    console.log(getMeRes);

    const getUsersReq = await fetch("http://127.0.0.1:3000/api/v1/users", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      credentials: "include",
    });

    const getUsersRes = await getUsersReq.json();

    for (let userId in getUsersRes) {
      if (getUsersRes.hasOwnProperty(userId)) {
        console.log(getUsersRes[userId]);
      }
    }

    const getUserByIdReq = await fetch(
      `http://127.0.0.1:3000/api/v1/users/${loginRes.data.id}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        credentials: "include",
      }
    );

    const getUserByIdRes = await getUserByIdReq.json();

    id = getUserByIdRes.data.id;
    console.log(`ID: ${id}`);
  } catch (error) {
    console.error("Error fetching data:", error);
  }
})();

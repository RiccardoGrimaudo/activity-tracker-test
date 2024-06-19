const fs = require("fs");

const data = fs.readFileSync("./activity-tracker-tester.json");
const jsonData = JSON.parse(data);

let token;
let id;

async function waitForToken() {
  while (!token) {
    await new Promise((resolve) => setTimeout(resolve, 100));
  }
}

async function waitForId() {
  while (!id) {
    await new Promise((resolve) => setTimeout(resolve, 100));
  }
}

(async () => {
  try {
    let req = await fetch("http://127.0.0.1:3000/api/v1/users/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(jsonData.users.admin.login),
    });

    let res = await req.json();
    id = res.data.id;

    token = res.token;
  } catch (error) {
    console.error("Error fetching data:", error);
  }
})();

(async () => {
  await waitForToken();

  try {
    let req = await fetch("http://127.0.0.1:3000/api/v1/users/getMe", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      credentials: "include",
    });

    let res = await req.json();

    console.log("Result of the getMe route:", res);
  } catch (error) {
    console.error("Error fetching data:", error);
  }
})();

(async () => {
  await waitForToken();

  try {
    let req = await fetch("http://127.0.0.1:3000/api/v1/users?limit=10", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      credentials: "include",
    });

    let res = await req.json();

    console.log("All users entered into the db:");
    for (let userId in res) {
      if (res.hasOwnProperty(userId)) {
        console.log(res[userId]);
      }
    }
  } catch (error) {
    console.error("Error fetching data:", error);
  }
})();

(async () => {
  await waitForToken();
  await waitForId();

  try {
    let req = await fetch(`http://127.0.0.1:3000/api/v1/users/${id}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      credentials: "include",
    });

    let res = await req.json();

    console.log("Information about a specific user:", res);
  } catch (error) {
    console.error("Error fetching data:", error);
  }
})();

(async () => {
  await waitForToken();

  try {
    let req = await fetch(`http://127.0.0.1:3000/api/v1/activities?limit=10`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      credentials: "include",
    });

    let res = await req.json();

    console.log("All activities entered into the db:");
    for (let userId in res) {
      if (res.hasOwnProperty(userId)) {
        console.log(res[userId]);
      }
    }
  } catch (error) {
    console.error("Error fetching data:", error);
  }
})();

(async () => {
  await waitForToken();
  await waitForId();

  try {
    let req = await fetch(
      `http://127.0.0.1:3000/api/v1/users/${id}/activities`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    let res = await req.json();

    console.log("Activities of a specific user:", res);
  } catch (error) {
    console.error("Error fetching data:", error);
  }
})();

(async () => {
  await waitForToken();

  try {
    let req = await fetch(`http://127.0.0.1:3000/api/v1/users/updateMe`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(jsonData.users.admin.updateMe),
    });

    let res = await req.json();

    console.log("Result of the updateMe route:", res);
  } catch (error) {
    console.error("Error fetching data:", error);
  }
})();

(async () => {
  await waitForToken();

  try {
    let req = await fetch(
      `http://127.0.0.1:3000/api/v1/users/updateMyPassword`,
      {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(jsonData.users.admin.updateMyPassword),
      }
    );

    token = null;
    let res = await req.json();

    token = res.token;
    console.log("Result of the updateMyPassword route:", res);
  } catch (error) {
    console.error("Error fetching data:", error);
  }
})();

(async () => {
  await waitForToken();
  await waitForId();

  try {
    let req = await fetch(
      `http://127.0.0.1:3000/api/v1/users/changeStatus/${id}/?uri=123`,
      {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(jsonData.users.admin.changeStatus),
      }
    );

    let res = await req.json();

    console.log("Result of the changeStatus route:", res);
  } catch (error) {
    console.error("Error fetching data:", error);
  }
})();

(async () => {
  await waitForToken();
  await waitForId();

  try {
    let req = await fetch(`http://127.0.0.1:3000/api/v1/users/${id}`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(jsonData.users.admin.userPatch),
    });

    let res = await req.json();

    console.log("Result of the updateUser route:", res);
  } catch (error) {
    console.error("Error fetching data:", error);
  }
})();

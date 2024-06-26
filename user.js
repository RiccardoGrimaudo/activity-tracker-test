const fs = require("fs");

const data = fs.readFileSync("./activity-tracker-tester/user.json");
const jsonData = JSON.parse(data);

let token;
let id;
let firstTaskId;
let taskId;
let newActivityId;
let successCount = 0;
let failureCount = 0;

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

async function waitForFirstTaskId() {
  while (!firstTaskId) {
    await new Promise((resolve) => setTimeout(resolve, 100));
  }
}

async function waitForTaskId() {
  while (!taskId) {
    await new Promise((resolve) => setTimeout(resolve, 100));
  }
}

async function waitForNewActivityId() {
  while (!newActivityId) {
    await new Promise((resolve) => setTimeout(resolve, 100));
  }
}

async function main() {
  try {
    let reqLogin = await fetch("http://127.0.0.1:3000/api/v1/users/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(jsonData.users.user.login),
    });

    let resLogin = await reqLogin.json();
    id = resLogin.data.id;
    token = resLogin.token;

    await trackExecution(getMe);
    await trackExecution(getUserById);
    await trackExecution(updateMe);
    await trackExecution(updateMyPassword);

    await trackExecution(getTasks);
    await trackExecution(getTask);

    await trackExecution(addActivity);
    await trackExecution(getActivityByID);
    await trackExecution(updateActivity);

    await trackExecution(deleteActivity);
    await trackExecution(deleteUser);
    await trackExecution(logout);

    console.log(`Functions executed successfully: ${successCount}`);
    console.log(`Failed functions: ${failureCount}`);
  } catch (error) {
    console.error("Error fetching data:", error);
  }
}

async function trackExecution(func) {
  try {
    const response = await func();
    if ((response >= 200) & (response < 300)) {
      successCount++;
    } else {
      console.error(`Error executing ${func.name}...`);
      failureCount++;
    }
  } catch (error) {
    console.error(`Error executing ${func.name}...`, error);
    failureCount++;
  }
}

async function getMe() {
  await waitForToken();

  let req = await fetch("http://127.0.0.1:3000/api/v1/users/getMe", {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    credentials: "include",
  });

  return req.status;
}

async function getUserById() {
  await waitForToken();
  await waitForId();

  let req = await fetch(`http://127.0.0.1:3000/api/v1/users/${id}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    credentials: "include",
  });

  return req.status;
}

async function updateMe() {
  await waitForToken();

  let req = await fetch(`http://127.0.0.1:3000/api/v1/users/updateMe`, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(jsonData.users.user.updateMe),
  });

  return req.status;
}

async function updateMyPassword() {
  await waitForToken();

  let req = await fetch(`http://127.0.0.1:3000/api/v1/users/updateMyPassword`, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(jsonData.users.user.updateMyPassword),
  });

  token = null;
  let res = await req.json();
  token = res.token;

  return req.status;
}

async function getTasks() {
  await waitForToken();

  let req = await fetch("http://127.0.0.1:3000/api/v1/tasks?limit=10", {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    credentials: "include",
  });

  let res = await req.json();
  firstTaskId = res.data.document[0]._id;

  return req.status;
}

async function getTask() {
  await waitForToken();
  await waitForId();
  await waitForFirstTaskId();

  let req = await fetch(`http://127.0.0.1:3000/api/v1/tasks/${firstTaskId}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    credentials: "include",
  });

  let res = await req.json();
  taskId = res.data.document._id;

  return req.status;
}

async function addActivity() {
  await waitForToken();
  await waitForId();
  await waitForTaskId();

  let activityPostData = { ...jsonData.activities.user.activityPost };
  activityPostData.taskID = taskId;
  activityPostData.userID = id;

  let req = await fetch("http://127.0.0.1:3000/api/v1/activities", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(activityPostData),
  });

  let res = await req.json();
  newActivityId = res.data.activity._id;

  return req.status;
}

async function getActivityByID() {
  await waitForToken();
  await waitForNewActivityId();

  let req = await fetch(
    `http://127.0.0.1:3000/api/v1/activities/${newActivityId}`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      credentials: "include",
    }
  );

  let res = await req.json();
  taskId = res.data.document.taskID;

  return req.status;
}

async function updateActivity() {
  await waitForToken();
  await waitForNewActivityId();

  let req = await fetch(
    `http://127.0.0.1:3000/api/v1/activities/${newActivityId}`,
    {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(jsonData.activities.user.activityPatch),
    }
  );

  return req.status;
}

async function deleteActivity() {
  await waitForToken();
  await waitForNewActivityId();

  let req = await fetch(
    `http://127.0.0.1:3000/api/v1/activities/${newActivityId}`,
    {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return req.status;
}

async function deleteUser() {
  await waitForToken();
  await waitForId();

  let req = await fetch(`http://127.0.0.1:3000/api/v1/users/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return req.status;
}

async function logout() {
  await waitForToken();

  let req = await fetch("http://127.0.0.1:3000/api/v1/users/logout");

  return req.status;
}

main();

const fs = require("fs");

const data = fs.readFileSync("./activity-tracker-tester/admin.json");
const jsonData = JSON.parse(data);

let token;
let id;
let firstTaskId;
let newTaskId;
let firstActivityId;
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

async function waitForNewTaskId() {
  while (!newTaskId) {
    await new Promise((resolve) => setTimeout(resolve, 100));
  }
}

async function waitForFirstActivityId() {
  while (!firstActivityId) {
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
      body: JSON.stringify(jsonData.users.admin.login),
    });

    let resLogin = await reqLogin.json();
    id = resLogin.data.id;
    token = resLogin.token;

    await trackExecution(getMe);
    await trackExecution(getUsers);
    await trackExecution(getUserById);
    await trackExecution(getUserActivities);
    await trackExecution(updateMe);
    await trackExecution(updateMyPassword);
    await trackExecution(changeStatus);
    await trackExecution(updateUser);

    await trackExecution(getTasks);
    await trackExecution(getTask);
    await trackExecution(addTask);
    await trackExecution(updateTask);

    await trackExecution(getActivities);
    await trackExecution(getActivityByID);
    await trackExecution(addActivity);
    await trackExecution(updateActivity);

    await trackExecution(deleteActivity);
    await trackExecution(deleteTask);
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

async function getUsers() {
  await waitForToken();

  let req = await fetch("http://127.0.0.1:3000/api/v1/users?limit=10", {
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

async function getUserActivities() {
  await waitForToken();
  await waitForId();

  let req = await fetch(`http://127.0.0.1:3000/api/v1/users/${id}/activities`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
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
    body: JSON.stringify(jsonData.users.admin.updateMe),
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
    body: JSON.stringify(jsonData.users.admin.updateMyPassword),
  });

  token = null;
  let res = await req.json();
  token = res.token;

  return req.status;
}

async function changeStatus() {
  await waitForToken();
  await waitForId();

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

  return req.status;
}

async function updateUser() {
  await waitForToken();
  await waitForId();

  let req = await fetch(`http://127.0.0.1:3000/api/v1/users/${id}`, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(jsonData.users.admin.userPatch),
  });

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

  return req.status;
}

async function addTask() {
  await waitForToken();

  let req = await fetch("http://127.0.0.1:3000/api/v1/tasks", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(jsonData.tasks.admin.taskPost),
  });

  let res = await req.json();
  newTaskId = res.data.task._id;

  return req.status;
}

async function updateTask() {
  await waitForToken();
  await waitForNewTaskId();

  let req = await fetch(`http://127.0.0.1:3000/api/v1/tasks/${newTaskId}`, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(jsonData.tasks.admin.taskPatch),
  });

  return req.status;
}

async function getActivities() {
  await waitForToken();

  let req = await fetch("http://127.0.0.1:3000/api/v1/activities?limit=10", {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    credentials: "include",
  });

  let res = await req.json();
  firstActivityId = res.data.document[0]._id;

  return req.status;
}

async function getActivityByID() {
  await waitForToken();
  await waitForId();
  await waitForFirstActivityId();

  let req = await fetch(
    `http://127.0.0.1:3000/api/v1/activities/${firstActivityId}`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      credentials: "include",
    }
  );

  return req.status;
}

async function addActivity() {
  await waitForToken();
  await waitForId();
  await waitForNewTaskId();

  let activityPostData = { ...jsonData.activities.admin.activityPost };
  activityPostData.userID = id;
  activityPostData.taskID = newTaskId;

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
      body: JSON.stringify(jsonData.activities.admin.activityPatch),
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

async function deleteTask() {
  await waitForToken();
  await waitForNewTaskId();

  let req = await fetch(`http://127.0.0.1:3000/api/v1/tasks/${newTaskId}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return req.status;
}

async function deleteUser() {
  await waitForId();
  await waitForToken();

  let req = await fetch(
    `http://127.0.0.1:3000/api/v1/users/668286cb797e7cb8410bf9b2`,
    {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return req.status;
}

async function logout() {
  await waitForToken();

  let req = await fetch("http://127.0.0.1:3000/api/v1/users/logout");

  return req.status;
}

main();

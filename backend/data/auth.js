let users = [
  {
    id: "1",
    username: "roha",
    password: "$2b$12$uRSL0C9gqUQgEJ.bwx0m/Oc2tCamASYc7S.ifrRVoKSMtXHVjCDfK", // 12345
    name: "roha",
    email: "roha@gmail.com",
    url: "https://widgetwhats.com/app/uploads/2019/11/free-profile-photo-whatsapp-1.png",
  },
];

export async function findByUsername(username) {
  return users.find((user) => user.username === username);
}

export async function findById(id) {
  return users.find((user) => user.id === id);
}

export async function createUser(user) {
  const created = { ...user, id: Date.now().toString() };
  users.push(created);
  return created.id;
}

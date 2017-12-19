/**
 * Seed users table.
 *
 * @param  {object} knex
 * @param  {object} Promise
 * @return {Promise}
 */
export function seed(knex, Promise) {
  // Deletes all existing entries
  //
  let initialUsers = [];
  for (var i = 1; i <= 10; i++) {
    initialUsers.push({
      "firstname": "Safal",
      "lastname": "pandey",
      "username": "safal" + i,
      "email": "as" + i + "@aa",
      "password": "password",
      "hobby": "abc"

    })
  }
  return knex('users')
    .del()
    .then(() => {
      return Promise.all(
        // Inserts seed entries
        initialUsers.map((user) => {
          return knex('users').insert({
            "firstname": user.firstname,
            "lastname": user.lastname,
            "username": user.username,
            "email": user.email,
            "password": user.password,
            "hobby": user.hobby,
            "updated_at":new Date()
          })
        }));
    });;
}


exports.seed = function(knex, Promise) {
  return Promise.join(
    // Deletes ALL existing entries
    knex('users').del(),

    // Inserts seed entries
    knex('users').insert({username: 'adminguy',email: 'daniel@djrobinson.me', password: '$2a$10$RisgWhM9VUDKu4uThsPqfeaI6yQM4imVQhE/vhN/zwsm3yhrDjKRi', is_admin: true, site_id: '1'}),
    knex('users').insert({username: 'guy',email: 'daniel@djrobinson.me', password: '$2a$10$RisgWhM9VUDKu4uThsPqfeaI6yQM4imVQhE/vhN/zwsm3yhrDjKRi', is_admin: false})
  );
};

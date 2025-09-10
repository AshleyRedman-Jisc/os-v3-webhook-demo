import { db } from './db';

export const seed = db.query(
    `create table if not exists responses (
    id integer primary key,
    data json
    );`
);

db.query('delete from responses;').run();

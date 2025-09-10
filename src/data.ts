import { db } from './db';

export async function accept(data: Record<any, any>) {
    try {
        const query = db.query('insert into responses (data) values (:value)');
        query.run({ value: JSON.stringify(data) });
        return true;
    } catch (error) {
        return false;
    }
}

export async function retrieve() {
    const query = db.query('select * from responses;');
    return query.all();
}

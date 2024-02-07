import { MongoClient } from 'mongodb';

export class ConnectionPool {
    constructor(uri, option, poolSize = 2) {
        this.uri = uri;
        this.option = option;
        this.poolSize = poolSize;
        this.connections = [];
    }

    async connect() {
        for (let i = 0; i < this.poolSize; i++) {
            const newConnection = new MongoClient(this.url, this.option);
            try {
                await newConnection.connect();
                this.connections.push(newConnection.db('auth-users'));
            } catch (error) {
                throw error;
            }
        }
    }

    async getConnection() {
        if (this.connections.length === 0) {
            throw new Error('Connection pool is empty');
        }
        return this.connections.pop();
    }

    releaseConnection(newConnection) {
        this.connections.push(newConnection);
    }
}

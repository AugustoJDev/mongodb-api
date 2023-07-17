const { MongoClient } = require('mongodb');

class DatabaseConnection {
    constructor(uri) {
        this.uri = uri;
        this.client = null;
        this.database = null;
    }

    async open() {
        try {
            this.client = new MongoClient(this.uri);
            await this.client.connect();
            this.database = this.client.db(process.env.DBNAME);
        } catch (error) {
            console.error('Error connecting to database:', error);
        }
    }

    async close() {
        try {
            await this.client.close();
        } catch (error) {
            console.error('Error closing database connection:', error);
        }
    }

    async getDocuments(collectionName, field) {
        try {
            await this.open();

            const collection = this.database.collection(collectionName);

            let documents;
            if (field == null) {
                documents = await collection.find().toArray();
            } else {
                documents = await collection.find(field).toArray();
            }

            return documents;
        } catch (error) {
            console.log;
        } finally {
            await this.close();
        }
    }

    async getToken(name, pass) {
        try {
            await this.open();

            let user = await this.getDocuments("admin", {
                login: name,
                password: pass
            });
            user = user[0];

            if (!user) {
                return "Invalid User."
            } else {
                const token = jwt.sign({
                    user
                }, process.env.jwtKey);

                return token;
            }
        } catch (error) {
            console.log;
        } finally {
            await this.close();
        }
    };

    async addValues(collectionName, data) {
        try {
            await this.open();

            const collection = this.database.collection(collectionName);

            const result = await collection.insertMany([data]);

            return `Values added with success: ${result.insertedCount}`;
        } catch (error) {
            return `${error}`;
        } finally {
            await this.close();
        }
    };

    async remValues(collectionName, data) {
        try {
            await this.open();

            const collection = this.database.collection(collectionName);

            const result = await collection.deleteOne(data);

            return `${result.deletedCount} documents deleted with success`;
        } catch (error) {
            return `${error}`;
        } finally {
            await this.close();
        }
    };

    async editValues(collectionName, filter, data) {
        try {
            await this.open();

            const collection = this.database.collection(collectionName);

            const result = await collection.updateOne(filter, data);

            return `${result.modifiedCount} modified document(s) with success`;
        } catch (error) {
            return `${error}`;
        } finally {
            await this.close();
        }
    };

    async logs(ip) {
        try {
            await this.open();

            let requestIP = await this.getDocuments("logs", {
                ip: ip
            });

            if (requestIP.length < 1) {
                let data = {
                    ip: ip,
                    attempts: 0,
                    dateNow: Date.now()
                };

                let result = await this.addValues("logs", data);

                return console.log(`User added to login attempt count`);
            } else {
                let log = requestIP[0];

                let blackList = await this.getDocuments("blacklist", {
                    ip: log.ip
                });

                if (log.attempts < 3) {
                    let result = await this.editValues("logs", {
                        ip: log.ip
                    }, {
                        $set: {
                            attempts: (log.attempts + 1)
                        }
                    });
                } else {
                    await this.addValues("blacklist", {
                        ip: log.ip
                    });
                }
            }
        } catch (error) {
            console.log;
        } finally {
            await this.close();
        }
    };
};

const conn = new DatabaseConnection(process.env.URI);

global.conn = conn;
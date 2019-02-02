import privateConfig from '../../config/private';
import { MongoClient, Db } from 'mongodb';

const COLLECTION_API_REQUESTS = 'api_requests';

let connection: Promise<Db>;

export async function db() {
  if (connection) {
    return connection;
  }

  if (privateConfig.mongodbUri) {
    connection = new MongoClient(privateConfig.mongodbUri, {
      useNewUrlParser: true,
      reconnectInterval: 10000,
      reconnectTries: 180,
      autoReconnect: true
    })
      .connect()
      .then(async client => {
        let db = client.db(privateConfig.mongodbDatabase);

        return db;
      })
      .catch(err => {
        console.error(err);

        return null;
      });

    return connection;
  }

  return null;
}

export async function registerApiRequest() {
  let database = await db();

  if (database) {
    let date = new Date();
    let id = new Date(date.getTime() - date.getTimezoneOffset() * 60000).toISOString().split('T')[0];

    let collection = database.collection(COLLECTION_API_REQUESTS);

    return collection.findOneAndUpdate(
      {
        query: {
          _id: id
        }
      },
      {
        $inc: {
          views: 1
        },
        $setOnInsert: {
          _id: id
        }
      },
      {
        upsert: true
      }
    );
  }
}

export async function sumApiRequests() {
  let database = await db();

  if (database) {
    let collection = database.collection(COLLECTION_API_REQUESTS);

    let result = await collection.aggregate([
      {
        $group: {
          _id: '',
          sum: {
            $sum: '$views'
          }
        }
      }
    ]);

    return await result.toArray().then(data => data[0].sum);
  }

  return 0;
}

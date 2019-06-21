import privateConfig from '../../config/private';
import { MongoClient, Db } from 'mongodb';
import * as memoizee from 'memoizee';
import { Stats } from '../../types/mongodb';

const COLLECTION_API_REQUESTS = 'api_requests';

export const db = memoizee<() => Promise<Db>>(
  async function() {
    if (privateConfig.mongodbUri) {
      return new MongoClient(privateConfig.mongodbUri, {
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
    }

    return null;
  },
  {
    promise: true
  }
);

export async function registerApiRequest(spriteCollection: string) {
  let database = await db();

  if (database) {
    let datetime = new Date();
    let date = new Date(datetime.getTime() - datetime.getTimezoneOffset() * 60000).toISOString().split('T')[0];
    let id = [date, spriteCollection].join('-');

    let collection = database.collection(COLLECTION_API_REQUESTS);

    return collection
      .findOneAndUpdate(
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
            _id: id,
            date: date,
            spriteCollection: spriteCollection
          }
        },
        {
          upsert: true
        }
      )
      .catch(e => {
        console.error(e);
      });
  }
}

export async function line() {
  let database = await db();

  if (database) {
    let collection = database.collection(COLLECTION_API_REQUESTS);

    let result = await collection.aggregate([
      {
        $group: {
          _id: '$date',
          sum: {
            $sum: '$views'
          }
        }
      },
      {
        $sort: { _id: 1 }
      }
    ]);

    return await result.toArray().then(data => {
      let result = {};

      data.forEach(row => {
        result[row._id] = row.sum;
      });

      return result;
    });
  }

  return 0;
}

export async function total() {
  let database = await db();

  if (database) {
    let collection = database.collection(COLLECTION_API_REQUESTS);

    let result = await collection.aggregate([
      {
        $group: {
          _id: '',
          sum: {
            $sum: '$views'
          },
          since: {
            $min: '$date'
          }
        }
      }
    ]);

    return await result.toArray().then(data => {
      return {
        sum: data[0].sum,
        since: data[0].since
      };
    });
  }

  let now = new Date();

  return {
    sum: 0,
    since: `${now.getFullYear()}-${now.getMonth() + 1}-${now.getDate()}`
  };
}

export async function getStats() {
  let stats: Stats;

  if (privateConfig.mongodbUri) {
    let [statsLine, statsTotal] = await Promise.all([line(), total()]);

    stats = {
      line: statsLine,
      total: statsTotal
    };
  }

  return stats;
}

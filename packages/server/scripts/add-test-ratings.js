// Script to add test rating data to MongoDB
// Run with: node scripts/add-test-ratings.js

import { MongoClient } from 'mongodb';

const MONGODB_URI = 'mongodb://localhost:27017';
const DB_NAME = 'govariants'; // 根据你的实际数据库名称调整

async function addTestRatings() {
  const client = new MongoClient(MONGODB_URI);
  
  try {
    await client.connect();
    console.log('Connected to MongoDB');
    
    const db = client.db(DB_NAME);
    const usersCollection = db.collection('users');
    
    // 测试评分数据
    const testRatings = {
      'baduk': {
        rating: 1500,
        rd: 350,
        vol: 0.06
      },
      'phantom': {
        rating: 1450,
        rd: 300,
        vol: 0.05
      },
      'capture': {
        rating: 1600,
        rd: 250,
        vol: 0.04
      },
      'tetris': {
        rating: 1400,
        rd: 400,
        vol: 0.07
      },
      'pyramid': {
        rating: 1550,
        rd: 280,
        vol: 0.05
      }
    };
    
    // 为现有用户添加评分
    const users = await usersCollection.find({}).toArray();
    console.log(`Found ${users.length} users`);
    
    for (const user of users) {
      if (user.username) {
        console.log(`Adding ratings for user: ${user.username}`);
        
        // 随机选择一些变体添加评分
        const userRatings = {};
        const variants = Object.keys(testRatings);
        const numVariants = Math.floor(Math.random() * variants.length) + 2; // 2-6个变体
        
        const selectedVariants = variants
          .sort(() => 0.5 - Math.random())
          .slice(0, numVariants);
        
        for (const variant of selectedVariants) {
          const baseRating = testRatings[variant];
          // 添加一些随机变化
          userRatings[variant] = {
            rating: baseRating.rating + (Math.random() - 0.5) * 200,
            rd: baseRating.rd + (Math.random() - 0.5) * 100,
            vol: baseRating.vol + (Math.random() - 0.5) * 0.02
          };
        }
        
        // 更新用户评分
        await usersCollection.updateOne(
          { _id: user._id },
          { $set: { ranking: userRatings } }
        );
        
        console.log(`  Added ratings for ${Object.keys(userRatings).length} variants`);
      }
    }
    
    console.log('Test ratings added successfully!');
    
  } catch (error) {
    console.error('Error adding test ratings:', error);
  } finally {
    await client.close();
    console.log('Disconnected from MongoDB');
  }
}

// 运行脚本
addTestRatings().catch(console.error);

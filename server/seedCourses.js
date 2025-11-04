const mongoose = require('mongoose');
const fs = require('fs');
const Course = require('./models/course');

async function seedCourses() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    const coursesData = JSON.parse(fs.readFileSync('./data/course-data.json', 'utf-8'));

    await Course.deleteMany({}); // Clear existing courses
    await Course.insertMany(coursesData);

    console.log('Courses seeded successfully');
    mongoose.disconnect();
  } catch (error) {
    console.error('Error seeding courses:', error);
  }
}

seedCourses();
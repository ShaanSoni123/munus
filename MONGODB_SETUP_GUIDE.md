# 🗄️ MongoDB Atlas Setup Guide

## **Step 1: Create MongoDB Atlas Account**

1. **Go to [MongoDB Atlas](https://www.mongodb.com/atlas)**
2. **Click "Try Free"**
3. **Create an account or sign in**

## **Step 2: Create a Cluster**

1. **Click "Build a Database"**
2. **Choose "FREE" tier (M0)**
3. **Select your preferred cloud provider (AWS/Google Cloud/Azure)**
4. **Choose a region close to you**
5. **Click "Create"**

## **Step 3: Set Up Database Access**

1. **Go to "Database Access" in the left sidebar**
2. **Click "Add New Database User"**
3. **Choose "Password" authentication**
4. **Create a username and password (save these!)**
5. **Select "Read and write to any database"**
6. **Click "Add User"**

## **Step 4: Set Up Network Access**

1. **Go to "Network Access" in the left sidebar**
2. **Click "Add IP Address"**
3. **Click "Allow Access from Anywhere" (for Railway deployment)**
4. **Click "Confirm"**

## **Step 5: Get Your Connection String**

1. **Go back to "Database"**
2. **Click "Connect" on your cluster**
3. **Choose "Connect your application"**
4. **Copy the connection string**
5. **Replace `<password>` with your database user password**
6. **Replace `<dbname>` with `munus`

**Your connection string should look like:**
```
mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/munus?retryWrites=true&w=majority
```

## **Step 6: Add to Railway Environment Variables**

1. **Go to your Railway project**
2. **Click "Variables" tab**
3. **Add:**
   ```
   MONGODB_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/munus?retryWrites=true&w=majority
   MONGODB_DB_NAME=munus
   ```

---

**🎉 That's it! Your MongoDB database is ready for production use.** 
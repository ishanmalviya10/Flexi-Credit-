# MongoDB Integration Guide

ChemSense now supports MongoDB for persistent data storage! This guide will help you set up and connect to MongoDB.

## Quick Setup

### Option 1: MongoDB Atlas (Recommended - Free Tier Available)

1. **Create a MongoDB Atlas Account**
   - Visit [MongoDB Atlas](https://www.mongodb.com/cloud/atlas/register)
   - Sign up for a free account

2. **Create a Cluster**
   - Click "Build a Database"
   - Choose "FREE" tier (M0 Sandbox)
   - Select your preferred cloud provider and region
   - Click "Create Cluster"

3. **Configure Database Access**
   - Go to "Database Access" in the left sidebar
   - Click "Add New Database User"
   - Create a username and password
   - Set permissions to "Read and write to any database"

4. **Configure Network Access**
   - Go to "Network Access" in the left sidebar
   - Click "Add IP Address"
   - Click "Allow Access from Anywhere" (0.0.0.0/0)
   - Confirm

5. **Get Your Connection String**
   - Go back to "Database" (Clusters)
   - Click "Connect" on your cluster
   - Choose "Connect your application"
   - Copy the connection string (looks like: `mongodb+srv://username:<password>@cluster0.xxxxx.mongodb.net/`)
   - Replace `<password>` with your actual database password

6. **Add to Replit Secrets**
   - In your Replit project, go to Tools → Secrets
   - Create a new secret:
     - Key: `MONGODB_URI`
     - Value: Your connection string (e.g., `mongodb+srv://myuser:mypassword@cluster0.xxxxx.mongodb.net/chemsense`)
   - Click "Add Secret"

7. **Restart the Application**
   - The app will automatically detect the `MONGODB_URI` environment variable
   - You'll see "✅ MongoDB connected successfully to ChemSense database" in the logs

### Option 2: Local MongoDB (Development)

If you're running MongoDB locally:

```bash
# Set the environment variable
export MONGODB_URI="mongodb://localhost:27017/chemsense"
```

## How It Works

### Automatic Fallback
The application automatically detects whether MongoDB is configured:

- **With `MONGODB_URI`**: Uses MongoDB for persistent storage
- **Without `MONGODB_URI`**: Falls back to in-memory storage (data lost on restart)

### Storage Architecture

```
server/storage.ts
├── IStorage (Interface)
├── MemStorage (In-memory implementation)
├── MongoDBStorage (MongoDB implementation)
└── storage (Exports the active storage instance)
```

### Collections

The MongoDB database (`chemsense`) contains four collections:

1. **experiments** - Chemical hazard predictions and analysis
2. **lab_notes** - Research documentation and observations
3. **compliance_tasks** - Safety compliance deadline tracking
4. **safety_reports** - Incident documentation

### Data Model

Each document includes:
- `id` (number) - Auto-incrementing ID for consistency with frontend
- `createdAt` (Date) - Timestamp
- Collection-specific fields (compound data, notes, tasks, reports)

## Verifying Connection

Check the server logs when starting the application:

### Success
```
🔗 Initializing MongoDB storage...
✅ MongoDB connected successfully to ChemSense database
```

### Using In-Memory (No MongoDB configured)
```
💾 Using in-memory storage (MONGODB_URI not set)
```

### Connection Error (Falls back to in-memory)
```
🔗 Initializing MongoDB storage...
❌ MongoDB connection error: [error details]
Failed to connect to MongoDB, falling back to in-memory storage
```

## Troubleshooting

### Common Issues

**Connection timeout / Network error**
- Check that you've allowed access from all IP addresses (0.0.0.0/0) in MongoDB Atlas Network Access
- Verify your connection string is correct

**Authentication failed**
- Double-check your username and password in the connection string
- Make sure you replaced `<password>` with your actual password
- Verify the database user has proper permissions

**Database not found**
- The database `chemsense` will be created automatically on first write
- No need to manually create it

## Migration from In-Memory to MongoDB

When you add the `MONGODB_URI` secret:

1. The application will switch to MongoDB on next restart
2. **Note**: Existing in-memory data will be lost (it was temporary)
3. Start fresh with MongoDB persistent storage
4. All new data will be saved permanently

## Benefits of MongoDB Integration

✅ **Persistent Storage** - Data survives server restarts  
✅ **Scalability** - Handle thousands of experiments and notes  
✅ **Flexible Schema** - Easy to add new fields as needed  
✅ **Cloud-Ready** - Deploy anywhere with MongoDB Atlas  
✅ **Automatic Fallback** - Works without configuration for testing

## Environment Variables

| Variable | Required | Description | Example |
|----------|----------|-------------|---------|
| `MONGODB_URI` | No | MongoDB connection string | `mongodb+srv://user:pass@cluster.mongodb.net/chemsense` |

## Security Best Practices

1. ✅ **Never commit connection strings** to version control
2. ✅ **Use Replit Secrets** for storing `MONGODB_URI`
3. ✅ **Use strong passwords** for MongoDB users
4. ✅ **Limit IP access** in production (currently set to 0.0.0.0/0 for convenience)
5. ✅ **Rotate credentials** regularly

---

**Questions?** Check the [MongoDB Atlas Documentation](https://www.mongodb.com/docs/atlas/) or ask for help!

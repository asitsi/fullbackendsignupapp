const express = require('express');
const { ApolloServer } = require('apollo-server-express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const { typeDefs, resolvers } = require('./schema/schema');
const { context } = require('./utils/auth');
const restRouter = require('./routes/rest');
const cors = require('cors');

const app = express();

mongoose.connect('mongodb+srv://asitsingh18:KrJdWjeV8eqJJqum@cluster0.vjyrqmw.mongodb.net/', { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
app.use('/api', restRouter);

async function startServer() {
    apolloServer = new ApolloServer({
        typeDefs,
  resolvers,
  context,
    });
    await apolloServer.start();
    apolloServer.applyMiddleware({ app });
}

startServer();

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

module.exports = {
    port: 3001,
    // This is your MYSQL Database configuration
    db: {
        name: 'spine',
        password: '',
        username: 'root'
    },
    app: {
        name: 'MEAN - A Modern Stack - Test'
    },
    facebook: {
        clientID: '824770854361592',
        clientSecret: '8599cce8d0533a0ef57ab6c68c395e9c',
        callbackURL: 'http://localhost:3000/api/auth/facebook/callback'
    },
    twitter: {
        clientID: 'vz7LHCrSnlS5W2YD1vNfL0R0m',
        clientSecret: 'km6YqqfomFfqLMeWx5ciFCP460FCB0FbT0BomVnDVyYAgZMDGc',
        callbackURL: 'http://localhost:3000/api/auth/twitter/callback'
    },
    github: {
        clientID: 'APP_ID',
        clientSecret: 'APP_SECRET',
        callbackURL: 'http://localhost:3000/api/auth/github/callback'
    },
    google: {
        realm: 'http://localhost:3000/',
        clientID: '972158488032-4ovojau9eipa5voof0aaoh1qv0v0k0tt.apps.googleusercontent.com',
        clientSecret: 'C2zw8rtG4jDBM0LDQrlauGyr',
        callbackURL: 'http://localhost:3000/api/auth/google/callback'
    }
};

module.exports = {
    // This is your MYSQL Database configuration
    db: {
        host:'localhost',
        username: 'root',
        password: 'tinga',
        name: 'spine',
        port:3306
    },
    app: {
        name: 'Anerve'
    },
    facebook: {
        clientID: '824770854361592',
        clientSecret: '8599cce8d0533a0ef57ab6c68c395e9c',
        callbackURL: 'http://34.214.120.75:3000/api/auth/facebook/callback'
    },
    twitter: {
        clientID: 'vz7LHCrSnlS5W2YD1vNfL0R0m',
        clientSecret: 'km6YqqfomFfqLMeWx5ciFCP460FCB0FbT0BomVnDVyYAgZMDGc',
        callbackURL: 'http://34.214.120.75:3000/api/auth/twitter/callback'
    },
    github: {
        clientID: 'APP_ID',
        clientSecret: 'APP_SECRET',
        callbackURL: 'http://34.214.120.75:3000/api/auth/github/callback'
    },
    google: {
        realm: 'http://34.214.120.75:3000/',
        clientID: '972158488032-4ovojau9eipa5voof0aaoh1qv0v0k0tt.apps.googleusercontent.com',
        clientSecret: 'C2zw8rtG4jDBM0LDQrlauGyr',
        callbackURL: 'http://34.214.120.75:3000/api/auth/google/callback'
    },
    tumblr: {
        clientID: 'e5BirzJiZ65hTYdhn152Qxz7AAG150HK6i25Y4QL10VH1Uv1Cd',
        clientSecret: 'Di2DiV3CBgHhvHajDoKhIUM6w0A7RVTWqiv18RL619uHduCC6D',
        callbackURL: 'http://34.214.120.75:3000/api/auth/tumblr/callback'
    },
    instagram: {
        realm: 'http://34.214.120.75:3000/',
        clientID: '54247227ad9a474992a090171abe7bfe',
        clientSecret: 'd33eb782538a40a8bc54d636055f4138',
        callbackURL: 'http://34.214.120.75:3000/api/auth/instagram/callback'
    }
};

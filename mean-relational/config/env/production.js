module.exports = {
    // This is your MYSQL Database configuration
    db: {
        name: 'spine',
        password: '',
        username: 'root1',
        host:'192.168.100.88',
        //host:'192.168.1.88',
        port:3306
    },
    app: {
        name: 'Anerve'
    },
// You will need to get your own client id's before this will work properly
    facebook: {
        clientID: '824770854361592',
        clientSecret: '8599cce8d0533a0ef57ab6c68c395e9c',
        callbackURL: 'http://localhost:3000/api/auth/facebook/callback'
    },
    twitter: {
        clientID: 'qiRHRqGv8Xx0SgZ8B0f9I2fqb',
        clientSecret: '5Tt474fnjccFgXwEjYtlM6OjQxgAcczaKppSjBhMbjBTYtKFD0',
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

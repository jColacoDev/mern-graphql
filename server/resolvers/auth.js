const {gql} = require('apollo-server-express')

const me = () => 'jColaco'

module.exports = {
    Query: {
        me
    }
};

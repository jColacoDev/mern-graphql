export const POST_DATA =`
    _id
    content
    images {
        url
        public_id
    }
    postedBy {
        _id
        username
    }
`
export const USER_INFO =`
    _id
    name
    username
    email
    images {
        url
        public_id
    }
    about
    createdAt
    updatedAt
`
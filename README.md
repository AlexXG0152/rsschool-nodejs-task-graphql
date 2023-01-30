## Assignment: Graphql

### Tasks

1. Add logic to the restful endpoints (users, posts, profiles, member-types folders in ./src/routes).  
   1.1. npm run test - 100%  
2. Add logic to the graphql endpoint (graphql folder in ./src/routes).  
Constraints and logic for gql queries should be done based on restful implementation.  
For each subtask provide an example of POST body in the PR.  
All dynamic values should be sent via "variables" field.  
If the properties of the entity are not specified, then return the id of it.  
`userSubscribedTo` - these are users that the current user is following.  
`subscribedToUser` - these are users who are following the current user.  

   * Get gql requests:  
   2.1. Get users, profiles, posts, memberTypes - 4 operations in one query.  
   2.2. Get user, profile, post, memberType by id - 4 operations in one query.  
   2.3. Get users with their posts, profiles, memberTypes.  
   2.4. Get user by id with his posts, profile, memberType.  
   2.5. Get users with their `userSubscribedTo`, profile.  
   2.6. Get user by id with his `subscribedToUser`, posts.  
   2.7. Get users with their `userSubscribedTo`, `subscribedToUser` (additionally for each user in `userSubscribedTo`, `subscribedToUser` add their `userSubscribedTo`, `subscribedToUser`).  
   * Create gql requests:
   2.8. Create user.  
   2.9. Create profile.  
   2.10. Create post.  
   2.11. [InputObjectType](https://graphql.org/graphql-js/type/#graphqlinputobjecttype) for DTOs.  
   * Update gql requests:  
   2.12. Update user.  
   2.13. Update profile.  
   2.14. Update post.  
   2.15. Update memberType.  
   2.16. Subscribe to; unsubscribe from.  
   2.17. [InputObjectType](https://graphql.org/graphql-js/type/#graphqlinputobjecttype) for DTOs.  

3. Solve `n+1` graphql problem with [dataloader](https://www.npmjs.com/package/dataloader) package in all places where it should be used.  
   You can use only one "findMany" call per loader to consider this task completed.  
   It's ok to leave the use of the dataloader even if only one entity was requested. But additionally (no extra score) you can optimize the behavior for such cases => +1 db call is allowed per loader.  
   3.1. List where the dataloader was used with links to the lines of code (creation in gql context and call in resolver).  
4. Limit the complexity of the graphql queries by their depth with [graphql-depth-limit](https://www.npmjs.com/package/graphql-depth-limit) package.
   4.1. Provide a link to the line of code where it was used.  
   4.2. Specify a POST body of gql query that ends with an error due to the operation of the rule. Request result should be with `errors` field (and with or without `data:null`) describing the error.  

### Description  

All dependencies to complete this task are already installed.  
You are free to install new dependencies as long as you use them.  
App template was made with fastify, but you don't need to know much about fastify to get the tasks done.  
All templates for restful endpoints are placed, just fill in the logic for each of them.  
Use the "db" property of the "fastify" object as a database access methods ("db" is an instance of the DB class => ./src/utils/DB/DB.ts).  
Body, params have fixed structure for each restful endpoint due to jsonSchema (schema.ts files near index.ts).  

### Description for the 1 task

If the requested entity is missing - send 404 http code.  
If operation cannot be performed because of the client input - send 400 http code.  
You can use methods of "reply" to set http code or throw an [http error](https://github.com/fastify/fastify-sensible#fastifyhttperrors).  
If operation is successfully completed, then return an entity or array of entities from http handler (fastify will stringify object/array and will send it).  

Relation fields are only stored in dependent/child entities. E.g. profile stores "userId" field.  
You are also responsible for verifying that the relations are real. E.g. "userId" belongs to the real user.  
So when you delete dependent entity, you automatically delete relations with its parents.  
But when you delete parent entity, you need to delete relations from child entities yourself to keep the data relevant.
(In the next rss-school task, you will use a full-fledged database that also can automatically remove child entities when the parent is deleted, verify keys ownership and instead of arrays for storing keys, you will use additional "join" tables)  

To determine that all your restful logic works correctly => run the script "npm run test".  
But be careful because these tests are integration (E.g. to test "delete" logic => it creates the entity via a "create" endpoint).  

### Description for the 2 task  

You are free to create your own gql environment as long as you use predefined graphql endpoint (./src/routes/graphql/index.ts).  
(or stick to the [default code-first](https://github.dev/graphql/graphql-js/blob/ffa18e9de0ae630d7e5f264f72c94d497c70016b/src/__tests__/starWarsSchema.ts))  

### Description for the 3 task

If you have chosen a non-default gql environment, then the connection of some functionality may differ, be sure to report this in the PR.  

### Description for the 4 task  

If you have chosen a non-default gql environment, then the connection of some functionality may differ, be sure to report this in the PR.  
Limit the complexity of the graphql queries by their depth with "graphql-depth-limit" package.  
E.g. User can refer to other users via properties `userSubscribedTo`, `subscribedToUser` and users within them can also have `userSubscribedTo`, `subscribedToUser` and so on.  
Your task is to add a new rule (created by "graphql-depth-limit") in [validation](https://graphql.org/graphql-js/validation/) to limit such nesting to (for example) 6 levels max.

QUERIES
(I don't know how this corresponds to the expected and correct task, but it works 😉😉😉).

2.1.
`query twoOne {
    users{
        id
        firstName
        lastName
        email
        subscribedToUserIds
    }
    profiles{
        id
        avatar
        sex
        birthday
        country
        street
        city
        memberTypeId
        userId
    }
    posts{
        id
        title
        content
        userId
    }
    memberTypes {
        id
        discount
        monthPostsLimit
    }
}`

2.2.
`query twoTwo(
    $user_id:String,
    $profile_id:String,
    $post_id:String,
    $member_type_id:String) {
    user(id: $user_id) {
        id
        firstName
        lastName
        email
        subscribedToUserIds
    }
    profile(id:$profile_id){
        id
        avatar
        sex
        birthday
        country
        street
        city
        memberTypeId
        userId
    }
    post(id:$post_id){
        id
        title
        content
        userId
    }
    memberType(id:$member_type_id) {
        id
        discount
        monthPostsLimit
    }
}`

2.3.
`query twoThree{
    allUsersData {
        user {
            id
            firstName
            lastName
            email
            subscribedToUserIds
        }
        subscribedToUser{
            id
            firstName
            lastName
            email
            subscribedToUserIds
        }
        profile{
            id
            avatar
            sex
            birthday
            country
            street
            city
            memberTypeId
            userId
        }
        posts {
            id
            title
            content
            userId
        }
    }
}`

2.4.
`query twoFour
(
    $user_id:String
)
    {
    oneUserAllData(id: $user_id)  {
        user{
            id
            firstName
            lastName
            email
            subscribedToUserIds
    }
        profile{
            id
            avatar
            sex
            birthday
            country
            street
            city
            memberTypeId
            userId
        }
        posts {
            id
            title
            content
            userId
        }
        memberType{
            id
            discount
            monthPostsLimit
        }
    }
}`

2.5.
`query twoFive
(
    $user_id:String
)
    {
    oneUserAllData(id: $user_id)  {
        user{
            id
            firstName
            lastName
            email
            subscribedToUserIds
    }
        subscribedToUser{
            id
            firstName
            lastName
        }
        posts{
        id
        title
        content
        userId
    }
    }
}`

2.6.
`query twoSix
    {
    allUsersData{
        user{
            id
            firstName
            lastName
            email
            subscribedToUserIds
    }
        subscribedToUser{
            id
            firstName
            lastName
        }
        profile{
            id
            avatar
            sex
            birthday
            country
            street
            city
            memberTypeId
            userId
        }
    }
}`

2.7.
`query twoSeven
    {
    allUsersData{
        user{
            id
            firstName
            lastName
            email
            subscribedToUserIds
    }
        subscribedToUser{
            id
            firstName
            lastName
        }
    }
}`

2.8.
`mutation createUser{
    createUser(
        firstName: "firstName2",
        lastName: "lastName2",
        email: "email2@email2.email"
        )
        {
            id
            firstName
            lastName
            email
            subscribedToUserIds
    }
}`

2.9.
`mutation createProfile ($user_id:String!){
    createProfile(
        avatar:"http:somehost.com/123123123123",
        sex:"male",
        birthday:"01.01.1900",
        country:"USA",
        street:"street",
        city:"city",
        memberTypeId:"basic",
        userId:$user_id
        )
        {
        id
        avatar
        sex
        birthday
        country
        street
        city
        memberTypeId
        userId
    }
}`

2.10.
`mutation createPost($user_id:String!){
    createPost(
        title:"Post #!",
        content:"Content Content Content Content Content Content ",
        userId:$user_id
        )
        {
            id
            title
            content
            userId
    }
}`

2.12.
`mutation updateUser{
    updateUser(
        id: "156a0ba7-6220-4393-b591-d37c6ced75be",
        firstName: "UPDATED_firstName",
        lastName: "UPDATED_lastName",
        email: "UPDATED_email@email.email"
        )
        {
            id
            firstName
            lastName
            email
    }
}`

2.13.
`mutation updateProfile ($profile_id:String!){
    updateProfile(
        id: $profile_id,
        avatar:"http:somehost.com/CANADA",
        sex:"male",
        birthday:"01.01.1900",
        country:"CANADA",
        street:"street",
        city:"city",
        memberTypeId:"basic",
        )
        {
        avatar
        sex
        birthday
        country
        street
        city
        memberTypeId
        userId
    }
}`

2.14.
`mutation updatePost($post_id:String!){
    updatePost(
        id: $post_id,
        title:"Post #1",
        content:"NEW_Content NEW_Content NEW_Content NEW_Content NEW_Content NEW_Content ",
        )
        {
        title
        content
        userId
    }
}`

2.15
`mutation updateMemberType($memberType_id:String!){
    updateMemberType(
            id: $memberType_id,
            discount:"97",
            monthPostsLimit:"3",
        )
        {
            id
            discount
            monthPostsLimit
    }
}`

2.16
`mutation subscribeTo{
    subscribeTo(
        id: "0260c934-305a-45cb-b26c-eb4eeec6a69d",
        subscribeToID: "199ff634-acdc-484e-aa80-4e4c930b3106",
        ) {
            id
            firstName
            lastName
            email
            subscribedToUserIds
    }
}`

2.16.
`mutation unsubscribeFrom{
    unsubscribeFrom(
        id: "3e0320b4-7ccc-4298-b195-aee4ccbc2164",
        unsubscribeFromID: "edad28dc-3520-4a20-8f76-9588d12de4f6",
        ) {
            id
            firstName
            lastName
            email
            subscribedToUserIds
    }
}`

-----------
`query AllUsers {
    users {
        id
        firstName
        lastName
        email
        subscribedToUserIds
    }
}`

-----------

`query someData {
    users{
        firstName
        id
    }
    profiles{
        avatar
        country
    }
    posts{
        title
        userId
    }
    memberTypes {
        id
        discount
        monthPostsLimit
    }
}`

-----------

`query evil ($id:String!){
  users {
      id
    user(id: $id) {
        id
      users {
          id
        user(id: $id) {
            id
          users {
              id
            user(id: $id) {
                id
              users {
                  id
                user(id: $id) {
                    id
                  users {
                      id
                    user(id: $id) {
                        id
                      users {
                          id
                        user(id: $id) {
                            id
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
}`

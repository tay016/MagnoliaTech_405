import {
  graphql,
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLString,
} from 'graphql';

var schema = new GraphQLSchema({
  query: new GraphQLObjectType({
    name: 'RootQueryType',
    fields: {
      hello: {
        type: GraphQLString,
        resolve() {
          return 'world';
        },
      },
    },
  }),
});
var query = '{ hello }';

graphql(schema, query).then((result) => {
  // Prints
  // {
  //   data: { hello: "world" }
  // }
  console.log(result);
});

// var query = '{ BoyHowdy }';

// graphql(schema, query).then((result) => {
//   // Prints
//   // {
//   //   errors: [
//   //     { message: 'Cannot query field BoyHowdy on RootQueryType',
//   //       locations: [ { line: 1, column: 3 } ] }
//   //   ]
//   // }
//   console.log(result);
// });
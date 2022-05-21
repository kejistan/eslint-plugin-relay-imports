/**
 * @fileoverview Forbid imports of relay code generated by other files
 * @author Sean Nicolay
 */
"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require("../../../lib/rules/no-external-imports"),
  RuleTester = require("eslint").RuleTester;

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester({
  parserOptions: { ecmaVersion: 6, sourceType: "module" },
});
ruleTester.run("no-external-imports", rule, {
  valid: [
    `
      import {TestFragment_fragment$key} from "./__generated__/TestFragment_fragment.graphql";

      graphql\`
        fragment TestFragment_fragment on Nothing {
          __typename
        }
      \`
    `,
    `
      import {RefetchQuery} from "./__generated__/RefetchQuery.graphql";

      graphql\`
        fragment TestFragment_fragment on Nothing @refetchable(queryName: "RefetchQuery") {
          __typename
        }
      \`
    `,
    `
      import SomeQuery from "./__generated__/SomeQuery.graphql";
    `,
    `
      import SomeQuery, {SomeQuery as SomeQueryType} from "./__generated__/SomeQuery.graphql";
    `,
  ],

  invalid: [
    {
      code: `
        import {TestFragment_fragment$key} from "./__generated__/TestFragment_fragment.graphql";
      `,
      errors: [
        {
          message:
            "TestFragment_fragment is not defined in the current module. Importing types generated from other modules introduces fragile coupling.",
          type: "ImportSpecifier",
        },
      ],
    },
    {
      code: `
        import SomeQuery, {SomeQuery$data} from "./__generated__/SomeQuery.graphql";
      `,
      errors: [
        {
          message:
            "SomeQuery is not defined in the current module. Importing types generated from other modules introduces fragile coupling.",
          type: "ImportSpecifier",
        },
      ],
    },
  ],
});

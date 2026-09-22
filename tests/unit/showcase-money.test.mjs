import assert from "node:assert/strict";
import test from "node:test";
import { centsToDollars, dollarsToCents } from "../../lib/publishing/money.ts";

test("Dami money helpers keep model values in integer cents", () => {
  assert.equal(dollarsToCents(12.34), 1234);
  assert.equal(dollarsToCents(12.345), 1235);
  assert.equal(centsToDollars(1234), 12.34);
});

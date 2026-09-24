import assert from "node:assert/strict";
import fs from "node:fs";
import test from "node:test";
import {buildBoardScene,semanticX} from "../src/trace-layout.mjs";
const steady=JSON.parse(fs.readFileSync("examples/steady.json","utf8")),review=JSON.parse(fs.readFileSync("examples/human-review.json","utf8"));
test("semantic count equals trace steps",()=>{const s=buildBoardScene(steady);assert.equal(s.semanticPegs.length,steady.steps.length);assert.ok(s.cosmeticPegs.length>s.semanticPegs.length);});
test("review example ends paused",()=>{const s=buildBoardScene(review);assert.equal(s.status,"review_required");assert.equal(s.semanticPegs.at(-1).kind,"review");assert.equal(s.semanticPegs.at(-1).state,"paused");});
test("noul values move monotonically",()=>{assert.ok(semanticX({kind:"judgment",summary:{primitive:"noul",answer:.1}})<semanticX({kind:"judgment",summary:{primitive:"noul",answer:.9}}));});
test("steady example exposes normal deviation",()=>assert.equal(buildBoardScene(steady).deviation.band,"normal"));

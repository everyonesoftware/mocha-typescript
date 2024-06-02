import { TestRunner } from "@everyonesoftware/test-typescript";
import { MochaTestRunner } from "../sources";

export function createTestRunner(): TestRunner
{
    return MochaTestRunner.create();
}